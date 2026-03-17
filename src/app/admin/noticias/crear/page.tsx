"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CrearNoticiaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Estados del Formulario
  const [titulo, setTitulo] = useState("");
  const [etiqueta, setEtiqueta] = useState("Institucional");
  const [descripcion, setDescripcion] = useState("");
  
  // Estados de Imágenes
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Manejar selección de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMsg("Subí al menos una imagen para la noticia.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const uploadedUrls: string[] = [];

      // 1. Subir cada imagen al Storage de Supabase
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('noticias')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Obtener la URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('noticias')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }

      // 2. Separar Principal de Galería
      const imagen_url = uploadedUrls[0]; // La primera es la principal
      const galeria = uploadedUrls.slice(1); // El resto van a la galería

      // 3. Insertar en la tabla 'noticias'
      const { error: insertError } = await supabase
        .from('noticias')
        .insert([{
          titulo,
          etiqueta,
          descripcion,
          imagen_url,
          galeria // Asegurate que esta columna exista en Supabase como tipo JSONB o Text Array
        }]);

      if (insertError) throw insertError;

      router.push("/admin/noticias");
      router.refresh();

    } catch (err: any) {
      setErrorMsg(err.message || "Error al subir la noticia.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/noticias" className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
          Nueva <span className="text-red-600">Publicación</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* COLUMNA PRINCIPAL */}
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
                  placeholder="Título impactante..." 
                  className="h-14 text-xl font-bold border-zinc-200 focus-visible:ring-red-600"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Contenido</Label>
                <textarea 
                  className="min-h-[300px] w-full rounded-xl border border-zinc-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  placeholder="Desarrollá la noticia aquí..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* SECCIÓN DE CARGA DE IMÁGENES */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 md:p-8">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-4">Imágenes (La primera será la principal)</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square group rounded-xl overflow-hidden border border-zinc-200">
                    <img src={src} className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 w-full bg-red-600 text-[8px] text-white font-bold uppercase text-center py-1">Principal</div>
                    )}
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 hover:border-red-600 transition-all">
                  <Upload className="h-6 w-6 text-zinc-400 mb-2" />
                  <span className="text-[9px] font-bold uppercase text-zinc-500">Subir Fotos</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA LATERAL */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm sticky top-6">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Categoría</Label>
                <select 
                  className="w-full h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-red-600 transition-all outline-none"
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
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-7 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
                  ) : (
                    <><CheckCircle2 className="mr-2 h-5 w-5" /> Publicar Noticia</>
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