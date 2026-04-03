import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  Star,
  ArrowRight,
  Award,
  ShieldCheck,
} from "lucide-react";

const SPONSORS = {
  platinum: [
    {
      nombre: "Empresa Líder",
      logo: "https://via.placeholder.com/400x200?text=LOGO+1",
    },
    {
      nombre: "Banco Regional",
      logo: "https://via.placeholder.com/400x200?text=LOGO+2",
    },
  ],
  gold: [
    {
      nombre: "Seguros San Juan",
      logo: "https://via.placeholder.com/300x150?text=LOGO+3",
    },
    {
      nombre: "Constructora Coll",
      logo: "https://via.placeholder.com/300x150?text=LOGO+4",
    },
    {
      nombre: "Energía Cuyo",
      logo: "https://via.placeholder.com/300x150?text=LOGO+5",
    },
  ],
  supporters: [
    {
      nombre: "Agua Mineral",
      logo: "https://via.placeholder.com/200x100?text=LOGO+6",
    },
    {
      nombre: "Gimnasio Pro",
      logo: "https://via.placeholder.com/200x100?text=LOGO+7",
    },
    {
      nombre: "Nutrición Deportiva",
      logo: "https://via.placeholder.com/200x100?text=LOGO+8",
    },
    {
      nombre: "Kinesiología SJ",
      logo: "https://via.placeholder.com/200x100?text=LOGO+9",
    },
  ],
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 md:py-40">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="max-w-4xl">
            <Badge className="mb-6 rounded-none border-none bg-red-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              Alianzas Estratégicas
            </Badge>

            <h1 className="mb-8 text-6xl font-black uppercase italic leading-[0.85] tracking-tighter text-white md:text-9xl">
              Ellos <br />
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Impulsan
              </span>{" "}
              <br />
              El Legado
            </h1>

            <p className="max-w-2xl text-lg font-light leading-relaxed text-zinc-400 md:text-2xl">
              Empresas que comparten nuestros valores y nos acompañan en el
              desafío de formar grandes deportistas y mejores personas.
            </p>
          </div>
        </div>
      </section>

      {/* PLATINUM */}
      <section className="border-b border-zinc-100 py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-16 flex items-center gap-4">
            <div className="h-[2px] w-12 bg-amber-500" />
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-amber-600">
              <Star className="h-4 w-4 fill-amber-500" />
              Platinum Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {SPONSORS.platinum.map((s) => (
              <div
                key={s.nombre}
                className="group relative flex aspect-[16/8] items-center justify-center overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-zinc-50 p-12 transition-all duration-700 hover:bg-white hover:shadow-2xl"
              >
                <Image
                  src={s.logo}
                  alt={s.nombre}
                  width={400}
                  height={200}
                  className="h-auto max-h-24 w-auto object-contain grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 md:max-h-32"
                />

                <div className="absolute bottom-6 right-8 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-6 w-6 text-red-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOLD */}
      <section className="bg-zinc-50/50 py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-16 flex items-center gap-4">
            <div className="h-[2px] w-12 bg-red-600" />
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              <Award className="h-4 w-4 text-red-600" />
              Gold Sponsors
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {SPONSORS.gold.map((s) => (
              <div
                key={s.nombre}
                className="group flex aspect-video items-center justify-center rounded-3xl border border-zinc-100 bg-white p-8 transition-all duration-500 hover:shadow-xl"
              >
                <Image
                  src={s.logo}
                  alt={s.nombre}
                  width={300}
                  height={150}
                  className="h-auto max-h-12 w-auto object-contain opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-16"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLABORADORES */}
      <section className="py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-16 flex items-center gap-4">
            <div className="h-[2px] w-12 bg-zinc-200" />
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
              <Handshake className="h-4 w-4" />
              Colaboradores
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {SPONSORS.supporters.map((s) => (
              <div
                key={s.nombre}
                className="group flex items-center justify-center rounded-2xl border border-zinc-100 p-8 transition-all duration-300 hover:bg-zinc-950"
              >
                <Image
                  src={s.logo}
                  alt={s.nombre}
                  width={200}
                  height={100}
                  className="h-auto max-h-8 w-auto object-contain opacity-30 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24 md:py-40">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="group relative overflow-hidden rounded-[3rem] bg-red-600 p-8 md:p-24">
            <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl transition-transform duration-1000 group-hover:scale-125" />

            <div className="relative z-10 flex flex-col items-center space-y-8 text-center">
              <ShieldCheck className="h-16 w-16 animate-pulse text-white" />

              <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter text-white md:text-7xl">
                ¿Querés ser parte <br />
                del Centenario?
              </h2>

              <p className="max-w-xl text-lg font-light text-red-100 md:text-xl">
                Unite a la red de empresas que apoyan al club más histórico de
                San Juan. Tenemos planes de sponsoreo a medida de tu marca.
              </p>

              <Button
                asChild
                className="rounded-none bg-zinc-950 px-12 py-8 text-lg font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-red-600"
              >
                <Link href="/contacto">Recibir Dossier Comercial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
