import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Beer,
  Shirt,
  UserCheck,
  History,
  Award,
} from "lucide-react";

const COMISION = [
  { cargo: "Presidente", nombre: "Nombre y Apellido" },
  { cargo: "Vicepresidente", nombre: "Nombre y Apellido" },
  { cargo: "Secretario", nombre: "Nombre y Apellido" },
  { cargo: "Tesorero", nombre: "Nombre y Apellido" },
  { cargo: "Pro-Secretario", nombre: "Nombre y Apellido" },
  { cargo: "Pro-Tesorero", nombre: "Nombre y Apellido" },
];

const EX_PRESIDENTES = [
  { nombre: "William R. Finnemore", periodo: "1927 - 1930" },
  { nombre: "Nombre Apellido", periodo: "1930 - 1935" },
  { nombre: "Nombre Apellido", periodo: "1935 - 1940" },
  { nombre: "Nombre Apellido", periodo: "1940 - 1945" },
];

const TIMELINE = [
  {
    year: "1927",
    tag: "Fundación",
    title: "Nacimiento en el Invierno",
    text: "El primer club de San Juan comienza sus prácticas en el estadio abierto del Parque de Mayo. La mística del Bar Alemán se traslada a la cancha.",
  },
  {
    year: "1945",
    tag: "Institucional",
    title: "Fundadores de Uniones",
    text: "Huazihul lidera la creación de la Unión de Rugby de Cuyo y, posteriormente en 1952, la Unión Sanjuanina de Rugby.",
  },
  {
    year: "1960",
    tag: "Infraestructura",
    title: "La Sede de Chimbas",
    text: "Se consigue el terreno detrás del Penal. Gracias a la tierra de la Bodega Cavic, el suelo pedregoso se transforma en nuestra casa por décadas.",
  },
  {
    year: "2026",
    tag: "Presente",
    title: "Sede Calle Coll",
    text: "Mudanza a la casa definitiva en Rivadavia. Contamos actualmente con dos canchas funcionales y la principal en construcción rumbo al centenario.",
  },
];

