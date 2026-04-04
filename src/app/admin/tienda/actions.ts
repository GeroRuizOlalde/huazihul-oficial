"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { requireAdminAccess } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sortTalles } from "@/lib/tienda";
import { getErrorMessage, getSupabaseStoragePath } from "@/lib/utils";

type ActualizarProductoPayload = {
  id: string;
  precio: number;
};

type ProductoVarianteInput = {
  talle: string;
  stock: number;
};

type ProductoInventarioPersistido = {
  id: string;
  talles: unknown;
  variantes: unknown;
  stock: number | string | null;
};

export type TiendaActionResult =
  | { ok: true }
  | { ok: false; error: string };

function ok(): TiendaActionResult {
  return { ok: true };
}

function fail(error: unknown): TiendaActionResult {
  const message = getErrorMessage(error);

  if (
    /precio_promocional|stock|talles|variantes/i.test(message) &&
    /column|schema cache|does not exist|could not find|has no field/i.test(message)
  ) {
    return {
      ok: false,
      error:
        "Faltan las columnas stock, precio_promocional, talles y/o variantes en la tabla productos. Ejecuta las migraciones SQL de tienda antes de guardar cambios, especialmente 20260403_tienda_variantes.sql para los talles con stock.",
    };
  }

  if (/row-level security|permission denied|not allowed/i.test(message)) {
    return {
      ok: false,
      error:
        "Supabase rechazo la operacion por permisos. Revisa las policies de la tabla productos y del bucket tienda para usuarios admin autenticados.",
    };
  }

  if (/bucket/i.test(message) && /not found/i.test(message)) {
    return {
      ok: false,
      error: "No existe el bucket de storage 'tienda' en Supabase.",
    };
  }

  return { ok: false, error: message };
}

function shouldFallbackToLegacyTalles(error: unknown) {
  const message = getErrorMessage(error);

  return /variantes/i.test(message) && !/precio_promocional|stock|talles/i.test(message);
}

function omitVariantes<T extends { variantes: unknown }>(payload: T): Omit<T, "variantes"> {
  const { variantes, ...rest } = payload;
  void variantes;
  return rest;
}

async function getWriteClient() {
  return createAdminClient() ?? (await createClient());
}

function parsePrecio(value: FormDataEntryValue | null) {
  const precio = Number(value);

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error("Completa un precio valido.");
  }

  return precio;
}

function parsePrecioPromocional(
  value: FormDataEntryValue | null,
  precio: number
) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return null;
  }

  const precioPromocional = Number(rawValue);

  if (!Number.isFinite(precioPromocional) || precioPromocional <= 0) {
    throw new Error("El precio promocional debe ser mayor a 0.");
  }

  if (precioPromocional >= precio) {
    throw new Error("El precio promocional debe ser menor al precio normal.");
  }

  return precioPromocional;
}

function buildFallbackVariantesFromTalles(
  tallesValue: FormDataEntryValue | null,
  stockTotalValue: FormDataEntryValue | null
) {
  const rawTalles = String(tallesValue ?? "").trim();

  if (!rawTalles) {
    return [];
  }

  let parsedTalles: unknown;

  try {
    parsedTalles = JSON.parse(rawTalles);
  } catch {
    return [];
  }

  if (!Array.isArray(parsedTalles)) {
    return [];
  }

  const talles = sortTalles(
    Array.from(
      new Set(
        parsedTalles
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim().toUpperCase())
          .filter(Boolean)
      )
    )
  );

  if (talles.length === 0) {
    return [];
  }

  const totalStock = Math.max(Math.floor(Number(stockTotalValue ?? 0) || 0), 0);
  const stockBase = Math.floor(totalStock / talles.length);
  let remainder = totalStock % talles.length;

  return talles.map((talle) => {
    const extra = remainder > 0 ? 1 : 0;
    remainder = Math.max(0, remainder - 1);

    return {
      talle,
      stock: stockBase + extra,
    };
  }) satisfies ProductoVarianteInput[];
}

