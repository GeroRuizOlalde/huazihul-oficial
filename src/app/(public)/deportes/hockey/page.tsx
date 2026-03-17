import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HockeyPage() {
  const categorias = [
    { nombre: "Infantiles", edades: "10ma a 7ma división", horario: "Lun, Mié y Vie 18:00hs" },
    { nombre: "Juveniles", edades: "6ta y 5ta división", horario: "Lun a Vie 19:30hs" },
    { nombre: "Primera División", edades: "Competitivo", horario: "Diario 21:00hs" },
    { nombre: "Mamis Hockey", edades: "Recreativo / Competitivo", horario: "Mar y Jue 21:00hs" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative h-[70vh] bg-zinc-950 flex items-center overflow-hidden">
        {/* Reemplazá esta URL por tu imagen de hockey local */}
        <div 
          className="absolute inset-0 bg-[url('/images/hockey-hero.jpg')] bg-cover bg-center opacity-40 scale-105" 
        />
        <div className="container relative z-10 px-6 md:px-8">
          <Badge className="bg-red-600 text-white rounded-none mb-4 uppercase tracking-[0.3em] text-[10px] border-none px-4 py-1">
            Pasión sobre el sintético
          </Badge>
          <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-[0.85] mb-6">
            Hockey <br /> <span className="text-red-600">Huazihul</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl font-light max-w-xl leading-relaxed">
            Formando jugadoras con técnica, valores y un profundo sentido de pertenencia desde las bases hasta la alta competencia.
          </p>
        </div>
      </section>

      {/* --- 2. CONTENIDO PRINCIPAL --- */}
      <section className="py-20 md:py-32">
        <div className="container px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            
            {/* LADO IZQUIERDO: EL ADN */}
            <div className="lg:col-span-1 space-y-10">
              <div className="space-y-6">
                <div className="h-1.5 w-16 bg-red-600" />
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-zinc-900">
                  Más que <br /> un deporte, <br /> una escuela.
                </h2>
                <p className="text-zinc-500 font-light leading-relaxed text-base md:text-lg">
                  En Huazihul entendemos el hockey como una herramienta de superación. Contamos con una de las mejores canchas de sintético de la provincia y un staff técnico de primer nivel.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
                <div>
                  <span className="block text-4xl font-black text-red-600 italic">8va</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Campeonatos</span>
                </div>
                <div>
                  <span className="block text-4xl font-black text-red-600 italic">+300</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Jugadoras</span>
                </div>
              </div>

              <Button className="w-full bg-zinc-900 hover:bg-red-600 text-white rounded-none font-black uppercase tracking-widest py-8 transition-all" asChild>
                <Link href="/socios">Sumate a los entrenamientos</Link>
              </Button>
            </div>

            {/* LADO DERECHO: CATEGORÍAS (GRID RIVA ESTUDIO) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {categorias.map((cat) => (
                <div 
                  key={cat.nombre} 
                  className="group p-10 border border-zinc-100 bg-zinc-50/50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col justify-between min-h-[300px]"
                >
                  <div className="space-y-4">
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-red-600 transition-colors">
                      <Target className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                      {cat.nombre}
                    </h3>
                  </div>

                  <div className="space-y-3 mt-8">
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-400 uppercase tracking-widest bg-white w-fit px-4 py-2 rounded-full border border-zinc-100">
                      <Users className="w-4 h-4 text-red-600" /> {cat.edades}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-400 uppercase tracking-widest bg-white w-fit px-4 py-2 rounded-full border border-zinc-100">
                      <Clock className="w-4 h-4 text-red-600" /> {cat.horario}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- 3. BANNER DE CIERRE --- */}
      <section className="bg-red-600 py-16">
        <div className="container px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
            ¿Querés probar una clase?
          </h2>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 rounded-none font-black uppercase tracking-widest px-10 py-7 h-auto text-lg" asChild>
            <Link href="/contacto">Contactar ahora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}