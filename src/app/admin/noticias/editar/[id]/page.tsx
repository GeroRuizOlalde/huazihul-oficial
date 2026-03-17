"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Upload, X, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditarNoticiaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Estados del Formulario
  const [titulo, setTitulo] = useState("");
  const [etiqueta, setEtiqueta] = useState("Institucional");
  const [descripcion, setDescripcion] = useState("");
  
  // Gestión de Imágenes (Existentes y Nuevas)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // 1. Cargar datos de la noticia al iniciar
  useEffect(() => {
    const fetchNoticia = async () => {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setErrorMsg("No se pudo cargar la noticia.");
      } else {
        setTitulo(data.titulo);
        setEtiqueta(data.etiqueta);
        setDescripcion(data.descripcion);
        // Consolidamos la imagen principal y la galería en un solo array visual
        setExistingImages([data.imagen_url, ...(data.galeria || [])].filter(Boolean));
      }
      setIsLoading(false);
    };

    if (id) fetchNoticia();
  }, [id, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeExisting = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingImages.length === 0 && newFiles.length === 0) {
      setErrorMsg("La noticia debe tener al menos una imagen.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      let finalUrls = [...existingImages];

      // 1. Subir las NUEVAS imágenes si existen
      for (const file of newFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('noticias')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('noticias')
          .getPublicUrl(fileName);
        
        finalUrls.push(publicUrl);
      }

      // 2. Organizar: La primera es la principal, el resto galería
      const imagen_url = finalUrls[0];
      const galeria = finalUrls.slice(1);

      // 3. ACTUALIZAR en Supabase
      const { error: updateError } = await supabase
        .from('noticias')
        .update({
          titulo,
          etiqueta,
          descripcion,
          imagen_url,
          galeria
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push("/admin/noticias");
      router.refresh();

    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar.");
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
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/noticias" className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
          Editar <span className="text-red-600">Noticia</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 md:p-8 space-y-6">
              {errorMsg && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-medium">
                  <AlertCircle className="h-5 w-5" /> {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Título</Label>
                <Input 
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="h-14 text-xl font-bold border-zinc-200 focus-visible:ring-red-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Contenido</Label>
                <textarea 
                  className="min-h-[300px] w-full rounded-xl border border-zinc-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* GESTIÓN DE IMÁGENES */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 md:p-8">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-4">Fotos de la noticia</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Fotos que ya estaban en la BD */}
                {existingImages.map((src, i) => (
                  <div key={`exist-${i}`} className="relative aspect-square group rounded-xl overflow-hidden border-2 border-zinc-100">
                    <img src={src} className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeExisting(i)} className="absolute top-2 right-2 bg-zinc-900/80 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {i === 0 && <div className="absolute bottom-0 left-0 w-full bg-zinc-900 text-[8px] text-white font-bold uppercase py-1 text-center">Portada</div>}
                  </div>
                ))}

                {/* Fotos nuevas para subir */}
                {newPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative aspect-square group rounded-xl overflow-hidden border-2 border-red-100">
                    <img src={src} className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeNew(i)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg">
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 w-full bg-red-600 text-[8px] text-white font-bold uppercase py-1 text-center">Nueva</div>
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 hover:border-red-600 transition-all">
                  <Upload className="h-6 w-6 text-zinc-400 mb-2" />
                  <span className="text-[9px] font-bold uppercase text-zinc-500">Añadir más</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm sticky top-6">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Categoría</Label>
                <select 
                  className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none"
                  value={etiqueta}
                  onChange={(e) => setEtiqueta(e.target.value)}
                >
                  <option value="Institucional">Institucional</option>
                  <option value="Rugby">Rugby</option>
                  <option value="Hockey">Hockey</option>
                  <option value="Social">Social</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-7 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Guardar Cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}