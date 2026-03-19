import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Target } from "lucide-react";
import { InscripcionPruebaModal } from "@/components/deportes/InscripcionPruebaModal";

const categorias = [
  {
    nombre: "Infantiles",
    edades: "10ma a 7ma división",
    horario: "Lun, Mié y Vie 18:00hs",
  },
  {
    nombre: "Juveniles",
    edades: "6ta y 5ta división",
    horario: "Lun a Vie 19:30hs",
  },
  {
    nombre: "Primera División",
    edades: "Competitivo",
    horario: "Diario 21:00hs",
  },
  {
    nombre: "Mamis Hockey",
    edades: "Recreativo / Competitivo",
    horario: "Mar y Jue 21:00hs",
  },
];

export default function HockeyPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* HERO */}
      <section className="relative flex h-[70vh] items-center overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/hockey-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Badge className="mb-4 rounded-none border-none bg-red-600 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
            Pasión sobre el sintético
          </Badge>

          <h1 className="mb-6 text-7xl font-black uppercase italic leading-[0.85] tracking-tighter text-white md:text-9xl">
            Hockey <br /> <span className="text-red-600">Huazihul</span>
          </h1>

          <p className="max-w-xl text-lg font-light leading-relaxed text-zinc-300 md:text-xl">
            Formando jugadoras con técnica, valores y un profundo sentido de
            pertenencia desde las bases hasta la alta competencia.
          </p>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="py-20 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-24">
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-10 lg:col-span-1">
              <div className="space-y-6">
                <div className="h-1.5 w-16 bg-red-600" />
                <h2 className="text-4xl font-black uppercase leading-none tracking-tighter text-zinc-900 md:text-5xl">
                  Más que <br /> un deporte, <br /> una escuela.
                </h2>
                <p className="text-base font-light leading-relaxed text-zinc-500 md:text-lg">
                  En Huazihul entendemos el hockey como una herramienta de
                  superación. Contamos con una de las mejores canchas de
                  sintético de la provincia y un staff técnico de primer nivel.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-zinc-100 pt-6">
                <div>
                  <span className="block text-4xl font-black italic text-red-600">
                    8va
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Campeonatos
                  </span>
                </div>
                <div>
                  <span className="block text-4xl font-black italic text-red-600">
                    +300
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Jugadoras
                  </span>
                </div>
              </div>

              <Button
                asChild
                className="w-full rounded-none bg-zinc-900 py-8 font-black uppercase tracking-widest text-white transition-all hover:bg-red-600"
              >
                <Link href="/socios">Asociate al club</Link>
              </Button>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="grid grid-cols-1 gap-6 lg:col-span-2 md:grid-cols-2">
              {categorias.map((cat) => (
                <div
                  key={cat.nombre}
                  className="group flex min-h-[300px] flex-col justify-between rounded-[2.5rem] border border-zinc-100 bg-zinc-50/50 p-10 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50"
                >
                  <div className="space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors group-hover:bg-red-600">
                      <Target className="h-6 w-6 text-red-600 transition-colors group-hover:text-white" />
                    </div>

                    <h3 className="text-3xl font-black uppercase leading-none tracking-tighter text-zinc-900">
                      {cat.nombre}
                    </h3>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="flex w-fit items-center gap-3 rounded-full border border-zinc-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                      <Users className="h-4 w-4 text-red-600" />
                      {cat.edades}
                    </div>

                    <div className="flex w-fit items-center gap-3 rounded-full border border-zinc-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                      <Clock className="h-4 w-4 text-red-600" />
                      {cat.horario}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-red-600 py-16">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-8 px-6 text-white md:flex-row md:px-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter md:text-5xl">
            ¿Querés probar una clase?
          </h2>

          <InscripcionPruebaModal deporte="hockey" />
        </div>
      </section>
    </div>
  );
}