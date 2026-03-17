"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = usePathname();

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md text-white shadow-xl">
      {/* Ajuste móvil: px-4 en lugar de px-6 para dar más aire a los costados */}
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        
        {/* LOGO */}
        <Link 
          href="/" 
          onClick={cerrarMenu} 
          className="flex items-center gap-2 md:gap-3 group z-[60]"
        >
          <img 
            src="/images/logohuazi.png" 
            alt="Escudo Huazihul" 
            className="w-9 h-9 md:w-12 md:h-12 object-contain group-hover:rotate-6 transition-transform duration-300" 
          />
          <div className="flex flex-col">
            {/* Ajuste móvil: text-lg en celu, text-2xl en desktop */}
            <span className="font-black uppercase tracking-tighter text-lg md:text-2xl leading-none group-hover:text-red-600 transition-colors">
              Huazihul
            </span>
            <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-500 leading-none mt-1">
              San Juan
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          <Link 
            href="/" 
            className={cn("text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-red-600", 
              pathname === "/" ? "text-red-600" : "text-zinc-400")}
          >
            Inicio
          </Link>

          {/* DESPLEGABLE: EL CLUB */}
          <div className="group relative flex h-full items-center cursor-pointer">
            <button className={cn("flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.2em] transition-colors group-hover:text-red-600", 
              ["/el-club", "/centenario", "/galeria", "/sponsors", "/contacto"].includes(pathname) ? "text-red-600" : "text-zinc-400"
            )}>
              El Club <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            
            <div className="absolute left-[-20px] top-[100%] hidden w-56 bg-zinc-950 border-x border-b border-zinc-800 p-2 shadow-2xl group-hover:block animate-in fade-in slide-in-from-top-2">
              <Link href="/el-club" className="block p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent hover:border-red-600 transition-all">Historia</Link>
              <Link href="/centenario" className="block p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent hover:border-red-600 transition-all">Centenario</Link>
              <Link href="/galeria" className="block p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent hover:border-red-600 transition-all">Galería</Link>
              <Link href="/sponsors" className="block p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent hover:border-red-600 transition-all">Sponsors</Link>
              <Link href="/contacto" className="block p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent hover:border-red-600 transition-all">Contacto</Link>
            </div>
          </div>

          {/* DESPLEGABLE: DEPORTES */}
          <div className="group relative flex h-full items-center cursor-pointer">
            <button className={cn("flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.2em] transition-colors group-hover:text-red-600", 
              pathname.includes("/deportes") ? "text-red-600" : "text-zinc-400"
            )}>
              Deportes <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-[-20px] top-[100%] hidden w-48 bg-zinc-950 border-x border-b border-zinc-800 p-2 shadow-2xl group-hover:block animate-in fade-in slide-in-from-top-2">
              <Link href="/deportes/rugby" className="block p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent hover:border-red-600 transition-all">Rugby</Link>
              <Link href="/deportes/hockey" className="block p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent hover:border-red-600 transition-all">Hockey</Link>
            </div>
          </div>

          <Link 
            href="/noticias" 
            className={cn("text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-red-600", pathname === "/noticias" ? "text-red-600" : "text-zinc-400")}
          >
            Noticias
          </Link>
        </div>

        {/* ACCIONES FINAL NAVBAR */}
        <div className="flex items-center gap-4">
          <Button 
            asChild
            className="hidden md:flex bg-red-600 hover:bg-white hover:text-black text-white rounded-none font-black uppercase tracking-[0.2em] text-[10px] px-8 h-11 transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            <Link href="/socios">Hacete Socio</Link>
          </Button>

          {/* BOTÓN HAMBURGUESA */}
          <button 
            className="lg:hidden text-white p-2 hover:bg-zinc-900 rounded-lg transition-colors z-[60]" 
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {/* Ajuste móvil: Iconos un poco más chicos (w-7) para que no se vean toscos */}
            {menuAbierto ? <X className="w-7 h-7 text-red-600" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-0 z-[55] w-full bg-zinc-950/98 backdrop-blur-xl transition-all duration-500 ease-in-out",
        menuAbierto ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <div className="flex flex-col p-8 pt-24 space-y-8 h-full overflow-y-auto">
          <Link href="/" onClick={cerrarMenu} className="font-black uppercase tracking-widest text-4xl text-white border-b border-zinc-900 pb-4">Inicio</Link>
          
          <div className="space-y-4">
            <span className="font-black uppercase tracking-widest text-[10px] text-red-600">Institucional</span>
            <div className="flex flex-col gap-6 pl-4 border-l border-zinc-800">
              {/* CORRECCIÓN: Se agregó onClick={cerrarMenu} a todos los links */}
              <Link href="/el-club" onClick={cerrarMenu} className="font-bold uppercase tracking-widest text-xl text-zinc-300">Historia</Link>
              <Link href="/centenario" onClick={cerrarMenu} className="font-bold uppercase tracking-widest text-xl text-zinc-300">Centenario</Link>
              <Link href="/sponsors" onClick={cerrarMenu} className="font-bold uppercase tracking-widest text-xl text-zinc-300">Sponsors</Link>
              <Link href="/contacto" onClick={cerrarMenu} className="font-bold uppercase tracking-widest text-xl text-zinc-300">Contacto</Link>
            </div>
          </div>

          <div className="space-y-4">
            <span className="font-black uppercase tracking-widest text-[10px] text-red-600">Deportes</span>
            <div className="flex flex-col gap-6 pl-4 border-l border-zinc-800">
              <Link href="/deportes/rugby" onClick={cerrarMenu} className="font-bold uppercase tracking-widest text-xl text-zinc-300">Rugby</Link>
              <Link href="/deportes/hockey" onClick={cerrarMenu} className="font-bold uppercase tracking-widest text-xl text-zinc-300">Hockey</Link>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900">
            <Button asChild className="w-full bg-red-600 hover:bg-white hover:text-black text-white rounded-none font-black uppercase tracking-widest h-16 text-sm shadow-xl shadow-red-600/30 transition-all">
              <Link href="/socios" onClick={cerrarMenu}>Hacete Socio</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}