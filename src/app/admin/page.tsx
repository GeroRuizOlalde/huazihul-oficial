import Link from "next/link";
import { ArrowRight, ImagePlus, PenTool, ShieldAlert, LucideIcon } from "lucide-react";

type AdminCard = {
  titulo: string;
  descripcion: string;
  href: string;
  cta: string;
  color: "amber" | "red";
  icono: LucideIcon;
  iconoFondo: LucideIcon;
};

const cards: AdminCard[] = [
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
  {
    titulo: "Nueva Noticia",
    descripcion:
      "Publicá novedades, resultados de partidos o comunicados oficiales en la web del club.",
    href: "/admin/noticias/crear",
    cta: "Escribir Artículo",
    color: "red",
    icono: PenTool,
    iconoFondo: PenTool,
  },
];

const colorClasses = {
  amber: {
    box: "bg-amber-100 text-amber-600",
    text: "text-amber-600 hover:text-amber-700",
  },
  red: {
    box: "bg-red-100 text-red-600",
    text: "text-red-600 hover:text-red-800",
  },
};

export default function AdminDashboard() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter text-zinc-900 md:text-5xl">
          Tablero <span className="text-red-600">General</span>
        </h1>
        <p className="text-sm font-medium text-zinc-500">
          Bienvenido al portal de gestión de contenidos del Club Huazihul.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {cards.map((card) => {
          const Icono = card.icono;
          const IconoFondo = card.iconoFondo;
          const colors = colorClasses[card.color];

          return (
            <div
              key={card.href}
              className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                <IconoFondo className="h-24 w-24" />
              </div>

              <div className="mb-4">
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${colors.box}`}
                >
                  <Icono className="h-5 w-5" />
                </div>

                <h2 className="mb-2 text-xl font-black uppercase tracking-tight text-zinc-900">
                  {card.titulo}
                </h2>

                <p className="text-xs font-light leading-relaxed text-zinc-500">
                  {card.descripcion}
                </p>
              </div>

              <Link
                href={card.href}
                className={`mt-auto flex items-center pt-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${colors.text}`}
              >
                {card.cta}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}