function parseVariantes(
  value: FormDataEntryValue | null,
  tallesValue?: FormDataEntryValue | null,
  stockTotalValue?: FormDataEntryValue | null
) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    const fallbackVariantes = buildFallbackVariantesFromTalles(
      tallesValue ?? null,
      stockTotalValue ?? null
    );

    if (fallbackVariantes.length > 0) {
      return fallbackVariantes;
    }

    throw new Error("Selecciona al menos un talle disponible.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawValue);
  } catch {
    const fallbackVariantes = buildFallbackVariantesFromTalles(
      tallesValue ?? null,
      stockTotalValue ?? null
    );

    if (fallbackVariantes.length > 0) {
      return fallbackVariantes;
    }

    throw new Error("No pudimos interpretar los talles del producto.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Los talles del producto tienen un formato invalido.");
  }

  const variantesMap = new Map<string, number>();

  for (const item of parsed) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const talle =
      typeof item.talle === "string" ? item.talle.trim().toUpperCase() : "";
    const stock = Number(item.stock);

    if (!talle) {
      continue;
    }

    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      throw new Error(`El stock del talle ${talle} debe ser 0 o mayor.`);
    }

    variantesMap.set(talle, Math.floor(stock));
  }

  const talles = sortTalles(Array.from(variantesMap.keys()));

  if (talles.length === 0) {
    throw new Error("Selecciona al menos un talle disponible.");
  }

  if (talles.length > 30) {
    throw new Error("Demasiados talles cargados para un solo producto.");
  }

  return talles.map((talle) => ({
    talle,
    stock: variantesMap.get(talle) ?? 0,
  })) satisfies ProductoVarianteInput[];
}

function parsePersistedTalles(value: unknown) {
  if (Array.isArray(value)) {
    return sortTalles(
      Array.from(
        new Set(
          value
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim().toUpperCase())
            .filter(Boolean)
        )
      )
    );
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsePersistedTalles(parsed);
    }
  } catch {
    return [];
  }

  return [];
}

function parsePersistedVariantes(value: unknown) {
  const source =
    typeof value === "string"
      ? (() => {
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        })()
      : value;

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const talle =
        typeof item.talle === "string" ? item.talle.trim().toUpperCase() : "";
      const stock = Number(item.stock);

      if (!talle || !Number.isFinite(stock)) {
        return null;
      }

      return {
        talle,
        stock: Math.max(0, Math.floor(stock)),
      };
    })
    .filter((item): item is ProductoVarianteInput => item !== null);
}

function hasExpectedInventory(
  snapshot: ProductoInventarioPersistido | null,
  expectedTalles: string[]
) {
  if (expectedTalles.length === 0) {
    return true;
  }

  if (!snapshot) {
    return false;
  }

  const persistedTalles = parsePersistedTalles(snapshot.talles);
  const persistedVariantes = sortTalles(
    parsePersistedVariantes(snapshot.variantes).map((variante) => variante.talle)
  );

  const normalizedExpected = sortTalles(
    Array.from(new Set(expectedTalles.map((talle) => talle.trim().toUpperCase())))
  );

  const tallesMatch =
    persistedTalles.length === normalizedExpected.length &&
    normalizedExpected.every((talle) => persistedTalles.includes(talle));

  const variantesMatch =
    persistedVariantes.length === normalizedExpected.length &&
    normalizedExpected.every((talle) => persistedVariantes.includes(talle));

  return tallesMatch || variantesMatch;
}

async function verifyAndRepairInventory({
  supabase,
  productoId,
  talles,
  variantes,
  stock,
  snapshot,
}: {
  supabase: SupabaseClient;
  productoId: string;
  talles: string[];
  variantes: ProductoVarianteInput[];
  stock: number;
  snapshot: ProductoInventarioPersistido | null;
}): Promise<TiendaActionResult | null> {
  if (hasExpectedInventory(snapshot, talles)) {
    return null;
  }

  console.error("Tienda: inventario no persistido tras guardar", {
    productoId,
    talles,
    variantes,
    snapshot,
  });

  const repairPayload = {
    talles,
    variantes,
    stock,
    en_stock: stock > 0,
  };

  const { data: repairedRow, error: repairError } = await supabase
    .from("productos")
    .update(repairPayload)
    .eq("id", productoId)
    .select("id,talles,variantes,stock")
    .maybeSingle();

  if (repairError) {
    return fail(repairError);
  }

  if (hasExpectedInventory(repairedRow as ProductoInventarioPersistido | null, talles)) {
    return null;
  }

  console.error("Tienda: inventario sigue sin persistirse despues del reintento", {
    productoId,
    talles,
    variantes,
    repairedRow,
  });

  return fail(
    "El producto se guardo pero Supabase no persistio los talles/variantes. Revisa si hay un trigger, policy o automatizacion en la tabla productos que este reemplazando esos campos."
  );
}

