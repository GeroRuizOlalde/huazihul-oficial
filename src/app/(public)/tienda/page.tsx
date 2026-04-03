import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";

import { TiendaCatalogo, type Producto } from "@/components/tienda/TiendaCatalogo";
import { Badge } from "@/components/ui/badge";
import { supabasePublic } from "@/lib/supabase/public";

export const revalidate = 60;

export const metadata = {
  title: "Boutique Oficial | Huazihul",
  description:
    "Indumentaria oficial del Club Huazihul. Consulta stock y coordina tu compra por WhatsApp.",
};

const WHATSAPP_CLUB = "5492645771409";

export default async function TiendaPage() {
  const { data, error } = await supabasePublic
    .from("productos")
    .select("id, nombre, descripcion, precio, imagen_url, categoria, en_stock")
    .eq("en_stock", true)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error cargando productos:", error);
  }

  const productos: Producto[] = data ?? [];
  const categoriasActivas = new Set(productos.map((producto) => producto.categoria)).size;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden bg-zinc-950 px-6 pb-16 pt-32 text-white md:px-8 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <Badge className="mb-6 rounded-none border-none bg-red-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              Boutique Oficial
            </Badge>

            <h1 className="max-w-4xl text-5xl font-black uppercase italic leading-[0.88] tracking-tighter text-white md:text-7xl lg:text-[5.5rem]">
              Vesti la <span className="text-red-600">mistica</span> del club.
            </h1>

            <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-zinc-300 md:text-xl">
              Un catalogo pensado para que encontrar una prenda sea tan simple como
              verla, enamorarte y consultarla. Stock oficial, atencion directa y
              coordinacion por WhatsApp con el club.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_CLUB}?text=${encodeURIComponent(
                  "Hola! Quiero consultar por la boutique oficial de Huazihul."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-14 items-center justify-center rounded-full bg-red-600 px-8 text-xs font-black uppercase tracking-[0.24em] text-white shadow-xl shadow-red-600/20 transition-all hover:bg-white hover:text-zinc-950"
              >
                Hablar por WhatsApp
                <MessageCircle className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                href="#catalogo"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-xs font-black uppercase tracking-[0.24em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-zinc-950"
              >
                Ver catalogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Stock Activo
              </p>
              <p className="mt-3 text-4xl font-black tracking-tighter text-white">
                {productos.length}
              </p>
              <p className="mt-2 text-sm font-light text-zinc-400">
                Productos visibles y listos para consultar.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Lineas
              </p>
              <p className="mt-3 text-4xl font-black tracking-tighter text-white">
                {categoriasActivas || 0}
              </p>
              <p className="mt-2 text-sm font-light text-zinc-400">
                Rugby, hockey, accesorios y mas.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                  Compra Guiada
                </p>
              </div>
              <p className="mt-3 text-lg font-black uppercase tracking-tight text-white">
                Sin vueltas.
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-zinc-400">
                Cada producto tiene acceso directo a consulta y coordinacion con el club.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-white px-6 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-zinc-900">
            <Sparkles className="h-4 w-4 text-red-600" />
            <p className="text-xs font-black uppercase tracking-[0.28em]">
              Seleccion oficial Huazihul
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-red-600" />
              Consulta inmediata
            </span>
            <span className="hidden h-4 w-px bg-zinc-200 md:block" />
            <span>Coordinacion por WhatsApp</span>
            <span className="hidden h-4 w-px bg-zinc-200 md:block" />
            <span>Stock sujeto a disponibilidad</span>
          </div>
        </div>
      </section>

      <TiendaCatalogo productos={productos} whatsappNumber={WHATSAPP_CLUB} />

      <section className="border-t border-zinc-100 bg-zinc-50 px-6 py-20 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 rounded-[2.5rem] bg-white p-8 shadow-sm shadow-zinc-200/60 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-red-600">
              Necesitas otra cosa?
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase italic tracking-tighter text-zinc-950 md:text-5xl">
              Tambien armamos pedidos para equipos, talles especiales y consultas
              puntuales.
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-zinc-500 md:text-base">
              Si no ves la prenda que buscabas, escribinos. La idea de esta boutique
              es ayudarte a resolver rapido, no obligarte a adivinar.
            </p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_CLUB}?text=${encodeURIComponent(
              "Hola! Quiero hacer una consulta especial sobre la boutique de Huazihul."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-full bg-zinc-950 px-8 text-xs font-black uppercase tracking-[0.24em] text-white transition-colors hover:bg-red-600"
          >
            Resolver por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
