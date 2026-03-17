import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, ChevronRight, Clock, 
  Trophy, Users, Shield, MapPin, Heart
} from "lucide-react";

// Importamos el cliente público
import { supabasePublic } from "@/lib/supabase/public";

// Importamos el contador
import { Countdown } from "@/components/centenario/Countdown";

const IMAGENES = {
  hero: "/images/fondo.jpg",
  rugby: "/images/rugby.jpg",
  hockey: "/images/hockey.jpg",
  club_vida: "/images/club.jpeg",
  centenario: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop"
};

export default async function HomePage() {
  
  const supabase = supabasePublic;
  const ahora = new Date().toISOString();

  // 1. Traer las últimas 3 noticias
  const { data: noticiasBD } = await supabase
    .from('noticias')
    .select('*')
    .order('creado_en', { ascending: false })
    .limit(3);

  // 2. LÓGICA INTELIGENTE DE PARTIDOS
  // Primero intentamos buscar el próximo partido (el más cercano en el futuro)
  const { data: proximo } = await supabase
    .from('partidos')
    .select('*')
    .gt('fecha_programada', ahora)
    .order('fecha_programada', { ascending: true })
    .limit(1)
    .single();

  // Si no hay partidos futuros, buscamos el último que se jugó para mostrar el resultado
  const { data: ultimo } = await supabase
    .from('partidos')
    .select('*')
    .lt('fecha_programada', ahora)
    .order('fecha_programada', { ascending: false })
    .limit(1)
    .single();

  const partidoBD = proximo || ultimo;

  const sponsorsOficiales = [
    { id: 1, nombre: "Sponsor 1" },
    { id: 2, nombre: "Sponsor 2" },
    { id: 3, nombre: "Sponsor 3" },
    { id: 4, nombre: "Sponsor 4" },
  ];

  const huazihulEsLocal = partidoBD?.equipo_local?.toUpperCase().includes("HUAZIHUL");
  
  // Determinamos si el partido ya pasó basándonos en la fecha programada
  const yaPaso = partidoBD?.fecha_programada ? new Date(partidoBD.fecha_programada) < new Date() : false;
  
  // Formateamos la fecha para que se vea: "sábado 20/03 · 16:30 HS"
  const fechaVisual = partidoBD?.fecha_programada 
    ? new Date(partidoBD.fecha_programada).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
      }) + ` · ${new Date(partidoBD.fecha_programada).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} HS`
    : "";

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative w-full h-[90vh] lg:h-[85vh] min-h-[500px] bg-black overflow-hidden flex items-center justify-center"> 
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 scale-105"
          style={{ backgroundImage: `url(${IMAGENES.hero})` }}
        />
        <div className="container relative z-10 px-6 md:px-8 flex flex-col items-center justify-center text-center"> 
          
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="h-1 w-8 md:h-1.5 md:w-10 bg-red-600 mb-2"></div>
            <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs md:text-base">
              San Juan · Argentina
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 lg:whitespace-nowrap">
            Bienvenidos a <br className="md:hidden" /> <span className="text-red-600">Huazihul</span>
          </h1>
          
          <p className="text-zinc-300 text-base md:text-xl font-light max-w-xl mb-12 md:mb-16 leading-relaxed mx-auto px-4">
            Club de Rugby y Hockey. Formando deportistas y construyendo familia desde 1927. Rumbo a nuestro primer centenario.
          </p>
          
          {/* AQUÍ SE APLICÓ LA CORRECCIÓN DE LOS BOTONES */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-lg px-2 sm:px-0 mx-auto">
            <Button 
              asChild 
              className="w-full sm:w-auto bg-red-600 hover:bg-white text-white hover:text-black rounded-full font-black uppercase tracking-[0.2em] text-xs md:text-sm px-10 py-6 transition-all duration-300 shadow-xl shadow-red-600/20 active:scale-95 group"
            >
              <Link href="/socios" className="flex items-center gap-2 justify-center">
                Asociate Hoy
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button 
              asChild 
              variant="outline" 
              className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white rounded-full font-black uppercase tracking-[0.2em] text-xs md:text-sm px-10 py-6 transition-all duration-300 backdrop-blur-sm active:scale-95"
            >
              <Link href="/deportes">Quiero Jugar</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- 2. TICKER / INFO BAR (INTELIGENTE) --- */}
      {partidoBD && (
        <div className="bg-zinc-950 border-b-4 border-red-600 py-6 lg:py-4 relative z-20 shadow-2xl">
          <div className="container px-4 md:px-8 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 text-white font-medium uppercase tracking-wider">
              <Badge className={`${yaPaso ? 'bg-zinc-700' : 'bg-red-600 animate-pulse'} text-white rounded-none border-none py-1.5 px-3 tracking-widest text-[10px]`}>
                {yaPaso ? "Último Resultado" : "Próximo Partido"}
              </Badge>
              {!yaPaso && (
                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-zinc-400">
                  <Clock className="w-4 h-4 text-red-600"/> {fechaVisual}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 md:gap-10">
              <span className={`font-black uppercase tracking-tighter text-xl md:text-3xl ${huazihulEsLocal ? "text-white" : "text-zinc-600"}`}>
                {partidoBD.equipo_local}
              </span>
              
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 border border-white/10 rounded-lg">
                <span className={`font-black text-2xl md:text-4xl ${huazihulEsLocal ? 'text-red-600' : 'text-white'}`}>
                  {partidoBD.resultado_local ?? (yaPaso ? "0" : "-")}
                </span>
                <span className="text-zinc-700 font-black px-2 text-xl italic">VS</span>
                <span className={`font-black text-2xl md:text-4xl ${!huazihulEsLocal ? 'text-red-600' : 'text-white'}`}>
                  {partidoBD.resultado_visitante ?? (yaPaso ? "0" : "-")}
                </span>
              </div>

              <span className={`font-black uppercase tracking-tighter text-xl md:text-3xl ${!huazihulEsLocal ? "text-white" : "text-zinc-600"}`}>
                {partidoBD.equipo_visitante}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="flex text-zinc-500 font-bold tracking-widest uppercase text-[10px] items-center gap-1">
                <MapPin className="w-3 h-3 text-red-600"/> {partidoBD.cancha}
              </span>
              <Link href="/fixture" className="text-white hover:text-red-500 font-black uppercase tracking-widest text-[10px] flex items-center transition-colors border-b border-white/20 pb-1">
                Ver Calendario <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- 3. DISCIPLINAS --- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-6 md:px-8">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="w-12 h-1.5 bg-red-600 mb-4"></div>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter">Disciplinas</h2>
            </div>
            <p className="text-zinc-500 max-w-md md:text-right font-light text-sm md:text-base">
              Desarrollamos el talento desde las bases infantiles hasta la máxima exigencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            <Link href="/deportes/rugby" className="group block relative h-[400px] md:h-[600px] bg-zinc-100 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${IMAGENES.rugby})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Rugby</h3>
                <div className="inline-flex items-center text-red-500 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors">
                  Ver Categorías <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>

            <Link href="/deportes/hockey" className="group block relative h-[400px] md:h-[600px] bg-zinc-100 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${IMAGENES.hockey})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Hockey</h3>
                <div className="inline-flex items-center text-red-500 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors">
                  Ver Entrenamientos <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* --- 4. VIDA DE CLUB --- */}
      <section className="py-16 md:py-24 bg-zinc-900 overflow-hidden relative">
        <div className="container px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-12 h-1.5 bg-red-600 mb-4"></div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">La Vida <br/>en el Club</h2>
              <p className="text-zinc-400 font-light mb-8 leading-relaxed max-w-lg text-sm md:text-base">
                El deporte es solo la mitad de la historia. Huazihul es el Tercer Tiempo, es el Quincho, es la comunidad que te acompaña toda la vida.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs">
                  <Heart className="w-5 h-5 text-red-600" /> Amistad
                </div>
                <div className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs">
                  <Users className="w-5 h-5 text-red-600" /> Familia
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto border-red-600 text-red-500 bg-transparent hover:bg-red-600 hover:text-white rounded-none uppercase font-bold tracking-widest h-12 px-8" asChild>
                <Link href="/el-club">Instalaciones</Link>
              </Button>
            </div>
            
            <div className="relative h-[300px] md:h-[500px] lg:h-[600px] w-full order-1 lg:order-2">
              <div 
                className="absolute inset-0 bg-cover bg-center border-l-4 border-b-4 md:border-l-8 md:border-b-8 border-red-600 ml-4 mb-4 md:ml-8 md:mb-8 z-10 shadow-2xl"
                style={{ backgroundImage: `url(${IMAGENES.club_vida})` }}
              />
              <div className="absolute top-0 right-0 w-full h-full bg-zinc-800 -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. ACTUALIDAD --- */}
      <section className="py-16 md:py-24 bg-zinc-50">
        <div className="container px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="w-12 h-1.5 bg-red-600 mb-4"></div>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase tracking-tighter">Actualidad</h2>
            </div>
            <Link href="/noticias" className="text-red-600 font-bold uppercase tracking-widest text-xs flex items-center">
              Ver Todo <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {noticiasBD && noticiasBD.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticiasBD.map((news) => (
                <Link href={`/noticias/${news.id}`} key={news.id} className="group flex flex-col h-full bg-white p-4 shadow-sm hover:shadow-xl transition-shadow border-b-4 border-transparent hover:border-red-600">
                  <div className="w-full aspect-video bg-zinc-200 mb-6 overflow-hidden relative">
                    <img src={news.imagen_url} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={news.titulo} />
                  </div>
                  <Badge className="bg-transparent border border-red-600 text-red-600 rounded-none uppercase text-[9px] w-fit mb-4">
                    {news.etiqueta}
                  </Badge>
                  <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight mb-3 group-hover:text-red-600">
                    {news.titulo}
                  </h3>
                  <p className="text-zinc-600 font-light text-xs mb-5 line-clamp-2">
                    {news.descripcion}
                  </p>
                  <span className="text-zinc-900 font-bold uppercase text-[10px] tracking-widest flex items-center mt-auto group-hover:translate-x-2 transition-transform">
                    Leer más <ArrowRight className="w-4 h-4 ml-2 text-red-600" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-300 border-2 border-dashed border-zinc-200 uppercase font-black tracking-widest text-sm">Próximamente novedades.</div>
          )}
        </div>
      </section>

      {/* --- 6. CENTENARIO & PORTAL --- */}
      <section className="bg-zinc-900 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-8 md:p-16 lg:p-20 relative overflow-hidden bg-black flex flex-col justify-center border-b-8 lg:border-b-0 lg:border-r-8 border-amber-600 min-h-[400px]">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity" style={{ backgroundImage: `url(${IMAGENES.centenario})` }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
              Camino al <span className="text-amber-500">Centenario</span>
            </h2>
            <div className="my-8 scale-90 sm:scale-100 origin-left">
              <Countdown />
            </div>
            <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white rounded-none uppercase font-bold tracking-widest px-8 h-14" asChild>
              <Link href="/camino-al-centenario">Nuestra Historia</Link>
            </Button>
          </div>
        </div>

        <div className="lg:w-1/2 p-8 md:p-16 lg:p-20 bg-zinc-900 flex flex-col justify-center text-center lg:text-left min-h-[400px]">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
            Portal <br/><span className="text-red-600">Autogestión</span>
          </h2>
          <p className="text-zinc-500 mb-8 max-w-sm mx-auto lg:mx-0 font-light italic">Acceso exclusivo para administradores del club.</p>
          <Button variant="outline" className="w-full sm:w-auto border-white text-white bg-transparent hover:bg-white hover:text-black rounded-none uppercase font-bold tracking-widest px-8 h-14 transition-all" asChild>
            <Link href="/admin">Ingresar al Panel</Link>
          </Button>
        </div>
      </section>

      {/* --- 7. SPONSORS --- */}
      <section className="py-20 bg-white border-t border-zinc-100">
        <div className="container px-4 text-center">
          <h4 className="text-zinc-400 uppercase tracking-widest text-[10px] font-bold mb-12">Sponsors Oficiales que apoyan el club</h4>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-700">
            {sponsorsOficiales.map((sponsor) => (
              <span key={sponsor.id} className="text-xl md:text-3xl font-black text-zinc-900 uppercase italic tracking-tighter">
                {sponsor.nombre}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}