export default function ElClubPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 selection:bg-red-600 selection:text-white">
      {/* HERO */}
      <section className="relative flex h-[70vh] items-center overflow-hidden bg-zinc-950 lg:h-[80vh]">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('/images/club.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Badge className="mb-8 rounded-none border-none bg-red-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Identidad Cacique
          </Badge>

          <h1 className="mb-6 text-6xl font-black uppercase italic leading-[0.85] tracking-tighter text-white md:text-8xl lg:text-9xl">
            Legado <br />
            <span className="text-red-600">Cuyano</span>
          </h1>

          <p className="max-w-2xl text-lg font-light leading-relaxed text-zinc-300 md:text-2xl">
            Huazihul San Juan Rugby Club: el primer club de San Juan y pionero
            de la región, forjando la historia del deporte desde 1927.
          </p>
        </div>
      </section>

      {/* RESUMEN HISTÓRICO */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <div className="mb-8 h-1.5 w-16 bg-red-600" />
                <h2 className="mb-6 text-4xl font-black uppercase leading-none tracking-tighter text-zinc-900 md:text-5xl">
                  Los Orígenes <br />
                  del Primer Club
                </h2>
                <p className="text-lg font-bold italic text-red-600">
                  &quot;Bautizaron al club con el nombre del cacique: el orgullo
                  de ser Huazihul.&quot;
                </p>
              </div>
            </div>

            <div className="space-y-8 text-lg font-light leading-relaxed text-zinc-600 md:text-xl lg:col-span-8">
              <p>
                Huazihul nació en el{" "}
                <b className="font-black text-zinc-900">invierno del 27</b> y se
                convirtió en el primer club de San Juan y también de la región
                cuyana. Su importancia es tal que es uno de los fundadores de la
                Unión de Rugby de Cuyo en 1945, y siete años después, de la
                Unión Sanjuanina.
              </p>

              <p>
                Aquellos pioneros tenían como punto de reunión el{" "}
                <b className="font-black text-zinc-900">Bar Alemán</b>, muy
                cerca de la Plaza 25 de Mayo. Entre los fundadores se
                encontraban Enrique De Donatis, los hermanos Castro, los
                hermanos Finnemore, Eugenio De León y Eugenio Pradella.
              </p>

              <div className="my-16 grid gap-8 rounded-[2rem] border-l-8 border-red-600 bg-zinc-50 p-10 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <Beer className="h-5 w-5 text-red-600" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900">
                    El Bar Alemán
                  </h4>
                  <p className="text-sm leading-relaxed">
                    El centro neurálgico donde Jorge Hirsh recibía a los
                    muchachos que soñaban con el rugby sanjuanino.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <Shirt className="h-5 w-5 text-red-600" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900">
                    Colores con Historia
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Del clásico rojinegro a cuadros pequeños hasta el diseño
                    moderno que impone respeto en toda la región.
                  </p>
                </div>
              </div>

              <p>
                Uno de los grandes propulsores fue{" "}
                <b className="font-black text-zinc-900">
                  William Richard Finnemore
                </b>
                , quien heredó la pasión de su padre, llegado desde Londres a
                fines del siglo XIX. Juntos, no solo fundaron un club, sino una
                escuela de vida que bautizaron con el nombre del{" "}
                <span className="font-black text-red-600">Cacique Huazihul</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMISIÓN DIRECTIVA */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 text-white md:py-32">
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-20">
            <div className="mb-6 flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-red-600" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-red-500">
                Gestión Actual
              </span>
            </div>

            <h2 className="text-5xl font-black uppercase italic tracking-tighter md:text-7xl">
              Comisión <br />
              <span className="text-red-600">Directiva</span>
            </h2>
          </div>

          <div className="grid gap-x-24 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {COMISION.map((persona, i) => (
              <div
                key={i}
                className="group border-b border-zinc-800 pb-6 transition-all hover:border-red-600"
              >
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-red-500">
                  {persona.cargo}
                </p>
                <p className="text-2xl font-black uppercase tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                  {persona.nombre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EX PRESIDENTES */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-20">
            <div className="mb-6 flex items-center gap-3">
              <History className="h-6 w-6 text-red-600" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
                Galería de Honor
              </span>
            </div>

            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-zinc-900 md:text-7xl">
              Ex Presidentes
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EX_PRESIDENTES.map((ex, i) => (
              <div
                key={i}
                className="group flex flex-col items-center rounded-[2rem] border border-zinc-100 bg-zinc-50 p-10 text-center shadow-sm transition-all duration-500 hover:bg-zinc-900 hover:text-white hover:shadow-2xl hover:shadow-red-600/10"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors group-hover:bg-red-600">
                  <Award className="h-6 w-6 text-red-600 group-hover:text-white" />
                </div>

                <h4 className="mb-4 text-lg font-black uppercase leading-tight tracking-tight">
                  {ex.nombre}
                </h4>

                <Badge className="rounded-none border border-zinc-300 bg-transparent px-3 text-[10px] font-black uppercase tracking-widest group-hover:border-red-600 group-hover:text-red-500">
                  {ex.periodo}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative overflow-hidden border-y border-zinc-100 bg-zinc-50 py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-[15%] top-0 hidden h-full w-[2px] bg-zinc-200 md:block" />

            <h3 className="mb-24 text-center text-sm font-black uppercase tracking-[0.5em] text-red-600 md:pl-[15%] md:text-left">
              Cronología Cacique
            </h3>

            <div className="space-y-32">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-start gap-8 md:flex-row"
                >
                  <div className="z-0 text-8xl font-black leading-none tracking-tighter text-zinc-200 transition-all duration-700 group-hover:text-red-600/10 lg:text-[10rem] md:w-1/3">
                    {item.year}
                  </div>

                  <div className="relative z-10 pt-4 md:w-2/3 md:pt-14">
                    <Badge className="mb-6 rounded-none border-none bg-red-600 text-[10px] font-black tracking-widest text-white">
                      {item.tag}
                    </Badge>

                    <h3 className="mb-6 text-3xl font-black uppercase italic tracking-tighter text-zinc-900 md:text-4xl">
                      {item.title}
                    </h3>

                    <p className="max-w-xl text-lg font-light leading-relaxed text-zinc-500">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 text-center text-white">
        <div className="absolute inset-0 bg-red-600/5" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6">
          <h2 className="mb-12 text-5xl font-black uppercase italic tracking-tighter md:text-7xl">
            Sé parte de <br />
            <span className="text-red-600">Nuestra Historia</span>
          </h2>

          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Button
              asChild
              className="h-16 rounded-none bg-red-600 px-12 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/20 transition-all hover:bg-red-700"
            >
              <Link href="/socios">Asociate Hoy</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-16 rounded-none border-white px-12 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
            >
              <Link href="/contacto">Consultas</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
