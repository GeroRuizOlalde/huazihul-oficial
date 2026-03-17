import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Heart, Beer, Shirt, 
  UserCheck, History, Award, ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default function ElClubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- 1. HERO INSTITUCIONAL --- */}
      <section className="relative h-[70vh] lg:h-[80vh] flex items-center bg-zinc-950 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url('/images/club.jpeg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        <div className="container relative z-10 px-6 md:px-8">
          <Badge className="bg-red-600 text-white rounded-none uppercase font-black tracking-[0.3em] px-4 py-1.5 mb-8 border-none text-[10px]">
            Identidad Cacique
          </Badge>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-6 italic">
            Legado <br /> <span className="text-red-600">Cuyano</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-2xl max-w-2xl font-light leading-relaxed">
            Huazihul San Juan Rugby Club: El primer club de San Juan y pionero de la región, forjando la historia del deporte desde 1927.
          </p>
        </div>
      </section>

      {/* --- 2. RESUMEN HISTÓRICO --- */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container px-6 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <div className="w-16 h-1.5 bg-red-600 mb-8"></div>
                <h2 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter leading-none mb-6">
                  Los Orígenes <br /> del Primer Club
                </h2>
                <p className="text-red-600 font-bold italic text-lg">
                  "Bautizaron al club con el nombre del cacique: el orgullo de ser Huazihul."
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-8 space-y-8 text-zinc-600 text-lg md:text-xl font-light leading-relaxed">
              <p>
                Huazihul nació en el <b className="text-zinc-900 font-black">invierno del '27</b> y se convirtió en el primer club de San Juan y también de la región cuyana. Su importancia es tal que es uno de los fundadores de la Unión de Rugby de Cuyo en 1945, y siete años después, de la Unión Sanjuanina.
              </p>
              <p>
                Aquellos pioneros tenían como punto de reunión el <b className="text-zinc-900 font-black">Bar Alemán</b>, muy cerca de la Plaza 25 de Mayo. Entre los fundadores se encontraban Enrique De Donatis, los hermanos Castro, los hermanos Finnemore, Eugenio De León y Eugenio Pradella.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 my-16 bg-zinc-50 p-10 rounded-[2rem] border-l-8 border-red-600">
                <div className="space-y-3">
                  <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                    <Beer className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-black uppercase text-sm tracking-widest text-zinc-900">El Bar Alemán</h4>
                  <p className="text-sm leading-relaxed">El centro neurálgico donde Jorge Hirsh recibía a los muchachos que soñaban con el rugby sanjuanino.</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                    <Shirt className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-black uppercase text-sm tracking-widest text-zinc-900">Colores con Historia</h4>
                  <p className="text-sm leading-relaxed">Del clásico rojinegro a cuadros pequeños hasta el diseño moderno que impone respeto en toda la región.</p>
                </div>
              </div>

              <p>
                Uno de los grandes propulsores fue <b className="text-zinc-900 font-black">William Richard Finnemore</b>, quien heredó la pasión de su padre, llegado desde Londres a fines del siglo XIX. Juntos, no solo fundaron un club, sino una escuela de vida que bautizaron con el nombre del <span className="text-red-600 font-black">Cacique Huazihul</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. COMISIÓN DIRECTIVA --- */}
      <section className="py-24 md:py-32 bg-zinc-950 text-white relative overflow-hidden">
        <div className="container px-6 md:px-8 relative z-10">
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="text-red-600 w-6 h-6" />
              <span className="font-black uppercase tracking-[0.4em] text-red-500 text-xs">Gestión Actual</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Comisión <br/> <span className="text-red-600">Directiva</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-24">
            {[
              { cargo: "Presidente", nombre: "Nombre y Apellido" },
              { cargo: "Vicepresidente", nombre: "Nombre y Apellido" },
              { cargo: "Secretario", nombre: "Nombre y Apellido" },
              { cargo: "Tesorero", nombre: "Nombre y Apellido" },
              { cargo: "Pro-Secretario", nombre: "Nombre y Apellido" },
              { cargo: "Pro-Tesorero", nombre: "Nombre y Apellido" },
            ].map((persona, i) => (
              <div key={i} className="border-b border-zinc-800 pb-6 group hover:border-red-600 transition-all">
                <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-2 group-hover:text-red-500 transition-colors">
                  {persona.cargo}
                </p>
                <p className="text-2xl font-black uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  {persona.nombre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. EX PRESIDENTES --- */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container px-6 md:px-8">
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <History className="text-red-600 w-6 h-6" />
              <span className="font-black uppercase tracking-[0.4em] text-zinc-400 text-xs">Galería de Honor</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-900 italic">Ex Presidentes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { nombre: "William R. Finnemore", periodo: "1927 - 1930" },
              { nombre: "Nombre Apellido", periodo: "1930 - 1935" },
              { nombre: "Nombre Apellido", periodo: "1935 - 1940" },
              { nombre: "Nombre Apellido", periodo: "1940 - 1945" },
            ].map((ex, i) => (
              <div key={i} className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 flex flex-col items-center text-center group hover:bg-zinc-900 hover:text-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-red-600/10">
                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-red-600 transition-colors">
                  <Award className="w-6 h-6 text-red-600 group-hover:text-white" />
                </div>
                <h4 className="font-black uppercase tracking-tight leading-tight mb-4 text-lg">{ex.nombre}</h4>
                <Badge className="border bg-transparent rounded-none text-[10px] font-black border-zinc-300 group-hover:border-red-600 group-hover:text-red-500 uppercase tracking-widest px-3">
                  {ex.periodo}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. TIMELINE HISTÓRICO --- */}
      <section className="py-24 md:py-32 bg-zinc-50 border-y border-zinc-100 relative overflow-hidden">
        <div className="container px-6 md:px-8">
          <div className="max-w-5xl mx-auto relative">
            {/* Línea central decorativa (solo desktop) */}
            <div className="hidden md:block absolute left-[15%] top-0 w-[2px] h-full bg-zinc-200"></div>
            
            <h3 className="text-center md:text-left md:pl-[15%] text-sm font-black uppercase tracking-[0.5em] text-red-600 mb-24">
              Cronología Cacique
            </h3>
            
            <div className="space-y-32">
              {[
                { year: "1927", tag: "FUNDACIÓN", title: "Nacimiento en el Invierno", text: "El primer club de San Juan comienza sus prácticas en el estadio abierto del Parque de Mayo. La mística del Bar Alemán se traslada a la cancha." },
                { year: "1945", tag: "INSTITUCIONAL", title: "Fundadores de Uniones", text: "Huazihul lidera la creación de la Unión de Rugby de Cuyo y, posteriormente en 1952, la Unión Sanjuanina de Rugby." },
                { year: "1960", tag: "INFRAESTRUCTURA", title: "La Sede de Chimbas", text: "Se consigue el terreno detrás del Penal. Gracias a la tierra de la Bodega Cavic, el suelo pedregoso se transforma en nuestra casa por décadas." },
                { year: "2026", tag: "PRESENTE", title: "Sede Calle Coll", text: "Mudanza a la casa definitiva en Rivadavia. Contamos actualmente con dos canchas funcionales y la principal en construcción rumo al centenario." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 items-start group relative">
                  <div className="md:w-1/3 text-8xl lg:text-[10rem] font-black text-zinc-200 group-hover:text-red-600/10 transition-all duration-700 tracking-tighter leading-none z-0">
                    {item.year}
                  </div>
                  <div className="md:w-2/F3 pt-4 md:pt-14 relative z-10">
                    <Badge className="bg-red-600 mb-6 rounded-none font-black tracking-widest border-none text-[10px]">
                      {item.tag}
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-black uppercase mb-6 text-zinc-900 italic tracking-tighter">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-xl">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. CTA FINAL --- */}
      <section className="py-24 bg-zinc-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/5" />
        <div className="container px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 italic">
            Sé parte de <br/> <span className="text-red-600">Nuestra Historia</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-none font-black uppercase tracking-widest px-12 h-16 text-sm shadow-xl shadow-red-600/20 transition-all" asChild>
              <Link href="/socios">Asociate Hoy</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none font-black uppercase tracking-widest px-12 h-16 text-sm transition-all" asChild>
              <Link href="/contacto">Consultas</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}