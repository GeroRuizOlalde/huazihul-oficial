import Link from "next/link";
import { ArrowRight } from "lucide-react";

const IMAGENES = {
  rugby: "/images/rugby.jpg",
  hockey: "/images/hockey.jpg",
};

export default function DeportesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans selection:bg-red-600 selection:text-white md:bg-zinc-50">
      {/* HEADER */}
      <section className="relative flex w-full items-center justify-center overflow-hidden border-b border-zinc-800 bg-zinc-950 py-24 md:py-32">
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 text-center md:px-8">
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="mb-4 h-1 w-12 bg-red-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 md:text-xs">
              Pasión y Compromiso
            </span>
          </div>

          <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter text-white md:text-7xl">
            Deportes
          </h1>

          <p className="mt-6 max-w-lg text-sm font-light text-zinc-400 md:text-base">
            Elegí tu disciplina. Formamos deportistas con los valores
            históricos que caracterizan al club desde 1927.
          </p>
        </div>
      </section>

      {/* GRID DE DISCIPLINAS */}
      <section className="py-0 md:py-16">
        <div className="mx-auto w-full max-w-[1440px] md:px-8">
          <div className="flex flex-col gap-0 md:min-h-[70vh] md:flex-row md:gap-8">
            {/* RUGBY */}
            <Link
              href="/deportes/rugby"
              className="group relative min-h-[500px] w-full overflow-hidden border-b-4 border-zinc-900 transition-all duration-500 md:w-1/2 md:rounded-[2rem] md:border md:border-zinc-200 md:border-b md:shadow-2xl md:hover:shadow-red-900/20"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${IMAGENES.rugby})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 flex h-full w-full flex-col items-start justify-end p-8 md:p-12">
                <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">
                  Deporte Fundacional
                </span>

                <h2 className="mb-4 text-6xl font-black uppercase italic leading-none tracking-tighter text-white transition-colors group-hover:text-red-500 md:text-7xl">
                  Rugby
                </h2>

                <p className="mb-8 max-w-sm text-sm font-light leading-relaxed text-zinc-300 md:text-base">
                  La cuna del club. Desde infantiles hasta el plantel superior,
                  forjamos el carácter y los valores que nos definen como el
                  Cacique.
                </p>

                <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all group-hover:bg-white group-hover:text-black active:scale-95">
                  Ver Categorías
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* HOCKEY */}
            <Link
              href="/deportes/hockey"
              className="group relative min-h-[500px] w-full overflow-hidden transition-all duration-500 md:w-1/2 md:rounded-[2rem] md:border md:border-zinc-200 md:shadow-2xl md:hover:shadow-amber-900/20"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${IMAGENES.hockey})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 flex h-full w-full flex-col items-start justify-end p-8 md:p-12">
                <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">
                  Excelencia y Velocidad
                </span>

                <h2 className="mb-4 text-6xl font-black uppercase italic leading-none tracking-tighter text-white transition-colors group-hover:text-amber-500 md:text-7xl">
                  Hockey
                </h2>

                <p className="mb-8 max-w-sm text-sm font-light leading-relaxed text-zinc-300 md:text-base">
                  Dinamismo, técnica y trabajo en equipo. Nuestras líneas de
                  hockey son protagonistas del deporte sanjuanino.
                </p>

                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-900 shadow-xl transition-all group-hover:bg-amber-500 group-hover:text-white active:scale-95">
                  Ver Categorías
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}