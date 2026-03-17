import Link from "next/link";
import { ArrowRight, ImagePlus, PenTool, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
          Tablero <span className="text-red-600">General</span>
        </h1>
        <p className="text-zinc-500 font-medium text-sm">
          Bienvenido al portal de gestión de contenidos del Club Huazihul.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Moderar Fotos */}
        <div className="bg-white border border-zinc-200 p-6 shadow-sm flex flex-col h-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldAlert className="w-24 h-24" />
          </div>
          <div className="mb-4">
            <div className="w-10 h-10 bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <ImagePlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-2">Moderar Fotos</h2>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Revisá las fotos que enviaron los socios y aprobalas para que aparezcan en la galería pública.
            </p>
          </div>
          <Link href="/admin/galeria" className="mt-auto pt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700">
            Ir a Moderación <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Tarjeta 2: Redactar Noticia */}
        <div className="bg-white border border-zinc-200 p-6 shadow-sm flex flex-col h-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <PenTool className="w-24 h-24" />
          </div>
          <div className="mb-4">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center text-red-600 mb-4">
              <PenTool className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-2">Nueva Noticia</h2>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Publicá novedades, resultados de partidos o comunicados oficiales en la web del club.
            </p>
          </div>
          <Link href="/admin/noticias/crear" className="mt-auto pt-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800">
            Escribir Artículo <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>
    </div>
  );
}