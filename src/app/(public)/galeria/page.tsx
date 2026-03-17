import { Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabasePublic } from "@/lib/supabase/public";
import { SubirFoto } from "@/components/galeria/FotoUploader";

export const metadata = {
  title: "Galería | Huazihul",
  description: "La mística visual del Club Huazihul en fotos.",
};

const categorias = ["Todos", "Rugby", "Hockey", "Social", "Club"];

export default async function GaleriaPage() {
  const { data: fotos, error } = await supabasePublic
    .from("galeria")
    .select("id, url, descripcion, etiqueta, aprobado, creado_en")
    .eq("aprobado", true)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error cargando galería:", error);
  }

  const galeria = fotos ?? [];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b-8 border-red-600 bg-zinc-950 py-24 text-white">
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Badge className="mb-6 rounded-none border-none bg-red-600 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white">
            Mística Visual
          </Badge>

          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <h1 className="text-6xl font-black uppercase italic leading-[0.8] tracking-tighter md:text-8xl">
              Galería <br /> <span className="text-red-600">Huazihul</span>
            </h1>

            <SubirFoto />
          </div>
        </div>
      </section>

      {/* FILTROS VISUALES */}
      <section className="sticky top-20 z-30 border-b border-zinc-100 bg-white/95 py-6 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] gap-4 overflow-x-auto px-6 md:px-8 hide-scrollbar">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              className="whitespace-nowrap border border-zinc-200 px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:border-red-600 hover:bg-red-600 hover:text-white"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GRILLA */}
      <section className="py-12 md:py-14">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
          {galeria.length > 0 ? (
            galeria.map((foto) => (
              <div
                key={foto.id}
                className="group relative aspect-square cursor-pointer overflow-hidden bg-zinc-100 shadow-sm"
              >
                <img
                  src={foto.url || "/images/fondo.jpg"}
                  alt={foto.descripcion || "Foto de la galería de Huazihul"}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Badge className="mb-2 w-fit rounded-none border-none bg-red-600 text-[8px] uppercase tracking-widest text-white">
                    {foto.etiqueta || "Mística"}
                  </Badge>

                  <p className="text-sm font-medium uppercase italic leading-tight tracking-tight text-white">
                    {foto.descripcion || "Momento Huazihul"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-zinc-200 py-20 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Todavía no hay fotos aprobadas.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER INSTAGRAM */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 text-center">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Instagram className="mx-auto mb-6 h-12 w-12 text-red-600" />
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Seguí el día a día
          </h2>

          <a
            href="https://www.instagram.com/clubhuazihul/"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-zinc-950 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-600"
          >
            @clubhuazihul
          </a>
        </div>
      </section>
    </div>
  );
}