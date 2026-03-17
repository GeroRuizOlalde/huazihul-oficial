import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabasePublic } from "@/lib/supabase/public";
import { NoticiaSlider } from "@/components/noticias/NoticiaSlider";

export default async function NoticiaDetalle({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: noticia, error } = await supabasePublic
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !noticia) {
    notFound();
  }

  // Juntamos la imagen principal y la galería (si existe la columna en Supabase)
  const todasLasFotos = [noticia.imagen_url, ...(noticia.galeria || [])];
  const fotosValidas = todasLasFotos.filter((foto: string) => typeof foto === 'string' && foto.trim() !== '');

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 selection:bg-red-600 selection:text-white">
      <section className="pb-24 pt-12">
        <div className="container mx-auto max-w-4xl px-6">
          
          <Link 
            href="/noticias" 
            className="mb-8 inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-red-600 transition-colors hover:text-red-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Noticias
          </Link>
          
          <header className="mb-8">
            <h1 className="mb-6 text-4xl font-black uppercase italic leading-tight tracking-tighter text-zinc-900 md:text-5xl lg:text-6xl">
              {noticia.titulo}
            </h1>
            
            <div className="flex items-center gap-4 border-b border-zinc-200 pb-6">
              <Badge className="rounded-none border-none bg-red-600 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white">
                {noticia.etiqueta || "Institucional"}
              </Badge>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <Calendar className="h-3 w-3" /> 
                {new Date(noticia.creado_en).toLocaleDateString('es-AR')}
              </span>
            </div>
          </header>

          {/* --- SLIDER DE IMÁGENES --- */}
          <NoticiaSlider images={fotosValidas} title={noticia.titulo} />

          {/* --- TEXTO DEL ARTÍCULO --- */}
          <article className="prose prose-zinc max-w-none">
            <p className="whitespace-pre-wrap text-base font-light leading-relaxed text-zinc-700 md:text-lg">
              {noticia.descripcion}
            </p>
          </article>

        </div>
      </section>
    </div>
  );
}