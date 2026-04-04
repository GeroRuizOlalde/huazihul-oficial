"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { getErrorMessage, getSupabaseStoragePath } from "@/lib/utils";

type ActualizarProductoPayload = {
  id: string;
  precio: number;
  precioPromocional: number | null;
  stock: number;
};

export type TiendaActionResult =
  | { ok: true }
  | { ok: false; error: string };

function ok(): TiendaActionResult {
  return { ok: true };
}

function fail(error: unknown): TiendaActionResult {
  const message = getErrorMessage(error);

  if (/precio_promocional|stock|talles/i.test(message)) {
    return {
      ok: false,
      error:
        "Faltan las columnas stock, precio_promocional y/o talles en la tabla productos. Ejecuta las migraciones SQL antes de guardar cambios en tienda.",
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

function parsePrecio(value: FormDataEntryValue | null) {
  const precio = Number(value);

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error("Completa un precio valido.");
  }

  return precio;
}

function parseStock(value: FormDataEntryValue | null) {
  const stock = Number(value);

  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error("El stock debe ser 0 o mayor.");
  }

  return Math.floor(stock);
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

function parseTalles(value: FormDataEntryValue | null) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return [];
  }

  let talles: string[] = [];

  if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
    try {
      const parsed = JSON.parse(rawValue);

      if (Array.isArray(parsed)) {
        talles = parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      talles = rawValue.split(",");
    }
  } else {
    talles = rawValue.split(",");
  }

  const normalizados = Array.from(
    new Set(
      talles
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean)
    )
  );

  if (normalizados.length > 20) {
    throw new Error("Demasiados talles cargados para un solo producto.");
  }

  return normalizados;
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

  try {
    await requireAdminAccess();

    const supabase = await createClient();

    const nombre = String(formData.get("nombre") ?? "").trim();
    const descripcion = String(formData.get("descripcion") ?? "").trim();
    const categoria = String(formData.get("categoria") ?? "").trim();
    const precio = parsePrecio(formData.get("precio"));
    const precioPromocional = parsePrecioPromocional(
      formData.get("precio_promocional"),
      precio
    );
    const stock = parseStock(formData.get("stock"));
    const talles = parseTalles(formData.get("talles"));
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

    const { error: dbError } = await supabase.from("productos").insert([
      {
        nombre,
        descripcion: descripcion || null,
        precio,
        precio_promocional: precioPromocional,
        stock,
        en_stock: stock > 0,
        talles,
        categoria,
        imagen_url: publicUrl,
      },
    ]);

    if (dbError) {
      await supabase.storage.from("tienda").remove([fileName]);
      return fail(dbError);
    }

    revalidateTienda();
    return ok();
  } catch (error) {
    if (fileName) {
      const supabase = await createClient();
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

    const supabase = await createClient();

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
    const stock = parseStock(formData.get("stock"));
    const talles = parseTalles(formData.get("talles"));
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
      categoria,
    };

    if (imagenUrl) {
      payload.imagen_url = imagenUrl;
    }

    const { error } = await supabase
      .from("productos")
      .update(payload)
      .eq("id", productoId);

    if (error) {
      if (newFileName) {
        await supabase.storage.from("tienda").remove([newFileName]);
      }

      return fail(error);
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
  precioPromocional,
  stock,
}: ActualizarProductoPayload): Promise<TiendaActionResult> {
  try {
    await requireAdminAccess();

    const supabase = await createClient();

    const productoId = String(id ?? "").trim();
    const precioFinal = Number(precio);
    const stockFinal = Math.floor(Number(stock));
    const precioPromocionalFinal =
      precioPromocional === null ? null : Number(precioPromocional);

    if (!productoId) {
      return fail("Producto invalido.");
    }

    if (!Number.isFinite(precioFinal) || precioFinal <= 0) {
      return fail("El precio debe ser mayor a 0.");
    }

    if (!Number.isFinite(stockFinal) || stockFinal < 0) {
      return fail("El stock debe ser 0 o mayor.");
    }

    if (
      precioPromocionalFinal !== null &&
      (!Number.isFinite(precioPromocionalFinal) ||
        precioPromocionalFinal <= 0 ||
        precioPromocionalFinal >= precioFinal)
    ) {
      return fail("El precio promocional debe ser mayor a 0 y menor al precio.");
    }

    const { error } = await supabase
      .from("productos")
      .update({
        precio: precioFinal,
        precio_promocional: precioPromocionalFinal,
        stock: stockFinal,
        en_stock: stockFinal > 0,
      })
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

export async function eliminarProductoAction(
  id: string,
  imagenUrl: string
): Promise<TiendaActionResult> {
  try {
    await requireAdminAccess();

    const supabase = await createClient();
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
