import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabasePublic } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Actualidad | Huazihul",
  description: "Todas las noticias, resultados y novedades del Club Huazihul.",
};

export default async function NoticiasPage() {
  const { data, error } = await supabasePublic
    .from("noticias")
    .select("id, titulo, descripcion, etiqueta, imagen_url, creado_en")
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error cargando noticias:", error);
  }

  const noticias = data ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans selection:bg-red-600 selection:text-white">
      {/* HEADER */}
      <section className="bg-zinc-950 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="bg-red-600 p-2">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="h-1.5 w-12 bg-red-600" />
          </div>

          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">
            Actualidad <br /> <span className="text-red-600">Huazihul</span>
          </h1>

          <p className="max-w-xl text-sm font-light text-zinc-400 md:text-base">
            Mantenete informado con los últimos resultados, eventos
            institucionales y la vida diaria de nuestro club.
          </p>
        </div>
      </section>

      {/* GRILLA DE NOTICIAS */}
      <section className="flex-1 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          {error ? (
            <div className="border-l-4 border-red-600 bg-red-50 p-6">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">
                Error de Conexión
              </p>
              <p className="text-sm text-red-500">
                No pudimos cargar las noticias. Intentá refrescar la página.
              </p>
            </div>
          ) : noticias.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map((news) => (
                <Link
                  href={`/noticias/${news.id}`}
                  key={news.id}
                  className="group flex h-full flex-col border border-transparent bg-white p-4 shadow-sm transition-colors hover:border-red-600"
                >
                  <div className="relative mb-6 aspect-video w-full overflow-hidden bg-zinc-200">
                    <Image
                      src={news.imagen_url || "/images/fondo.jpg"}
                      alt={news.titulo || "Noticia de Huazihul"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mb-4 flex items-start justify-between">
                    <Badge className="rounded-none border border-red-600 bg-transparent text-[9px] uppercase text-red-600">
                      {news.etiqueta || "Novedad"}
                    </Badge>
                  </div>

                  <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-zinc-900 transition-colors group-hover:text-red-600">
                    {news.titulo}
                  </h3>

                  <p className="mb-6 line-clamp-3 text-sm font-light text-zinc-500">
                    {news.descripcion || "Próximamente más información sobre esta noticia."}
                  </p>

                  <span className="mt-auto flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-900 transition-colors group-hover:text-red-600">
                    Leer artículo completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 py-24 text-center">
              <Newspaper className="mb-4 h-12 w-12 text-zinc-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                Aún no hay noticias publicadas.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
