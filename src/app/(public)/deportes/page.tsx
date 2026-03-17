import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Usamos las mismas imágenes que ya tenés en la web
const IMAGENES = {
  rugby: "/images/rugby.jpg",
  hockey: "/images/hockey.jpg",
};

export default function DeportesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 md:bg-zinc-50 font-sans selection:bg-red-600 selection:text-white">

      {/* --- HEADER DEL PORTAL --- */}
      <section className="relative w-full py-24 md:py-32 bg-zinc-950 overflow-hidden flex items-center justify-center border-b border-zinc-800">
        <div className="container relative z-10 px-6 text-center flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="h-1 w-12 bg-red-600 mb-4"></div>
            <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
              Pasión y Compromiso
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
            Deportes
          </h1>
          <p className="mt-6 text-zinc-400 font-light max-w-lg text-sm md:text-base">
            Elegí tu disciplina. Formamos deportistas con los valores históricos que caracterizan al club desde 1927.
          </p>
        </div>
      </section>

      {/* --- GRID DE DISCIPLINAS --- */}
      <section className="py-0 md:py-16">
        <div className="container mx-auto max-w-7xl md:px-8">
          <div className="flex flex-col md:flex-row gap-0 md:gap-8 md:min-h-[70vh]">

            {/* TARJETA: RUGBY */}
            <Link 
              href="/deportes/rugby" 
              className="group relative w-full md:w-1/2 min-h-[500px] overflow-hidden md:rounded-[2rem] border-b-4 md:border-b-0 border-zinc-900 md:shadow-2xl md:hover:shadow-red-900/20 transition-all duration-500"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                style={{ backgroundImage: `url(${IMAGENES.rugby})` }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col items-start justify-end h-full">
                <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-3">
                  Deporte Fundacional
                </span>
                <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none group-hover:text-red-500 transition-colors">
                  Rugby
                </h2>
                <p className="text-zinc-300 font-light max-w-sm mb-8 text-sm md:text-base leading-relaxed">
                  La cuna del club. Desde infantiles hasta el plantel superior, forjamos el carácter y los valores que nos definen como el Cacique.
                </p>
                <div className="inline-flex items-center gap-2 bg-red-600 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full group-hover:bg-white group-hover:text-black transition-all active:scale-95 shadow-xl">
                  Ver Categorías <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* TARJETA: HOCKEY */}
            <Link 
              href="/deportes/hockey" 
              className="group relative w-full md:w-1/2 min-h-[500px] overflow-hidden md:rounded-[2rem] md:shadow-2xl md:hover:shadow-amber-900/20 transition-all duration-500"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                style={{ backgroundImage: `url(${IMAGENES.hockey})` }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col items-start justify-end h-full">
                <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-3">
                  Excelencia y Velocidad
                </span>
                <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none group-hover:text-amber-500 transition-colors">
                  Hockey
                </h2>
                <p className="text-zinc-300 font-light max-w-sm mb-8 text-sm md:text-base leading-relaxed">
                  Dinamismo, técnica y trabajo en equipo. Nuestras líneas de hockey son protagonistas indiscutidas del deporte sanjuanino.
                </p>
                <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-900 font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-all active:scale-95 shadow-xl">
                  Ver Categorías <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}