function revalidateTienda() {
  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
  revalidatePath("/");
}

export async function subirProducto(
  formData: FormData
): Promise<TiendaActionResult> {
  let fileName: string | null = null;
  let productoCreadoId: string | null = null;

  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();

    const nombre = String(formData.get("nombre") ?? "").trim();
    const descripcion = String(formData.get("descripcion") ?? "").trim();
    const categoria = String(formData.get("categoria") ?? "").trim();
    const precio = parsePrecio(formData.get("precio"));
    const precioPromocional = parsePrecioPromocional(
      formData.get("precio_promocional"),
      precio
    );
    const variantes = parseVariantes(
      formData.get("variantes"),
      formData.get("talles"),
      formData.get("stock_total")
    );
    const talles = variantes.map((variante) => variante.talle);
    const stock = variantes.reduce(
      (total, variante) => total + variante.stock,
      0
    );
    const imagen = formData.get("imagen");

    if (!nombre || !categoria) {
      return fail("Completa nombre y categoria.");
    }

    if (!(imagen instanceof File) || imagen.size === 0) {
      return fail("Debes subir una imagen valida.");
    }

    if (!imagen.type.startsWith("image/")) {
      return fail("El archivo debe ser una imagen.");
    }

    if (imagen.size > 5 * 1024 * 1024) {
      return fail("La imagen supera el limite de 5 MB.");
    }

    const fileExt = imagen.name.split(".").pop()?.toLowerCase() || "jpg";
    fileName = `productos/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("tienda")
      .upload(fileName, imagen, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return fail(uploadError);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("tienda").getPublicUrl(fileName);

    const payload = {
      nombre,
      descripcion: descripcion || null,
      precio,
      precio_promocional: precioPromocional,
      stock,
      en_stock: stock > 0,
      talles,
      variantes,
      categoria,
      imagen_url: publicUrl,
    };

    let insertedRow: ProductoInventarioPersistido | null = null;
    let { data: insertData, error: dbError } = await supabase
      .from("productos")
      .insert([payload])
      .select("id,talles,variantes,stock")
      .single();

    if (dbError && shouldFallbackToLegacyTalles(dbError)) {
      const legacyPayload = omitVariantes(payload);
      const fallback = await supabase
        .from("productos")
        .insert([legacyPayload])
        .select("id,talles,variantes,stock")
        .single();
      insertData = fallback.data;
      dbError = fallback.error;
    }

    if (dbError) {
      await supabase.storage.from("tienda").remove([fileName]);
      return fail(dbError);
    }

    insertedRow = (insertData as ProductoInventarioPersistido | null) ?? null;
    productoCreadoId = insertedRow?.id ?? null;

    const inventoryResult = await verifyAndRepairInventory({
      supabase,
      productoId: insertedRow?.id ?? "",
      talles,
      variantes,
      stock,
      snapshot: insertedRow,
    });

    if (inventoryResult) {
      if (productoCreadoId) {
        await supabase.from("productos").delete().eq("id", productoCreadoId);
      }

      await supabase.storage.from("tienda").remove([fileName]);
      return inventoryResult;
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    if (fileName) {
      const supabase = await getWriteClient();

      if (productoCreadoId) {
        await supabase.from("productos").delete().eq("id", productoCreadoId);
      }

      await supabase.storage.from("tienda").remove([fileName]);
    }

    return fail(error);
  }
}

export async function editarProductoAction(
  formData: FormData
): Promise<TiendaActionResult> {
  let newFileName: string | null = null;

  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();

    const productoId = String(formData.get("id") ?? "").trim();
    const nombre = String(formData.get("nombre") ?? "").trim();
    const descripcion = String(formData.get("descripcion") ?? "").trim();
    const categoria = String(formData.get("categoria") ?? "").trim();
    const imagenActualUrl = String(formData.get("imagen_actual_url") ?? "").trim();
    const precio = parsePrecio(formData.get("precio"));
    const precioPromocional = parsePrecioPromocional(
      formData.get("precio_promocional"),
      precio
    );
    const variantes = parseVariantes(
      formData.get("variantes"),
      formData.get("talles"),
      formData.get("stock_total")
    );
    const talles = variantes.map((variante) => variante.talle);
    const stock = variantes.reduce(
      (total, variante) => total + variante.stock,
      0
    );
    const imagen = formData.get("imagen");

    if (!productoId) {
      return fail("Producto invalido.");
    }

    if (!nombre || !categoria) {
      return fail("Completa nombre y categoria.");
    }

    let imagenUrl = imagenActualUrl;

    if (imagen instanceof File && imagen.size > 0) {
      if (!imagen.type.startsWith("image/")) {
        return fail("El archivo debe ser una imagen.");
      }

      if (imagen.size > 5 * 1024 * 1024) {
        return fail("La imagen supera el limite de 5 MB.");
      }

      const fileExt = imagen.name.split(".").pop()?.toLowerCase() || "jpg";
      newFileName = `productos/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tienda")
        .upload(newFileName, imagen, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return fail(uploadError);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("tienda").getPublicUrl(newFileName);

      imagenUrl = publicUrl;
    }

    const payload: {
      nombre: string;
      descripcion: string | null;
      precio: number;
      precio_promocional: number | null;
      stock: number;
      en_stock: boolean;
      talles: string[];
      variantes: ProductoVarianteInput[];
      categoria: string;
      imagen_url?: string;
    } = {
      nombre,
      descripcion: descripcion || null,
      precio,
      precio_promocional: precioPromocional,
      stock,
      en_stock: stock > 0,
      talles,
      variantes,
      categoria,
    };

    if (imagenUrl) {
      payload.imagen_url = imagenUrl;
    }

    let updatedRow: ProductoInventarioPersistido | null = null;
    let data: ProductoInventarioPersistido | null = null;
    let error: unknown = null;

    const updateResult = await supabase
      .from("productos")
      .update(payload)
      .eq("id", productoId);

    error = updateResult.error;

    if (error && shouldFallbackToLegacyTalles(error)) {
      const legacyPayload = omitVariantes(payload);
      const fallback = await supabase
        .from("productos")
        .update(legacyPayload)
        .eq("id", productoId)
        .select("id,talles,variantes,stock")
        .single();
      data = (fallback.data as ProductoInventarioPersistido | null) ?? null;
      error = fallback.error;
    }

    if (!error && !data) {
      const selected = await supabase
        .from("productos")
        .select("id,talles,variantes,stock")
        .eq("id", productoId)
        .single();
      data = (selected.data as ProductoInventarioPersistido | null) ?? null;
      error = selected.error;
    }

    if (error) {
      if (newFileName) {
        await supabase.storage.from("tienda").remove([newFileName]);
      }

      return fail(error);
    }

    updatedRow = data;

    const inventoryResult = await verifyAndRepairInventory({
      supabase,
      productoId,
      talles,
      variantes,
      stock,
      snapshot: updatedRow,
    });

    if (inventoryResult) {
      return inventoryResult;
    }

    if (newFileName && imagenActualUrl) {
      const oldFileName = getSupabaseStoragePath(imagenActualUrl, "tienda");

      if (oldFileName) {
        await supabase.storage.from("tienda").remove([oldFileName]);
      }
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    if (newFileName) {
      const supabase = await createClient();
      await supabase.storage.from("tienda").remove([newFileName]);
    }

    return fail(error);
  }
}

