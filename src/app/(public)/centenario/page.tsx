import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Star,
  ArrowDown,
  HardHat,
  CalendarDays,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Countdown } from "@/components/centenario/Countdown";

const IMAGENES = {
  hero:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2000&auto=format&fit=crop",
  obras:
    "https://images.unsplash.com/photo-1589806306531-90a6e00d9223?q=80&w=1000&auto=format&fit=crop",
  camiseta:
    "https://images.unsplash.com/photo-1579548122080-c35fd6820ceb?q=80&w=1000&auto=format&fit=crop",
};

const AGENDA = [
  {
    mes: "Marzo",
    titulo: "Torneo de Leyendas",
    desc: "Encuentro de veteranos y ex jugadores de todas las épocas.",
  },
  {
    mes: "Mayo",
    titulo: "Día de la Familia",
    desc: "Jornada recreativa monumental con todas las divisiones.",
  },
  {
    mes: "14 Julio",
    titulo: "Cena de Gala",
    desc: "La noche más esperada del siglo. Reconocimientos y gloria.",
  },
];

export default function CentenarioPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-zinc-950 font-sans text-white selection:bg-amber-500 selection:text-black">
      {/* HERO */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-center">
        <div
          className="absolute inset-0 scale-105 animate-in bg-cover bg-center opacity-40 mix-blend-luminosity fade-in duration-1000"
          style={{ backgroundImage: `url(${IMAGENES.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/80 to-zinc-950" />

        {/* Resplandor */}
        <div className="absolute left-1/2 top-1/2 z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px] md:h-[600px] md:w-[600px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mb-8 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-amber-500 md:text-sm">
            <Star className="h-4 w-4 fill-amber-500 animate-pulse" />
            <span className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              1927 — 2027
            </span>
            <Star className="h-4 w-4 fill-amber-500 animate-pulse" />
          </div>

          <h1 className="mb-8 text-5xl font-black uppercase italic leading-[0.8] tracking-tighter md:text-8xl lg:text-[10rem]">
            Un Siglo de <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 bg-clip-text text-transparent">
              Gloria
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-zinc-300 md:text-2xl">
            Cien años forjando el carácter de San Juan. El camino hacia la
            celebración más grande de nuestra historia ya comenzó.
          </p>

          <div className="flex flex-col items-center">
            <ArrowDown className="h-8 w-8 animate-bounce text-red-600" />
          </div>
        </div>
      </section>

      {/* CONTADOR */}
      <section className="relative border-y border-zinc-900 bg-zinc-950 py-24">
        <div className="mx-auto w-full max-w-[1440px] px-4 text-center">
          <Badge className="mb-12 rounded-none border-none bg-amber-500 px-6 py-2 font-black uppercase tracking-widest text-black">
            Cuenta Regresiva Oficial
          </Badge>

          <div className="flex justify-center overflow-x-hidden py-6">
            <div className="origin-center scale-100 transition-transform duration-500 sm:scale-110 md:scale-125 lg:scale-150">
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      {/* INFRAESTRUCTURA */}
      <section className="relative bg-zinc-900 py-24 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="group relative order-2 lg:order-1">
              <div className="absolute -inset-4 z-0 -skew-y-3 bg-red-600/10 transition-all duration-500 group-hover:bg-red-600/20" />
              <div className="relative z-10 overflow-hidden rounded-[2rem] border-l-8 border-red-600 shadow-2xl">
                <img
                  src={IMAGENES.obras}
                  alt="Proyecto de infraestructura del centenario"
                  className="aspect-[4/3] w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
            </div>

            <div className="order-1 space-y-8 lg:order-2">
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-red-500">
                <HardHat className="h-5 w-5" />
                Masterplan 2027
              </div>

              <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">
                Obras que <br />
                <span className="text-red-600">Hacen Historia</span>
              </h2>

              <p className="text-xl font-light leading-relaxed text-zinc-400">
                Los 100 años se construyen día a día. Estamos ejecutando la
                renovación del quincho principal y nueva iluminación LED para
                garantizar el futuro del club.
              </p>

              <Button
                asChild
                className="rounded-none border-none bg-white px-10 py-8 text-sm font-black uppercase tracking-widest text-zinc-950 shadow-2xl transition-all hover:bg-red-600 hover:text-white"
              >
                <Link href="/contacto">Conocé el Proyecto</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="bg-zinc-950 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-24 space-y-4 text-center">
            <Sparkles className="mx-auto mb-6 h-12 w-12 animate-pulse text-amber-500" />
            <h2 className="text-5xl font-black uppercase italic tracking-tighter md:text-8xl">
              Agenda <span className="text-zinc-800">2027</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light uppercase tracking-[0.2em] text-zinc-500">
              Hitos confirmados
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {AGENDA.map((evento, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-900/50 p-12 transition-all hover:border-amber-500/50"
              >
                <div className="absolute right-8 top-8 text-zinc-800 transition-colors group-hover:text-amber-500/20">
                  <CalendarDays className="h-12 w-12" />
                </div>

                <span className="mb-6 block text-xs font-black uppercase tracking-[0.2em] text-amber-500">
                  {evento.mes}
                </span>

                <h3 className="mb-4 text-3xl font-black uppercase leading-none tracking-tighter text-white">
                  {evento.titulo}
                </h3>

                <p className="font-light leading-relaxed text-zinc-500">
                  {evento.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MURO DEL CENTENARIO */}
      <section className="relative overflow-hidden border-y border-zinc-800 bg-zinc-900 py-32 text-center">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="relative mx-auto mb-12 w-fit">
            <div className="absolute inset-0 animate-pulse bg-amber-500 opacity-20 blur-3xl" />
            <Shield className="relative z-10 h-24 w-24 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
          </div>

          <h2 className="mb-8 text-5xl font-black uppercase italic tracking-tighter md:text-7xl">
            Tu nombre en <br />
            <span className="text-red-600">El Muro Eterno</span>
          </h2>

          <p className="mb-12 text-xl font-light leading-relaxed text-zinc-400">
            Adquirí tu placa fundacional y dejá tu marca en el ingreso al club.
            El legado del Cacique lo escribimos entre todos.
          </p>

          <Button
            asChild
            className="rounded-none bg-red-600 px-12 py-8 text-lg font-black uppercase tracking-widest text-white shadow-2xl shadow-red-600/30 transition-all hover:bg-white hover:text-black"
          >
            <Link href="/contacto">Reservar mi Placa</Link>
          </Button>
        </div>
      </section>

      {/* MERCHANDISING */}
      <section className="bg-black py-24 md:py-40">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-20 flex flex-col items-start justify-between gap-8 border-b border-zinc-800 pb-12 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-500">
                <ShoppingBag className="h-5 w-5" />
                Boutique Centenario
              </div>

              <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter text-white md:text-7xl">
                Edición <span className="text-zinc-800">100</span>
              </h2>
            </div>

            <Link
              href="/contacto"
              className="group flex items-center py-2 text-xs font-black uppercase tracking-widest text-zinc-500 transition-all hover:text-amber-500"
            >
              Explorar Tienda
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
            <div className="group cursor-pointer space-y-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:border-amber-500/50">
                <img
                  src={IMAGENES.camiseta}
                  alt="Camiseta Centenario"
                  className="h-full w-full object-cover opacity-30 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60"
                />
                <div className="absolute left-8 top-8 bg-amber-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-2xl">
                  Pre-Venta
                </div>
              </div>

              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Manto Sagrado 100 Años
              </h3>

              <p className="text-lg font-light text-zinc-500">
                Diseño histórico con detalles en oro y el escudo fundacional.
                Cantidades limitadas.
              </p>
            </div>

            <div className="group cursor-pointer space-y-8">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:border-red-600/50">
                <Trophy className="h-20 w-20 text-zinc-800 transition-all duration-700 group-hover:scale-110 group-hover:text-red-600" />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/90 to-transparent p-10">
                  <span className="text-xs font-black uppercase tracking-widest italic text-zinc-400 opacity-60">
                    Libro: Un Siglo de Caciques
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Relatos de un Siglo
              </h3>

              <p className="text-lg font-light text-zinc-500">
                Recopilación definitiva de fotos inéditas y anécdotas que
                forjaron la mística del club.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}