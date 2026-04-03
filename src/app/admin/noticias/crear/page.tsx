"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/utils";

type PreviewItem = {
  file: File;
  preview: string;
};

export default function CrearNoticiaPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [titulo, setTitulo] = useState("");
  const [etiqueta, setEtiqueta] = useState("Institucional");
  const [descripcion, setDescripcion] = useState("");

  const [imagenes, setImagenes] = useState<PreviewItem[]>([]);

  useEffect(() => {
    return () => {
      imagenes.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [imagenes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);

    const nuevasImagenes = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImagenes((prev) => [...prev, ...nuevasImagenes]);

    // Permite volver a seleccionar el mismo archivo
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImagenes((prev) => {
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

    if (imagenes.length === 0) {
      setErrorMsg("Subí al menos una imagen para la noticia.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const uploadedPaths: string[] = [];
    const uploadedUrls: string[] = [];

    try {
      for (const imagen of imagenes) {
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

        uploadedUrls.push(publicUrl);
      }

      const imagen_url = uploadedUrls[0];
      const galeria = uploadedUrls.slice(1);

      const { error: insertError } = await supabase.from("noticias").insert([
        {
          titulo: tituloLimpio,
          etiqueta,
          descripcion: descripcionLimpia,
          imagen_url,
          galeria,
        },
      ]);

      if (insertError) throw insertError;

      router.push("/admin/noticias");
      router.refresh();
    } catch (error: unknown) {
      // Si algo falla después de subir archivos, intentamos limpiarlos
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("noticias").remove(uploadedPaths);
      }

      setErrorMsg(getErrorMessage(error, "Error al crear la noticia."));
    } finally {
      setIsLoading(false);
    }
  };

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
          Nueva <span className="text-red-600">Publicación</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* COLUMNA PRINCIPAL */}
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
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Título
                </Label>
                <Input
                  placeholder="Título impactante..."
                  className="h-14 border-zinc-200 text-xl font-bold focus-visible:ring-red-600"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Contenido
                </Label>
                <textarea
                  className="min-h-[300px] w-full rounded-xl border border-zinc-200 p-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Desarrollá la noticia aquí..."
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
                Imágenes (la primera será la principal)
              </Label>

              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {imagenes.map((item, i) => (
                  <div
                    key={`${item.file.name}-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200"
                  >
                    <img
                      src={item.preview}
                      alt={`Preview ${i + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-2 top-2 rounded-lg bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 w-full bg-red-600 py-1 text-center text-[8px] font-bold uppercase text-white">
                        Principal
                      </div>
                    )}
                  </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 transition-all hover:border-red-600 hover:bg-zinc-50">
                  <Upload className="mb-2 h-6 w-6 text-zinc-400" />
                  <span className="text-[9px] font-bold uppercase text-zinc-500">
                    Subir Fotos
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

        {/* COLUMNA LATERAL */}
        <div className="space-y-6">
          <Card className="sticky top-6 border-none shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Categoría
                </Label>
                <select
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-red-600"
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
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-red-600 py-7 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Publicar Noticia
                    </>
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