export async function actualizarProductoAction({
  id,
  precio,
}: ActualizarProductoPayload): Promise<TiendaActionResult> {
  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();

    const productoId = String(id ?? "").trim();
    const precioFinal = Number(precio);

    if (!productoId) {
      return fail("Producto invalido.");
    }

    if (!Number.isFinite(precioFinal) || precioFinal <= 0) {
      return fail("El precio debe ser mayor a 0.");
    }

    const { error } = await supabase
      .from("productos")
      .update({
        precio: precioFinal,
      })
      .eq("id", productoId);

    if (error) {
      const message = getErrorMessage(error);

      if (/productos_precio_promocional_valido|precio_promocional/i.test(message)) {
        return fail(
          "El precio rapido no pudo guardarse porque la promo actual queda igual o por encima del nuevo precio. Edita el producto y ajusta la promo desde el modal."
        );
      }

      return fail(error);
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    return fail(error);
  }
}

export async function eliminarProductoAction(
  id: string,
  imagenUrl: string
): Promise<TiendaActionResult> {
  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();
    const fileName = getSupabaseStoragePath(imagenUrl, "tienda");

    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from("tienda")
        .remove([fileName]);

      if (storageError) {
        return fail(storageError);
      }
    }

    const { error } = await supabase.from("productos").delete().eq("id", id);

    if (error) {
      return fail(error);
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    return fail(error);
  }
}
