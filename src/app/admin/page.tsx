import Link from "next/link";
import { 
  ArrowRight, 
  ImagePlus, 
  PenTool, 
  ShieldAlert, 
  ShoppingBag, 
  LucideIcon, 
  Zap 
} from "lucide-react";

import { cn } from "@/lib/utils";

type AdminCard = {
  titulo: string;
  descripcion: string;
  href: string;
  cta: string;
  color: "amber" | "red" | "zinc";
  icono: LucideIcon;
  iconoFondo: LucideIcon;
};

const cards: AdminCard[] = [
  {
    titulo: "Gestión Boutique",
    descripcion:
      "Administrá el catálogo de productos, precios y stock de la tienda oficial del club.",
    href: "/admin/tienda",
    cta: "Administrar Tienda",
    color: "red",
    icono: ShoppingBag,
    iconoFondo: ShoppingBag,
  },
  {
    titulo: "Nueva Noticia",
    descripcion:
      "Publicá novedades, resultados de partidos o comunicados oficiales en la web del club.",
    href: "/admin/noticias/crear",
    cta: "Escribir Artículo",
    color: "zinc",
    icono: PenTool,
    iconoFondo: PenTool,
  },
  {
    titulo: "Moderar Fotos",
    descripcion:
      "Revisá las fotos que enviaron los socios y aprobalas para que aparezcan en la galería pública.",
    href: "/admin/galeria",
    cta: "Ir a Moderación",
    color: "amber",
    icono: ImagePlus,
    iconoFondo: ShieldAlert,
  },
];

const colorClasses = {
  amber: {
    box: "bg-amber-100 text-amber-600",
    text: "text-amber-600 hover:text-amber-700",
    border: "hover:border-amber-500/50",
  },
  red: {
    box: "bg-red-100 text-red-600",
    text: "text-red-600 hover:text-red-800",
    border: "hover:border-red-500/50",
  },
  zinc: {
    box: "bg-zinc-100 text-zinc-900",
    text: "text-zinc-900 hover:text-zinc-700",
    border: "hover:border-zinc-900/50",
  },
};

export default function AdminDashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <header className="mb-12 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-red-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">
            Huazihul Autogestión
          </span>
        </div>
        <h1 className="mb-2 text-4xl font-black uppercase tracking-tighter text-zinc-950 md:text-6xl italic">
          Tablero <span className="text-red-600">General.</span>
        </h1>
        <p className="text-sm font-medium text-zinc-500 max-w-xl">
          Bienvenido al portal de control. Desde acá podés gestionar toda la presencia digital del club de manera centralizada.
        </p>
      </header>

      {/* GRILLA ACTUALIZADA A 3 COLUMNAS */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icono = card.icono;
          const IconoFondo = card.iconoFondo;
          const colors = colorClasses[card.color];

          return (
            <Link
              key={card.href}
              href={card.href}
              className={cn(
                "group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-none border border-zinc-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                colors.border
              )}
            >
              {/* ICONO DE FONDO GIGANTE */}
              <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] transition-all duration-500 group-hover:opacity-[0.07] group-hover:scale-110">
                <IconoFondo className="h-40 w-40" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div
                  className={cn(
                    "mb-8 flex h-12 w-12 items-center justify-center rounded-none shadow-sm transition-transform group-hover:scale-110",
                    colors.box
                  )}
                >
                  <Icono className="h-6 w-6" />
                </div>

                <h2 className="mb-4 text-2xl font-black uppercase tracking-tighter text-zinc-950 italic">
                  {card.titulo}
                </h2>

                <p className="mb-8 text-sm font-medium leading-relaxed text-zinc-500">
                  {card.descripcion}
                </p>

                <div
                  className={cn(
                    "mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                    colors.text
                  )}
                >
                  {card.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>

              {/* BARRA INFERIOR DE COLOR */}
              <div className={cn(
                "absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full",
                card.color === "red" ? "bg-red-600" : card.color === "amber" ? "bg-amber-500" : "bg-zinc-950"
              )} />
            </Link>
          );
        })}
      </div>

      {/* FOOTER DEL ADMIN */}
      <footer className="mt-20 border-t border-zinc-100 pt-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
          Desarrollado por Riva Estudio — 2026
        </p>
      </footer>
    </div>
  );
}