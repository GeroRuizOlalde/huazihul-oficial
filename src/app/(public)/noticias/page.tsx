import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabasePublic } from "@/lib/supabase/public";

export const metadata = {
  title: "Actualidad | Huazihul",
  description: "Todas las noticias, resultados y novedades del Club Huazihul.",
};

export default async function NoticiasPage() {
  // Vamos a buscar TODO el historial de noticias a la base de datos
  const { data: noticias, error } = await supabasePublic
    .from('noticias')
    .select('*')
    .order('creado_en', { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- HEADER DE LA SECCIÓN --- */}
      <section className="bg-zinc-950 py-16 md:py-24">
        <div className="container px-6 md:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-600 p-2">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="h-1.5 w-12 bg-red-600"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            Actualidad <br /> <span className="text-red-600">Huazihul</span>
          </h1>
          <p className="text-zinc-400 font-light max-w-xl text-sm md:text-base">
            Mantenete informado con los últimos resultados, eventos institucionales y la vida diaria de nuestro club.
          </p>
        </div>
      </section>

      {/* --- GRILLA COMPLETA DE NOTICIAS --- */}
      <section className="py-16 md:py-24 flex-1">
        <div className="container px-6 md:px-8">
          
          {error ? (
            <div className="border-l-4 border-red-600 bg-red-50 p-6">
              <p className="font-bold text-red-600 uppercase tracking-widest text-sm mb-2">Error de Conexión</p>
              <p className="text-sm text-red-500">No pudimos cargar las noticias. Intentá refrescar la página.</p>
            </div>
          ) : noticias && noticias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticias.map((news) => (
                <Link href={`/noticias/${news.id}`} key={news.id} className="group flex flex-col h-full bg-white p-4 shadow-sm border border-transparent hover:border-red-600 transition-colors">
                  <div className="w-full aspect-video bg-zinc-200 mb-6 overflow-hidden relative">
                    <img 
                      src={news.imagen_url} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={news.titulo} 
                    />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-transparent border border-red-600 text-red-600 rounded-none uppercase text-[9px]">
                      {news.etiqueta}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight mb-3 group-hover:text-red-600 transition-colors">
                    {news.titulo}
                  </h3>
                  <p className="text-zinc-500 font-light text-sm mb-6 line-clamp-3">
                    {news.descripcion}
                  </p>
                  <span className="text-zinc-900 font-bold uppercase text-[10px] tracking-widest flex items-center mt-auto group-hover:text-red-600 transition-colors">
                    Leer artículo completo <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-zinc-200 text-center">
              <Newspaper className="h-12 w-12 text-zinc-300 mb-4" />
              <p className="text-sm uppercase tracking-widest text-zinc-400 font-bold">Aún no hay noticias publicadas.</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}