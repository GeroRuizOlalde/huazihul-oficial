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

type ProductoDeleteSnapshot = {
  id: string;
  imagen_url: string | null;
  imagenes_extra: unknown;
};

type ProductoForDuplication = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precio_promocional: number | null;
  stock: number;
  en_stock: boolean;
  talles: string[];
  variantes: ProductoVarianteInput[];
  categoria: string;
  imagen_url: string;
  imagenes_extra: string[];
  colores: string[];
  visible: boolean;
};

type UploadedImage = {
  path: string;
  url: string;
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
    /precio_promocional|stock|talles|variantes|visible|colores|imagenes_extra/i.test(
      message
    ) &&
    /column|schema cache|does not exist|could not find|has no field/i.test(message)
  ) {
    return {
      ok: false,
      error:
        "Faltan columnas de tienda en la tabla productos. Ejecuta las migraciones SQL de tienda, incluyendo 20260403_tienda_variantes.sql y la nueva migracion de catalogo extendido para visibilidad, colores y galeria.",
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

  return (
    /variantes/i.test(message) &&
    !/precio_promocional|stock|talles|visible|colores|imagenes_extra/i.test(message)
  );
}

function omitVariantes<T extends { variantes: unknown }>(
  payload: T
): Omit<T, "variantes"> {
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

function parseBoolean(value: FormDataEntryValue | null, fallback = true) {
  const rawValue = String(value ?? "").trim().toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  return !["false", "0", "off", "no"].includes(rawValue);
}

function parseJsonArray(rawValue: string) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return rawValue.split(",");
  }
}

function normalizeColor(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function normalizeImageUrl(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseColores(value: FormDataEntryValue | null) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return [];
  }

  const items = parseJsonArray(rawValue);
  const seen = new Set<string>();
  const colores: string[] = [];

  for (const item of items) {
    const color = normalizeColor(item);
    const key = color.toLowerCase();

    if (!color || seen.has(key)) {
      continue;
    }

    seen.add(key);
    colores.push(color);
  }

  return colores;
}

function parseImagenesExtraActuales(value: FormDataEntryValue | null) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return [];
  }

  const items = parseJsonArray(rawValue);
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const item of items) {
    const url = normalizeImageUrl(item);

    if (!url || seen.has(url)) {
      continue;
    }

    seen.add(url);
    urls.push(url);
  }

  return urls;
}

function getNewImageFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((item): item is File => item instanceof File && item.size > 0);
}

