"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function subirProducto(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const precio = parseFloat(formData.get("precio") as string);
  const categoria = formData.get("categoria") as string;
  const imagen = formData.get("imagen") as File;

  // 1. Subir a Storage
  const fileExt = imagen.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('tienda')
    .upload(fileName, imagen);

  if (uploadError) throw uploadError;

  // 2. URL Pública
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('tienda')
    .getPublicUrl(fileName);

  // 3. Insertar DB
  const { error: dbError } = await supabaseAdmin
    .from('productos')
    .insert([{ nombre, descripcion, precio, categoria, imagen_url: publicUrl }]);

  if (dbError) throw dbError;

  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
}

export async function eliminarProductoAction(id: string, imagenUrl: string) {
  const fileName = imagenUrl.split('/').pop();
  if (fileName) {
    await supabaseAdmin.storage.from('tienda').remove([fileName]);
  }
  await supabaseAdmin.from('productos').delete().eq('id', id);
  
  revalidatePath("/admin/tienda");
  revalidatePath("/tienda");
}