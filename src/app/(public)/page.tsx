import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Users,
  MapPin,
  Heart,
} from "lucide-react";

import { supabasePublic } from "@/lib/supabase/public";
import { Countdown } from "@/components/centenario/Countdown";

const IMAGENES = {
  hero: "/images/fondo.jpg",
  rugby: "/images/rugby.jpg",
  hockey: "/images/hockey.jpg",
  clubVida: "/images/club.jpeg",
  centenario:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop",
};

export default async function HomePage() {
  const supabase = supabasePublic;
  const now = new Date();
  const ahoraIso = now.toISOString();

  const [
    { data: noticiasBD, error: noticiasError },
    { data: proximo, error: proximoError },
    { data: ultimo, error: ultimoError },
  ] = await Promise.all([
    supabase
      .from("noticias")
      .select("id, titulo, descripcion, etiqueta, imagen_url, creado_en")
      .order("creado_en", { ascending: false })
      .limit(3),

    supabase
      .from("partidos")
      .select(
        "id, fecha_programada, equipo_local, equipo_visitante, resultado_local, resultado_visitante, cancha"
      )
      .gt("fecha_programada", ahoraIso)
      .order("fecha_programada", { ascending: true })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("partidos")
      .select(
        "id, fecha_programada, equipo_local, equipo_visitante, resultado_local, resultado_visitante, cancha"
      )
      .lt("fecha_programada", ahoraIso)
      .order("fecha_programada", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (noticiasError) console.error("Error cargando noticias:", noticiasError);
  if (proximoError) console.error("Error cargando próximo partido:", proximoError);
  if (ultimoError) console.error("Error cargando último partido:", ultimoError);

  const noticias = noticiasBD ?? [];
  const partidoBD = proximo || ultimo;

  const fechaPartido = partidoBD?.fecha_programada
    ? new Date(partidoBD.fecha_programada)
    : null;

  const yaPaso = fechaPartido ? fechaPartido < now : false;

  const huazihulEsLocal = (partidoBD?.equipo_local ?? "")
  .toUpperCase()
  .includes("HUAZIHUL");

  const fechaVisual = fechaPartido
    ? `${fechaPartido.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      })} · ${fechaPartido.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })} HS`
    : "";

  const sponsorsOficiales = [
    { id: 1, nombre: "Sponsor 1" },
    { id: 2, nombre: "Sponsor 2" },
    { id: 3, nombre: "Sponsor 3" },
    { id: 4, nombre: "Sponsor 4" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 selection:bg-red-600 selection:text-white">
      {/* HERO */}
      <section className="relative flex h-[90vh] min-h-[500px] w-full items-center justify-center overflow-hidden bg-black lg:h-[85vh]">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${IMAGENES.hero})` }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center px-6 text-center md:px-8">
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="mb-2 h-1 w-8 bg-red-600 md:h-1.5 md:w-10" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 md:text-base">
              San Juan · Argentina
            </span>
          </div>

          <h1 className="mb-8 text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-7xl lg:text-8xl lg:whitespace-nowrap">
            Bienvenidos a <br className="md:hidden" />{" "}
            <span className="text-red-600">Huazihul</span>
          </h1>

          <p className="mx-auto mb-12 max-w-xl px-4 text-base font-light leading-relaxed text-zinc-300 md:mb-16 md:text-xl">
            Club de Rugby y Hockey. Formando deportistas y construyendo familia
            desde 1927. Rumbo a nuestro primer centenario.
          </p>

          <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-4 px-2 sm:flex-row sm:px-0 md:gap-6">
            <Button
              asChild
              className="group w-full rounded-full bg-red-600 px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-600/20 transition-all duration-300 hover:bg-white hover:text-black active:scale-95 sm:w-auto md:text-sm"
            >
              <Link
                href="/socios"
                className="flex items-center justify-center gap-2"
              >
                Asociate Hoy
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-2 border-white/30 bg-transparent px-10 py-6 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10 active:scale-95 sm:w-auto md:text-sm"
            >
              <Link href="/deportes">Quiero Jugar</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TICKER / INFO PARTIDO */}
      {partidoBD && (
        <div className="relative z-20 border-b-4 border-red-600 bg-zinc-950 py-6 shadow-2xl lg:py-4">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-6 px-4 md:px-8 lg:flex-row lg:gap-4">
            <div className="flex flex-col items-center gap-3 text-white sm:flex-row md:gap-4">
              <Badge
                className={`${
                  yaPaso ? "bg-zinc-700" : "animate-pulse bg-red-600"
                } border-none rounded-none px-3 py-1.5 text-[10px] tracking-widest text-white`}
              >
                {yaPaso ? "Último Resultado" : "Próximo Partido"}
              </Badge>

              {!yaPaso && (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-400 md:text-xs">
                  <Clock className="h-4 w-4 text-red-600" />
                  {fechaVisual}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 md:gap-10">
              <span
                className={`text-xl font-black uppercase tracking-tighter md:text-3xl ${
                  huazihulEsLocal ? "text-white" : "text-zinc-600"
                }`}
              >
                {partidoBD.equipo_local ?? "Local"}
              </span>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                <span
                  className={`text-2xl font-black md:text-4xl ${
                    huazihulEsLocal ? "text-red-600" : "text-white"
                  }`}
                >
                  {partidoBD.resultado_local ?? (yaPaso ? "0" : "-")}
                </span>
                <span className="px-2 text-xl font-black italic text-zinc-700">
                  VS
                </span>
                <span
                  className={`text-2xl font-black md:text-4xl ${
                    !huazihulEsLocal ? "text-red-600" : "text-white"
                  }`}
                >
                  {partidoBD.resultado_visitante ?? (yaPaso ? "0" : "-")}
                </span>
              </div>

              <span
                className={`text-xl font-black uppercase tracking-tighter md:text-3xl ${
                  !huazihulEsLocal ? "text-white" : "text-zinc-600"
                }`}
              >
                {partidoBD.equipo_visitante ?? "Visitante"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <MapPin className="h-3 w-3 text-red-600" />
                {partidoBD.cancha ?? "Cancha a confirmar"}
              </span>

              <Link
                href="/fixture"
                className="flex items-center border-b border-white/20 pb-1 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:text-red-500"
              >
                Ver Calendario
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DISCIPLINAS */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 h-1.5 w-12 bg-red-600" />
              <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 md:text-5xl">
                Disciplinas
              </h2>
            </div>

            <p className="max-w-md text-sm font-light text-zinc-500 md:text-right md:text-base">
              Desarrollamos el talento desde las bases infantiles hasta la
              máxima exigencia.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
            <Link
              href="/deportes/rugby"
              className="group relative block h-[400px] overflow-hidden bg-zinc-100 md:h-[600px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${IMAGENES.rugby})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                <h3 className="mb-4 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
                  Rugby
                </h3>
                <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-red-500 transition-colors group-hover:text-white">
                  Ver Categorías
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link
              href="/deportes/hockey"
              className="group relative block h-[400px] overflow-hidden bg-zinc-100 md:h-[600px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${IMAGENES.hockey})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                <h3 className="mb-4 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
                  Hockey
                </h3>
                <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-red-500 transition-colors group-hover:text-white">
                  Ver Entrenamientos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* VIDA DE CLUB */}
      <section className="relative overflow-hidden bg-zinc-900 py-16 md:py-24">
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="mb-4 h-1.5 w-12 bg-red-600" />
              <h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-white md:text-5xl">
                La Vida <br />
                en el Club
              </h2>

              <p className="mb-8 max-w-lg text-sm font-light leading-relaxed text-zinc-400 md:text-base">
                El deporte es solo la mitad de la historia. Huazihul es el
                Tercer Tiempo, es el Quincho, es la comunidad que te acompaña
                toda la vida.
              </p>

              <div className="mb-10 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white md:text-xs">
                  <Heart className="h-5 w-5 text-red-600" />
                  Amistad
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white md:text-xs">
                  <Users className="h-5 w-5 text-red-600" />
                  Familia
                </div>
              </div>

              <Button
                variant="outline"
                asChild
                className="h-12 w-full rounded-none border-red-600 bg-transparent px-8 font-bold uppercase tracking-widest text-red-500 hover:bg-red-600 hover:text-white sm:w-auto"
              >
                <Link href="/el-club">Instalaciones</Link>
              </Button>
            </div>

            <div className="relative order-1 h-[300px] w-full lg:order-2 lg:h-[600px] md:h-[500px]">
              <div
                className="absolute inset-0 z-10 mb-4 ml-4 border-b-4 border-l-4 border-red-600 bg-cover bg-center shadow-2xl md:mb-8 md:ml-8 md:border-b-8 md:border-l-8"
                style={{ backgroundImage: `url(${IMAGENES.clubVida})` }}
              />
              <div className="absolute top-0 right-0 h-full w-full bg-zinc-800" />
            </div>
          </div>
        </div>
      </section>

      {/* ACTUALIDAD */}
      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 h-1.5 w-12 bg-red-600" />
              <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 md:text-5xl">
                Actualidad
              </h2>
            </div>

            <Link
              href="/noticias"
              className="flex items-center text-xs font-bold uppercase tracking-widest text-red-600"
            >
              Ver Todo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {noticias.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map((news) => (
                <Link
                  href={`/noticias/${news.id}`}
                  key={news.id}
                  className="group flex h-full flex-col border-b-4 border-transparent bg-white p-4 shadow-sm transition-shadow hover:border-red-600 hover:shadow-xl"
                >
                  <div className="relative mb-6 aspect-video w-full overflow-hidden bg-zinc-200">
                    <img
                      src={news.imagen_url || "/images/fondo.jpg"}
                      alt={news.titulo || "Noticia de Huazihul"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <Badge className="mb-4 w-fit rounded-none border border-red-600 bg-transparent text-[9px] uppercase text-red-600">
                    {news.etiqueta ?? "Novedad"}
                  </Badge>

                  <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-zinc-900 group-hover:text-red-600">
                    {news.titulo}
                  </h3>

                  <p className="mb-5 line-clamp-2 text-xs font-light text-zinc-600">
                    {news.descripcion}
                  </p>

                  <span className="mt-auto flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-900 transition-transform group-hover:translate-x-2">
                    Leer más
                    <ArrowRight className="ml-2 h-4 w-4 text-red-600" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-200 py-20 text-center text-sm font-black uppercase tracking-widest text-zinc-300">
              Próximamente novedades.
            </div>
          )}
        </div>
      </section>

      {/* CENTENARIO & PORTAL */}
      <section className="flex flex-col bg-zinc-900 lg:flex-row">
        <div className="relative flex min-h-[400px] flex-col justify-center overflow-hidden border-b-8 border-amber-600 bg-black p-8 md:p-16 lg:w-1/2 lg:border-r-8 lg:border-b-0 lg:p-20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
            style={{ backgroundImage: `url(${IMAGENES.centenario})` }}
          />

          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
              Camino al <span className="text-amber-500">Centenario</span>
            </h2>

            <div className="origin-left my-8 scale-90 sm:scale-100">
              <Countdown />
            </div>

            <Button
              asChild
              className="h-14 w-full rounded-none bg-amber-600 px-8 font-bold uppercase tracking-widest text-white hover:bg-amber-700 sm:w-auto"
            >
              <Link href="/centenario">Nuestra Historia</Link>
            </Button>
          </div>
        </div>

        <div className="flex min-h-[400px] flex-col justify-center bg-zinc-900 p-8 text-center lg:w-1/2 lg:p-20 lg:text-left md:p-16">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
            Portal <br />
            <span className="text-red-600">Autogestión</span>
          </h2>

          <p className="mx-auto mb-8 max-w-sm font-light italic text-zinc-500 lg:mx-0">
            Acceso exclusivo para administradores del club.
          </p>

          <Button
            variant="outline"
            asChild
            className="h-14 w-full rounded-none border-white bg-transparent px-8 font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black sm:w-auto"
          >
            <Link href="/admin">Ingresar al Panel</Link>
          </Button>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="border-t border-zinc-100 bg-white py-20">
        <div className="mx-auto w-full max-w-[1440px] px-4 text-center">
          <h4 className="mb-12 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Sponsors Oficiales que apoyan el club
          </h4>

          <div className="flex flex-wrap items-center justify-center gap-10 opacity-30 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0 md:gap-20">
            {sponsorsOficiales.map((sponsor) => (
              <span
                key={sponsor.id}
                className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 md:text-3xl"
              >
                {sponsor.nombre}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}