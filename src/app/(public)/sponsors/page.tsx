import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Handshake, Star, ArrowRight, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";

const SPONSORS = {
  platinum: [
    { nombre: "Empresa Líder", logo: "https://via.placeholder.com/400x200?text=LOGO+1" },
    { nombre: "Banco Regional", logo: "https://via.placeholder.com/400x200?text=LOGO+2" },
  ],
  gold: [
    { nombre: "Seguros San Juan", logo: "https://via.placeholder.com/300x150?text=LOGO+3" },
    { nombre: "Constructora Coll", logo: "https://via.placeholder.com/300x150?text=LOGO+4" },
    { nombre: "Energía Cuyo", logo: "https://via.placeholder.com/300x150?text=LOGO+5" },
  ],
  supporters: [
    { nombre: "Agua Mineral", logo: "https://via.placeholder.com/200x100?text=LOGO+6" },
    { nombre: "Gimnasio Pro", logo: "https://via.placeholder.com/200x100?text=LOGO+7" },
    { nombre: "Nutrición Deportiva", logo: "https://via.placeholder.com/200x100?text=LOGO+8" },
    { nombre: "Kinesiología SJ", logo: "https://via.placeholder.com/200x100?text=LOGO+9" },
  ]
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- 1. HERO INSTITUCIONAL --- */}
      <section className="relative py-24 md:py-40 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] opacity-10" />
        <div className="container relative z-10 px-6 md:px-8">
          <div className="max-w-4xl">
            <Badge className="bg-red-600 text-white rounded-none mb-6 uppercase font-black tracking-[0.3em] px-4 py-1.5 border-none text-[10px]">
              Alianzas Estratégicas
            </Badge>
            <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 italic">
              Ellos <br /> <span className="text-red-600 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Impulsan</span> <br /> El Legado
            </h1>
            <p className="text-zinc-400 text-lg md:text-2xl font-light max-w-2xl leading-relaxed">
              Empresas que comparten nuestros valores y nos acompañan en el desafío de formar grandes deportistas y mejores personas.
            </p>
          </div>
        </div>
      </section>

      {/* --- 2. PLATINUM SPONSORS (GIGANTES) --- */}
      <section className="py-24 md:py-32 border-b border-zinc-100">
        <div className="container px-6 md:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[2px] w-12 bg-amber-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-amber-600 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-500" /> Platinum Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SPONSORS.platinum.map((s, i) => (
              <div key={i} className="group relative aspect-[16/8] bg-zinc-50 border border-zinc-100 rounded-[2.5rem] flex items-center justify-center p-12 overflow-hidden hover:bg-white hover:shadow-2xl transition-all duration-700">
                <img 
                  src={s.logo} 
                  alt={s.nombre} 
                  className="max-h-24 md:max-h-32 object-contain grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                />
                <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="text-red-600 w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. GOLD SPONSORS (GRILLA) --- */}
      <section className="py-24 bg-zinc-50/50">
        <div className="container px-6 md:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[2px] w-12 bg-red-600" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-red-600" /> Gold Sponsors
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {SPONSORS.gold.map((s, i) => (
              <div key={i} className="group aspect-video bg-white border border-zinc-100 rounded-3xl flex items-center justify-center p-8 hover:shadow-xl transition-all duration-500">
                <img 
                  src={s.logo} 
                  alt={s.nombre} 
                  className="max-h-12 md:max-h-16 object-contain opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-500" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. SUPPORTERS (GRILLA PEQUEÑA) --- */}
      <section className="py-24">
        <div className="container px-6 md:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[2px] w-12 bg-zinc-200" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 flex items-center gap-2">
              <Handshake className="w-4 h-4" /> Colaboradores
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SPONSORS.supporters.map((s, i) => (
              <div key={i} className="group p-8 border border-zinc-100 rounded-2xl flex items-center justify-center hover:bg-zinc-950 transition-all duration-300">
                <img 
                  src={s.logo} 
                  alt={s.nombre} 
                  className="max-h-8 object-contain opacity-30 group-hover:opacity-100 grayscale group-hover:grayscale-0 group-hover:invert transition-all duration-300" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. CTA PARA NUEVOS SPONSORS --- */}
      <section className="py-24 md:py-40 bg-white">
        <div className="container px-6 md:px-8">
          <div className="bg-red-600 rounded-[3rem] p-8 md:p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <ShieldCheck className="w-16 h-16 text-white animate-pulse" />
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">
                ¿Querés ser parte <br /> del Centenario?
              </h2>
              <p className="text-red-100 text-lg md:text-xl font-light max-w-xl">
                Unite a la red de empresas que apoyan al club más histórico de San Juan. Tenemos planes de sponsoreo a medida de tu marca.
              </p>
              <Button className="bg-zinc-950 hover:bg-white hover:text-red-600 text-white rounded-none font-black uppercase tracking-widest px-12 py-8 text-lg transition-all" asChild>
                <Link href="/contacto">Recibir Dossier Comercial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}