function validateImageFile(file: File, label: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${label} debe ser una imagen.`);
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`${label} supera el limite de 5 MB.`);
  }
}

async function uploadImages(
  supabase: SupabaseClient,
  files: File[],
  prefix = "productos"
) {
  const uploaded: UploadedImage[] = [];

  try {
    for (const file of files) {
      validateImageFile(file, "La imagen");

      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${prefix}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tienda")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("tienda").getPublicUrl(path);

      uploaded.push({
        path,
        url: publicUrl,
      });
    }

    return uploaded;
  } catch (error) {
    if (uploaded.length > 0) {
      await supabase.storage
        .from("tienda")
        .remove(uploaded.map((image) => image.path));
    }

    throw error;
  }
}

async function cleanupUploadedImages(
  supabase: SupabaseClient,
  images: UploadedImage[]
) {
  if (images.length === 0) {
    return;
  }

  await supabase.storage
    .from("tienda")
    .remove(images.map((image) => image.path));
}

function buildFallbackVariantesFromTalles(
  tallesValue: FormDataEntryValue | null,
  stockTotalValue: FormDataEntryValue | null
) {
  const rawTalles = String(tallesValue ?? "").trim();

  if (!rawTalles) {
    return [];
  }

  const parsedTalles = parseJsonArray(rawTalles);
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

function getPayloadBase(formData: FormData) {
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
  const stock = variantes.reduce((total, variante) => total + variante.stock, 0);
  const colores = parseColores(formData.get("colores"));
  const visible = parseBoolean(formData.get("visible"), true);

  if (!nombre || !categoria) {
    throw new Error("Completa nombre y categoria.");
  }

  return {
    nombre,
    descripcion: descripcion || null,
    categoria,
    precio,
    precioPromocional,
    variantes,
    talles,
    stock,
    colores,
    visible,
  };
}

function buildProductPayload({
  nombre,
  descripcion,
  categoria,
  precio,
  precioPromocional,
  variantes,
  talles,
  stock,
  colores,
  visible,
  imagenUrl,
  imagenesExtra,
}: {
  nombre: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
  precioPromocional: number | null;
  variantes: ProductoVarianteInput[];
  talles: string[];
  stock: number;
  colores: string[];
  visible: boolean;
  imagenUrl?: string;
  imagenesExtra: string[];
}) {
  return {
    nombre,
    descripcion,
    categoria,
    precio,
    precio_promocional: precioPromocional,
    stock,
    en_stock: stock > 0,
    talles,
    variantes,
    colores,
    visible,
    imagenes_extra: imagenesExtra,
    ...(imagenUrl ? { imagen_url: imagenUrl } : {}),
  };
}

function parseImageUrlsFromSnapshot(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return parseImageUrlsFromSnapshot(parsed);
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

async function getReferencedImagePaths(
  supabase: SupabaseClient,
  productoId: string,
  urls: string[]
) {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  if (uniqueUrls.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("productos")
    .select("id,imagen_url,imagenes_extra");

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ProductoDeleteSnapshot[];
  const pathsToRemove: string[] = [];

  for (const url of uniqueUrls) {
    const stillUsed = rows.some((row) => {
      if (row.id === productoId) {
        return false;
      }

      const referenced = new Set<string>([
        row.imagen_url?.trim() ?? "",
        ...parseImageUrlsFromSnapshot(row.imagenes_extra),
      ]);

      return referenced.has(url);
    });

    if (stillUsed) {
      continue;
    }

    const path = getSupabaseStoragePath(url, "tienda");

    if (path) {
      pathsToRemove.push(path);
    }
  }

  return pathsToRemove;
}

function revalidateTienda() {
  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
  revalidatePath("/");
}

export async function subirProducto(
  formData: FormData
): Promise<TiendaActionResult> {
  let productoCreadoId: string | null = null;
  let uploadedImages: UploadedImage[] = [];

  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();
    const base = getPayloadBase(formData);
    const imagen = formData.get("imagen");
    const imagenesExtraFiles = getNewImageFiles(formData, "imagenes_extra_nuevas");

    if (!(imagen instanceof File) || imagen.size === 0) {
      return fail("Debes subir una imagen valida.");
    }

    uploadedImages = await uploadImages(supabase, [imagen, ...imagenesExtraFiles]);
    const [mainImage, ...extraImages] = uploadedImages;

    const payload = buildProductPayload({
      ...base,
      imagenUrl: mainImage.url,
      imagenesExtra: extraImages.map((image) => image.url),
    });

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
      await cleanupUploadedImages(supabase, uploadedImages);
      return fail(dbError);
    }

    insertedRow = (insertData as ProductoInventarioPersistido | null) ?? null;
    productoCreadoId = insertedRow?.id ?? null;

    const inventoryResult = await verifyAndRepairInventory({
      supabase,
      productoId: insertedRow?.id ?? "",
      talles: base.talles,
      variantes: base.variantes,
      stock: base.stock,
      snapshot: insertedRow,
    });

    if (inventoryResult) {
      if (productoCreadoId) {
        await supabase.from("productos").delete().eq("id", productoCreadoId);
      }

      await cleanupUploadedImages(supabase, uploadedImages);
      return inventoryResult;
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    if (uploadedImages.length > 0) {
      const supabase = await getWriteClient();

      if (productoCreadoId) {
        await supabase.from("productos").delete().eq("id", productoCreadoId);
      }

      await cleanupUploadedImages(supabase, uploadedImages);
    }

    return fail(error);
  }
}

export async function editarProductoAction(
  formData: FormData
): Promise<TiendaActionResult> {
  let newUploadedImages: UploadedImage[] = [];

  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();
    const productoId = String(formData.get("id") ?? "").trim();
    const imagenActualUrl = String(formData.get("imagen_actual_url") ?? "").trim();
    const base = getPayloadBase(formData);
    const imagen = formData.get("imagen");
    const imagenesExtraActuales = parseImagenesExtraActuales(
      formData.get("imagenes_extra_actuales")
    );
    const imagenesExtraFiles = getNewImageFiles(formData, "imagenes_extra_nuevas");

    if (!productoId) {
      return fail("Producto invalido.");
    }

    let imagenUrl = imagenActualUrl;

    if (imagen instanceof File && imagen.size > 0) {
      const [mainImage] = await uploadImages(supabase, [imagen]);
      newUploadedImages.push(mainImage);
      imagenUrl = mainImage.url;
    }

    if (imagenesExtraFiles.length > 0) {
      const uploadedExtras = await uploadImages(supabase, imagenesExtraFiles);
      newUploadedImages = [...newUploadedImages, ...uploadedExtras];
    }

    const payload = buildProductPayload({
      ...base,
      imagenUrl,
      imagenesExtra: [
        ...imagenesExtraActuales,
        ...newUploadedImages
          .filter((image) => image.url !== imagenUrl)
          .map((image) => image.url),
      ],
    });

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
      await cleanupUploadedImages(supabase, newUploadedImages);
      return fail(error);
    }

    updatedRow = data;

    const inventoryResult = await verifyAndRepairInventory({
      supabase,
      productoId,
      talles: base.talles,
      variantes: base.variantes,
      stock: base.stock,
      snapshot: updatedRow,
    });

    if (inventoryResult) {
      return inventoryResult;
    }

    if (imagen instanceof File && imagen.size > 0 && imagenActualUrl) {
      const oldMainPath = getSupabaseStoragePath(imagenActualUrl, "tienda");

      if (oldMainPath) {
        await supabase.storage.from("tienda").remove([oldMainPath]);
      }
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    if (newUploadedImages.length > 0) {
      const supabase = await getWriteClient();
      await cleanupUploadedImages(supabase, newUploadedImages);
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

export async function toggleVisibilidadProductoAction(
  id: string,
  visible: boolean
): Promise<TiendaActionResult> {
  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();
    const productoId = String(id ?? "").trim();

    if (!productoId) {
      return fail("Producto invalido.");
    }

    const { error } = await supabase
      .from("productos")
      .update({ visible })
      .eq("id", productoId);

    if (error) {
      return fail(error);
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    return fail(error);
  }
}

export async function duplicarProductoAction(
  id: string
): Promise<TiendaActionResult> {
  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();
    const productoId = String(id ?? "").trim();

    if (!productoId) {
      return fail("Producto invalido.");
    }

    const { data, error } = await supabase
      .from("productos")
      .select(
        "id,nombre,descripcion,precio,precio_promocional,stock,en_stock,talles,variantes,categoria,imagen_url,imagenes_extra,colores,visible"
      )
      .eq("id", productoId)
      .maybeSingle();

    if (error) {
      return fail(error);
    }

    if (!data) {
      return fail("No encontramos el producto a duplicar.");
    }

    const producto = data as ProductoForDuplication;
    const payload = {
      nombre: `${producto.nombre} (Copia)`,
      descripcion: producto.descripcion,
      precio: producto.precio,
      precio_promocional: producto.precio_promocional,
      stock: producto.stock,
      en_stock: producto.en_stock,
      talles: producto.talles,
      variantes: producto.variantes,
      categoria: producto.categoria,
      imagen_url: producto.imagen_url,
      imagenes_extra: producto.imagenes_extra,
      colores: producto.colores,
      visible: false,
    };

    const { error: insertError } = await supabase.from("productos").insert([payload]);

    if (insertError) {
      return fail(insertError);
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    return fail(error);
  }
}

export async function eliminarProductoAction(
  id: string
): Promise<TiendaActionResult> {
  try {
    await requireAdminAccess();

    const supabase = await getWriteClient();
    const productoId = String(id ?? "").trim();

    if (!productoId) {
      return fail("Producto invalido.");
    }

    const { data: snapshot, error: snapshotError } = await supabase
      .from("productos")
      .select("id,imagen_url,imagenes_extra")
      .eq("id", productoId)
      .maybeSingle();

    if (snapshotError) {
      return fail(snapshotError);
    }

    const productSnapshot = snapshot as ProductoDeleteSnapshot | null;

    const { error } = await supabase.from("productos").delete().eq("id", productoId);

    if (error) {
      return fail(error);
    }

    if (productSnapshot) {
      const imageUrls = [
        productSnapshot.imagen_url ?? "",
        ...parseImageUrlsFromSnapshot(productSnapshot.imagenes_extra),
      ];
      const pathsToRemove = await getReferencedImagePaths(
        supabase,
        productoId,
        imageUrls
      );

      if (pathsToRemove.length > 0) {
        await supabase.storage.from("tienda").remove(pathsToRemove);
      }
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    return fail(error);
  }
}
