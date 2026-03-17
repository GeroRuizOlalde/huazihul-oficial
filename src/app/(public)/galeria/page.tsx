import { Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabasePublic } from "@/lib/supabase/public";
import { SubirFoto } from "@/components/galeria/FotoUploader";

export const metadata = {
  title: "Galería | Huazihul",
  description: "La mística visual del Club Huazihul en fotos.",
};

export default async function GaleriaPage() {
  // Conexión a tu tabla 'galeria' buscando solo las aprobadas
  const { data: fotos } = await supabasePublic
    .from('galeria')
    .select('*')
    .eq('aprobado', true)
    .order('creado_en', { ascending: false });

  const categorias = ["Todos", "Rugby", "Hockey", "Social", "Club"];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* HEADER */}
      <section className="relative overflow-hidden border-b-8 border-red-600 bg-zinc-950 py-24 text-white">
        <div className="container relative z-10 px-6 md:px-8">
          <Badge className="mb-6 rounded-none bg-red-600 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white border-none">
            Mística Visual
          </Badge>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <h1 className="text-6xl font-black italic leading-[0.8] tracking-tighter uppercase md:text-8xl">
              Galería <br /> <span className="text-red-600">Huazihul</span>
            </h1>
            
            <SubirFoto />
          </div>
        </div>
      </section>

      {/* FILTROS (Visuales) */}
      <section className="sticky top-0 z-30 border-b border-zinc-100 bg-white py-8">
        <div className="container flex gap-4 overflow-x-auto px-6 md:px-8 hide-scrollbar">
          {categorias.map((cat) => (
            <button key={cat} className="whitespace-nowrap border border-zinc-200 px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:border-red-600 hover:bg-red-600 hover:text-white">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GRILLA DE FOTOS DINÁMICA */}
      <section className="py-12">
        <div className="container grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
          {fotos && fotos.length > 0 ? (
            fotos.map((foto) => (
              <div key={foto.id} className="group relative aspect-square cursor-pointer overflow-hidden bg-zinc-100 shadow-sm">
                <img 
                  src={foto.url} 
                  alt={foto.descripcion} 
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <Badge className="mb-2 w-fit bg-red-600 text-[8px] uppercase tracking-widest border-none text-white rounded-none">
                    {foto.etiqueta || "Mística"}
                  </Badge>
                  <p className="text-sm font-medium italic leading-tight tracking-tight uppercase text-white">
                    {foto.descripcion}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-zinc-200 py-20 text-center">
              <p className="font-bold uppercase tracking-widest text-zinc-400 text-sm">Todavía no hay fotos aprobadas.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* FOOTER INSTAGRAM */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 text-center">
        <Instagram className="mx-auto mb-6 h-12 w-12 text-red-600" />
        <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-zinc-900">Seguí el día a día</h2>
        <a href="https://www.instagram.com/clubhuazihul/" target="_blank" rel="noreferrer" className="inline-block bg-zinc-950 px-8 py-4 font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-600 text-sm">
          @clubhuazihul
        </a>
      </section>
    </div>
  );
}