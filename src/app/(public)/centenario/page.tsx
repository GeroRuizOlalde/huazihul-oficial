import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, Star, ArrowDown, HardHat, CalendarDays, 
  ShoppingBag, ArrowRight, Sparkles, Trophy 
} from "lucide-react";
import { Countdown } from "@/components/centenario/Countdown";

const IMAGENES = {
  hero: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2000&auto=format&fit=crop",
  obras: "https://images.unsplash.com/photo-1589806306531-90a6e00d9223?q=80&w=1000&auto=format&fit=crop", 
  camiseta: "https://images.unsplash.com/photo-1579548122080-c35fd6820ceb?q=80&w=1000&auto=format&fit=crop" 
};

export default function CentenarioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* --- 1. HERO ÉPICO --- */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 animate-in fade-in duration-1000"
          style={{ backgroundImage: `url(${IMAGENES.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/80 to-zinc-950" />
        
        {/* Resplandor dorado de fondo - Ajustado z-index */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-500/10 blur-[120px] rounded-full -z-10" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-amber-500 font-black uppercase tracking-[0.4em] mb-8 text-xs md:text-sm">
            <Star className="w-4 h-4 fill-amber-500 animate-pulse" />
            <span className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">1927 — 2027</span>
            <Star className="w-4 h-4 fill-amber-500 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-8 italic">
            Un Siglo de <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">Gloria</span>
          </h1>
          
          <p className="text-zinc-300 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-12">
            Cien años forjando el carácter de San Juan. El camino hacia la celebración más grande de nuestra historia ya comenzó.
          </p>

          <div className="flex flex-col items-center">
            <ArrowDown className="w-8 h-8 text-red-600 animate-bounce" />
          </div>
        </div>
      </section>

      {/* --- 2. EL CONTADOR --- */}
      <section className="py-24 bg-zinc-950 relative border-y border-zinc-900">
        <div className="container px-4 text-center">
          <Badge className="bg-amber-500 text-black rounded-none mb-12 uppercase font-black tracking-widest px-6 py-2 border-none">
            Cuenta Regresiva Oficial
          </Badge>
          {/* Ajustamos el padding del contenedor para que el scale no desplace el layout */}
          <div className="flex justify-center py-6">
            <div className="scale-110 md:scale-150 transition-transform duration-500">
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. PROYECTO INFRAESTRUCTURA --- */}
      <section className="py-24 md:py-40 bg-zinc-900 relative">
        <div className="container px-6 md:px-8 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute -inset-4 bg-red-600/10 transform -skew-y-3 z-0 group-hover:bg-red-600/20 transition-all duration-500"></div>
              <div className="relative z-10 overflow-hidden rounded-[2rem] border-l-8 border-red-600 shadow-2xl">
                <img 
                  src={IMAGENES.obras} 
                  alt="Proyecto Centenario" 
                  className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-8">
              <div className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-xs">
                <HardHat className="w-5 h-5" /> Masterplan 2027
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">
                Obras que <br/><span className="text-red-600">Hacen Historia</span>
              </h2>
              <p className="text-zinc-400 font-light text-xl leading-relaxed">
                Los 100 años se construyen día a día. Estamos ejecutando la renovación del quincho principal y nueva iluminación LED para garantizar el futuro del club.
              </p>
              <Button className="bg-white text-zinc-950 hover:bg-red-600 hover:text-white rounded-none font-black uppercase tracking-widest px-10 py-8 text-sm transition-all shadow-2xl border-none"> 
                Conocé el Proyecto
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. AGENDA DE FESTEJOS --- */}
      <section className="py-24 md:py-32 bg-zinc-950">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">Agenda <span className="text-zinc-800">2027</span></h2>
            <p className="text-zinc-500 font-light max-w-2xl mx-auto text-lg tracking-wide uppercase tracking-[0.2em]">Hitos confirmados</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { mes: "Marzo", titulo: "Torneo de Leyendas", desc: "Encuentro de veteranos y ex-jugadores de todas las épocas." },
              { mes: "Mayo", titulo: "Día de la Familia", desc: "Jornada recreativa monumental con todas las divisiones." },
              { mes: "14 Julio", titulo: "Cena de Gala", desc: "La noche más esperada del siglo. Reconocimientos y gloria." },
            ].map((evento, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-[2.5rem] hover:border-amber-500/50 transition-all group relative overflow-hidden">
                <div className="absolute top-8 right-8 text-zinc-800 group-hover:text-amber-500/20 transition-colors">
                  <CalendarDays className="w-12 h-12" />
                </div>
                <span className="text-amber-500 font-black uppercase tracking-[0.2em] text-xs mb-6 block">{evento.mes}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white leading-none">{evento.titulo}</h3>
                <p className="text-zinc-500 font-light leading-relaxed">{evento.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. MURO DEL CENTENARIO --- */}
      <section className="py-32 bg-zinc-900 border-y border-zinc-800 text-center relative overflow-hidden">
        <div className="container px-6 relative z-10 max-w-4xl mx-auto">
          <div className="mx-auto w-fit relative mb-12">
            <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse"></div>
            <Shield className="w-24 h-24 text-amber-500 relative z-10 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
          </div>

          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
            Tu nombre en <br/><span className="text-red-600">El Muro Eterno</span>
          </h2>
          <p className="text-zinc-400 font-light text-xl leading-relaxed mb-12">
            Adquirí tu placa fundacional y dejá tu marca en el ingreso al club. El legado del Cacique lo escribimos entre todos.
          </p>
          <Button className="bg-red-600 hover:bg-white hover:text-black text-white rounded-none uppercase font-black tracking-widest px-12 py-8 text-lg shadow-2xl shadow-red-600/30 transition-all" asChild>
            <Link href="/contacto">Reservar mi Placa</Link>
          </Button>
        </div>
      </section>

      {/* --- 6. MERCHANDISING --- */}
      <section className="py-24 md:py-40 bg-black">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b border-zinc-800 pb-12">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-black uppercase tracking-widest mb-4 text-xs">
                <ShoppingBag className="w-5 h-5" /> Boutique Centenario
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">Edición <span className="text-zinc-800">100</span></h2>
            </div>
            <Link href="#" className="text-zinc-500 hover:text-amber-500 uppercase font-black tracking-widest text-xs flex items-center transition-all group py-2">
              Explorar Tienda <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <div className="group cursor-pointer space-y-8">
              <div className="aspect-[4/3] bg-zinc-900 overflow-hidden relative border border-zinc-800 group-hover:border-amber-500/50 transition-all duration-500 rounded-[2.5rem] shadow-2xl">
                <img src={IMAGENES.camiseta} alt="Camiseta Centenario" className="w-full h-full object-cover opacity-30 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000" />
                <div className="absolute top-8 left-8 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 shadow-2xl">Pre-Venta</div>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">Manto Sagrado 100 Años</h3>
              <p className="text-zinc-500 font-light text-lg">Diseño histórico con detalles en oro y el escudo fundacional. Cantidades limitadas.</p>
            </div>

            <div className="group cursor-pointer space-y-8">
              <div className="aspect-[4/3] bg-zinc-900 overflow-hidden relative border border-zinc-800 group-hover:border-red-600/50 transition-all duration-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                <Trophy className="w-20 h-20 text-zinc-800 group-hover:text-red-600 transition-colors duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-10">
                  <span className="text-zinc-400 font-black uppercase tracking-widest text-xs italic opacity-60">Libro: Un Siglo de Caciques</span>
                </div>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">Relatos de un Siglo</h3>
              <p className="text-zinc-500 font-light text-lg">Recopilación definitiva de fotos inéditas y anécdotas que forjaron la mística del club.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}