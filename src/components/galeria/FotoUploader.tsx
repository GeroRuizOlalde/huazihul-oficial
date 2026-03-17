"use client";

import { useState } from "react";
import { Camera, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
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
  const [etiqueta, setEtiqueta] = useState("Mística");
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
      // 1. Subir al Storage (Bucket: 'galeria')
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("galeria")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("galeria")
        .getPublicUrl(fileName);

      // 3. Insertar en tabla 'galeria' con aprobado: false
      const { error: insertError } = await supabase.from("galeria").insert([
        {
          url: publicUrl,
          descripcion,
          etiqueta,
          aprobado: false, // ¡Clave para que pase por moderación!
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
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-none uppercase font-bold tracking-widest px-8 py-6 h-auto shadow-lg shadow-red-600/20 transition-transform active:scale-95">
          <Upload className="w-4 h-4 mr-2" /> Subir mi Foto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-none bg-white p-0 overflow-hidden rounded-3xl">
        <DialogHeader className="p-8 bg-zinc-950 text-white">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            Compartí tu <span className="text-red-600">Mística</span>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold uppercase tracking-tight">¡Foto enviada!</h3>
            <p className="text-zinc-500 text-sm mt-2 font-light">
              Un administrador la revisará pronto para publicarla.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Seleccioná tu foto</Label>
              <div className="relative group aspect-video rounded-2xl border-2 border-dashed border-zinc-200 hover:border-red-600 transition-colors overflow-hidden flex items-center justify-center bg-zinc-50">
                {preview ? (
                  <>
                    <img src={preview} className="absolute inset-0 w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => {setFile(null); setPreview(null);}}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Camera className="w-8 h-8 text-zinc-300 mb-2" />
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Click para elegir</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">¿Qué está pasando en la foto?</Label>
              <Input 
                placeholder="Ej: El tercer tiempo con los pibes..." 
                className="rounded-xl border-zinc-200 focus:ring-red-600"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Categoría</Label>
              <select 
                className="w-full h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm focus:ring-2 focus:ring-red-600 outline-none"
                value={etiqueta}
                onChange={(e) => setEtiqueta(e.target.value)}
              >
                <option value="Rugby">Rugby</option>
                <option value="Hockey">Hockey</option>
                <option value="Club">Club</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-zinc-900 hover:bg-red-600 text-white py-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
              disabled={uploading || !file}
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar para Revisión"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}