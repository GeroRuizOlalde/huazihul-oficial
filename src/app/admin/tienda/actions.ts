"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAccess } from "@/lib/auth/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getErrorMessage, getSupabaseStoragePath } from "@/lib/utils";

type ActualizarProductoPayload = {
  id: string;
  precio: number;
  precioPromocional: number | null;
  stock: number;
};

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

function withSchemaHint(error: unknown) {
  const message = getErrorMessage(error);

  if (/precio_promocional|stock/i.test(message)) {
    return new Error(
      "Faltan las columnas stock y/o precio_promocional en la tabla productos. Ejecuta la migracion SQL antes de usar esta funcion."
    );
  }

  return error instanceof Error ? error : new Error(message);
}

function revalidateTienda() {
  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
  revalidatePath("/");
}

export async function subirProducto(formData: FormData) {
  await requireAdminAccess();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const precio = parsePrecio(formData.get("precio"));
  const precioPromocional = parsePrecioPromocional(
    formData.get("precio_promocional"),
    precio
  );
  const stock = parseStock(formData.get("stock"));
  const imagen = formData.get("imagen");

  if (!nombre || !categoria) {
    throw new Error("Completa nombre y categoria.");
  }

  if (!(imagen instanceof File) || imagen.size === 0) {
    throw new Error("Debes subir una imagen valida.");
  }

  if (!imagen.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  if (imagen.size > 5 * 1024 * 1024) {
    throw new Error("La imagen supera el limite de 5 MB.");
  }

  const fileExt = imagen.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `productos/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("tienda")
    .upload(fileName, imagen, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("tienda").getPublicUrl(fileName);

  const { error: dbError } = await supabaseAdmin.from("productos").insert([
    {
      nombre,
      descripcion: descripcion || null,
      precio,
      precio_promocional: precioPromocional,
      stock,
      en_stock: stock > 0,
      categoria,
      imagen_url: publicUrl,
    },
  ]);

  if (dbError) {
    await supabaseAdmin.storage.from("tienda").remove([fileName]);
    throw withSchemaHint(dbError);
  }

  revalidateTienda();
}

export async function actualizarProductoAction({
  id,
  precio,
  precioPromocional,
  stock,
}: ActualizarProductoPayload) {
  await requireAdminAccess();

  const productoId = String(id ?? "").trim();
  const precioFinal = Number(precio);
  const stockFinal = Math.floor(Number(stock));
  const precioPromocionalFinal =
    precioPromocional === null ? null : Number(precioPromocional);

  if (!productoId) {
    throw new Error("Producto invalido.");
  }

  if (!Number.isFinite(precioFinal) || precioFinal <= 0) {
    throw new Error("El precio debe ser mayor a 0.");
  }

  if (!Number.isFinite(stockFinal) || stockFinal < 0) {
    throw new Error("El stock debe ser 0 o mayor.");
  }

  if (
    precioPromocionalFinal !== null &&
    (!Number.isFinite(precioPromocionalFinal) ||
      precioPromocionalFinal <= 0 ||
      precioPromocionalFinal >= precioFinal)
  ) {
    throw new Error("El precio promocional debe ser mayor a 0 y menor al precio.");
  }

  const { error } = await supabaseAdmin
    .from("productos")
    .update({
      precio: precioFinal,
      precio_promocional: precioPromocionalFinal,
      stock: stockFinal,
      en_stock: stockFinal > 0,
    })
    .eq("id", productoId);

  if (error) {
    throw withSchemaHint(error);
  }

  revalidateTienda();
}

export async function eliminarProductoAction(id: string, imagenUrl: string) {
  await requireAdminAccess();

  const fileName = getSupabaseStoragePath(imagenUrl, "tienda");

  if (fileName) {
    await supabaseAdmin.storage.from("tienda").remove([fileName]);
  }

  const { error } = await supabaseAdmin.from("productos").delete().eq("id", id);

  if (error) {
    throw error;
  }

  revalidateTienda();
}
