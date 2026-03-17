"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  AlertCircle,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PreviewItem = {
  file: File;
  preview: string;
};

export default function EditarNoticiaPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const supabase = useMemo(() => createClient(), []);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [titulo, setTitulo] = useState("");
  const [etiqueta, setEtiqueta] = useState("Institucional");
  const [descripcion, setDescripcion] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<PreviewItem[]>([]);

  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [newImages]);

  useEffect(() => {
    const fetchNoticia = async () => {
      if (!id) return;

      setIsLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("noticias")
        .select("id, titulo, etiqueta, descripcion, imagen_url, galeria")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErrorMsg("No se pudo cargar la noticia.");
        setIsLoading(false);
        return;
      }

      setTitulo(data.titulo || "");
      setEtiqueta(data.etiqueta || "Institucional");
      setDescripcion(data.descripcion || "");

      const galeria = Array.isArray(data.galeria) ? data.galeria : [];
      setExistingImages([data.imagen_url, ...galeria].filter(Boolean));

      setIsLoading(false);
    };

    fetchNoticia();
  }, [id, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);

    const nuevasImagenes = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...nuevasImagenes]);
    e.target.value = "";
  };

  const removeExisting = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setNewImages((prev) => {
      const imageToRemove = prev[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tituloLimpio = titulo.trim();
    const descripcionLimpia = descripcion.trim();

    if (!tituloLimpio) {
      setErrorMsg("Ingresá un título para la noticia.");
      return;
    }

    if (!descripcionLimpia) {
      setErrorMsg("Completá el contenido de la noticia.");
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      setErrorMsg("La noticia debe tener al menos una imagen.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    const uploadedPaths: string[] = [];

    try {
      let finalUrls = [...existingImages];

      for (const imagen of newImages) {
        const file = imagen.file;
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `publicaciones/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("noticias")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        uploadedPaths.push(filePath);

        const {
          data: { publicUrl },
        } = supabase.storage.from("noticias").getPublicUrl(filePath);

        finalUrls.push(publicUrl);
      }

      const imagen_url = finalUrls[0];
      const galeria = finalUrls.slice(1);

      const { error: updateError } = await supabase
        .from("noticias")
        .update({
          titulo: tituloLimpio,
          etiqueta,
          descripcion: descripcionLimpia,
          imagen_url,
          galeria,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/admin/noticias");
      router.refresh();
    } catch (err: any) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("noticias").remove(uploadedPaths);
      }

      setErrorMsg(err?.message || "Error al actualizar la noticia.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 pb-20 duration-500">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/noticias"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
          Editar <span className="text-red-600">Noticia</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-none shadow-sm">
            <CardContent className="space-y-6 p-6 md:p-8">
              {errorMsg && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="titulo"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                >
                  Título
                </Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="h-14 border-zinc-200 text-xl font-bold focus-visible:ring-red-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contenido"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                >
                  Contenido
                </Label>
                <textarea
                  id="contenido"
                  className="min-h-[300px] w-full rounded-xl border border-zinc-200 p-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-600"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* IMÁGENES */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 md:p-8">
              <Label className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Fotos de la noticia
              </Label>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {existingImages.map((src, i) => (
                  <div
                    key={`exist-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border-2 border-zinc-100"
                  >
                    <img
                      src={src}
                      alt={`Imagen existente ${i + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeExisting(i)}
                      className="absolute right-2 top-2 rounded-lg bg-zinc-900/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>

                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 w-full bg-zinc-900 py-1 text-center text-[8px] font-bold uppercase text-white">
                        Portada
                      </div>
                    )}
                  </div>
                ))}

                {newImages.map((item, i) => (
                  <div
                    key={`new-${item.file.name}-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border-2 border-red-100"
                  >
                    <img
                      src={item.preview}
                      alt={`Nueva imagen ${i + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeNew(i)}
                      className="absolute right-2 top-2 rounded-lg bg-red-600 p-1.5 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    <div className="absolute bottom-0 left-0 w-full bg-red-600 py-1 text-center text-[8px] font-bold uppercase text-white">
                      Nueva
                    </div>
                  </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 transition-all hover:border-red-600 hover:bg-zinc-50">
                  <Upload className="mb-2 h-6 w-6 text-zinc-400" />
                  <span className="text-[9px] font-bold uppercase text-zinc-500">
                    Añadir más
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6 border-none shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Categoría
                </Label>
                <select
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600"
                  value={etiqueta}
                  onChange={(e) => setEtiqueta(e.target.value)}
                >
                  <option value="Institucional">Institucional</option>
                  <option value="Rugby">Rugby</option>
                  <option value="Hockey">Hockey</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full rounded-2xl bg-red-600 py-7 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}