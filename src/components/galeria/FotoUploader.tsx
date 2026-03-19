"use client";

import { useState } from "react";
import { Camera, Upload, X, Loader2, CheckCircle2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SubirFoto() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [etiqueta, setEtiqueta] = useState("Rugby");
  const [nombreAutor, setNombreAutor] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      // 1. Subir al Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("galeria")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("galeria").getPublicUrl(fileName);

      // 3. Insertar en tabla con nombre_socio
      const { error: insertError } = await supabase.from("galeria").insert([
        {
          url: publicUrl,
          descripcion: descripcion.trim(),
          etiqueta,
          nombre_socio: nombreAutor.trim() || null,
          aprobado: false,
        },
      ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setFile(null);
        setPreview(null);
        setDescripcion("");
        setNombreAutor("");
        setEtiqueta("Rugby");
      }, 2500);
    } catch (error) {
      console.error(error);
      alert("Error al subir la foto. Intentá de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto rounded-none bg-red-600 px-8 py-6 font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition-transform hover:bg-red-700 active:scale-95">
          <Upload className="mr-2 h-4 w-4" />
          Subir mi Foto
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden rounded-3xl border-none bg-white p-0 sm:max-w-md">
        <DialogHeader className="bg-zinc-950 p-8 text-white">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            Compartí tu <span className="text-red-600">Mística</span>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="mb-4 h-16 w-16 animate-bounce text-green-500" />
            <h3 className="text-xl font-bold uppercase tracking-tight text-zinc-900">
              ¡Foto enviada!
            </h3>
            <p className="mt-2 text-sm font-light text-zinc-500">
              Un administrador la revisará pronto para publicarla.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            {/* SELECTOR DE FOTO */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Seleccioná tu foto
              </Label>
              <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-red-600">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                      }}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-1">
                    <Camera className="h-8 w-8 text-zinc-300" />
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Click para elegir
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* NOMBRE DEL AUTOR */}
            <div className="space-y-2">
              <Label
                htmlFor="fu-autor"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >
                <User className="h-3 w-3" />
                Tu nombre{" "}
                <span className="normal-case tracking-normal text-zinc-400">
                  (aparecerá como autor)
                </span>
              </Label>
              <Input
                id="fu-autor"
                placeholder="Ej: Juan Pérez"
                className="h-11 rounded-xl border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-red-600"
                value={nombreAutor}
                onChange={(e) => setNombreAutor(e.target.value)}
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="space-y-2">
              <Label
                htmlFor="fu-desc"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >
                ¿Qué está pasando en la foto?
              </Label>
              <Input
                id="fu-desc"
                required
                placeholder="Ej: El tercer tiempo con los pibes..."
                className="h-11 rounded-xl border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-red-600"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* CATEGORÍA */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Categoría
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {["Rugby", "Hockey", "Club", "Social"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEtiqueta(cat)}
                    className={`rounded-xl border py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                      etiqueta === cat
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={uploading || !file}
              className="w-full rounded-xl bg-zinc-900 py-6 font-bold uppercase tracking-widest text-white transition-all hover:bg-red-600 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Enviar para Revisión"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}