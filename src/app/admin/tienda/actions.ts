"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAccess } from "@/lib/auth/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseStoragePath } from "@/lib/utils";

export async function subirProducto(formData: FormData) {
  await requireAdminAccess();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const precio = Number(formData.get("precio"));
  const imagen = formData.get("imagen");

  if (!nombre || !categoria || Number.isNaN(precio) || precio <= 0) {
    throw new Error("Completa nombre, categoria y un precio valido.");
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
      categoria,
      imagen_url: publicUrl,
    },
  ]);

  if (dbError) {
    await supabaseAdmin.storage.from("tienda").remove([fileName]);
    throw dbError;
  }

  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
  revalidatePath("/");
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

  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
  revalidatePath("/");
}
