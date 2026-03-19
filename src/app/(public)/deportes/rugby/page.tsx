import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Shield } from "lucide-react";
import { InscripcionPruebaModal } from "@/components/deportes/InscripcionPruebaModal";

const categorias = [
  {
    nombre: "Infantiles",
    edades: "M6 a M14",
    horario: "Mar y Jue 18:30hs",
  },
  {
    nombre: "Juveniles",
    edades: "M15 a M19",
    horario: "Lun, Mar y Jue 20:00hs",
  },
  {
    nombre: "Plantel Superior",
    edades: "Primera e Intermedia",
    horario: "Mar y Jue 21:30hs",
  },
  {
    nombre: "Veteranos",
    edades: "Caciques",
    horario: "Sábados 15:00hs",
  },
];

export default function RugbyPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* HERO */}
      <section className="relative flex h-[65vh] items-center overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/rugby-action.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Badge className="mb-4 rounded-none border-none bg-red-600 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-white">
            Pura Pasión
          </Badge>

          <h1 className="text-7xl font-black uppercase italic leading-[0.85] tracking-tighter text-white md:text-9xl">
            Rugby <br /> <span className="text-red-600">Huazihul</span>
          </h1>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="py-20 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-24">
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-8 lg:col-span-1">
              <div className="h-1.5 w-16 bg-red-600" />

              <h2 className="text-4xl font-black uppercase leading-none tracking-tighter text-zinc-900 md:text-5xl">
                Formando <br /> jugadores y <br /> personas
              </h2>

              <p className="text-base font-light leading-relaxed text-zinc-500 md:text-lg">
                Desde 1927, el rugby en Huazihul es sinónimo de familia.
                Contamos con todas las categorías, desde los más pequeños que
                dan sus primeros pasos en el deporte, hasta nuestro Plantel
                Superior.
              </p>

              <div className="flex gap-4 border-t border-zinc-100 pt-6">
                <div className="text-center">
                  <span className="block text-4xl font-black italic text-red-600">
                    +500
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Jugadores
                  </span>
                </div>

                <div className="w-px bg-zinc-100" />

                <div className="text-center">
                  <span className="block text-4xl font-black italic text-red-600">
                    1927
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Fundación
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2">
              {categorias.map((cat) => (
                <div
                  key={cat.nombre}
                  className="group rounded-[2rem] border border-zinc-100 bg-zinc-50/50 p-8 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors group-hover:bg-red-600">
                    <Shield className="h-6 w-6 text-red-600 transition-all group-hover:scale-110 group-hover:text-white" />
                  </div>

                  <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter text-zinc-900">
                    {cat.nombre}
                  </h3>

                  <div className="space-y-3">
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
            ¿Querés sumarte al Cacique?
          </h2>

          <InscripcionPruebaModal deporte="rugby" />
        </div>
      </section>
    </div>
  );
}