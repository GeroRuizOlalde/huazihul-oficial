"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = usePathname();

  const cerrarMenu = () => setMenuAbierto(false);

  const isInicio = pathname === "/";
  const isNoticias = pathname === "/noticias" || pathname.startsWith("/noticias/");
  const isFixture = pathname === "/fixture";
  const isTienda = pathname === "/tienda"; 
  
  const isClubRoute = [
    "/el-club",
    "/centenario",
    "/galeria",
    "/sponsors",
    "/contacto",
  ].includes(pathname);

  const isDeportesRoute =
    pathname === "/deportes" ||
    pathname.startsWith("/deportes/rugby") ||
    pathname.startsWith("/deportes/hockey");

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  // Cerrar menú automáticamente al cambiar de ruta
  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-zinc-800 bg-black text-white shadow-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 md:px-8">
        
        {/* LOGO Y TÍTULO (TODO EL BLOQUE VUELVE A HOME) */}
        <Link
          href="/"
          onClick={cerrarMenu}
          className="group z-[120] flex items-center gap-3 cursor-pointer"
        >
          <Image
            src="/images/logohuazi.png"
            alt="Escudo Huazihul"
            width={48}
            height={48}
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:rotate-6 md:h-12 md:w-12"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase italic leading-none tracking-tighter transition-colors group-hover:text-red-600 md:text-2xl">
              Huazihul
            </span>
            <span className="mt-1 text-[8px] font-bold uppercase leading-none tracking-[0.4em] text-zinc-500 transition-colors group-hover:text-zinc-300">
              San Juan
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden h-full items-center gap-8 lg:flex">
          <Link
            href="/"
            className={cn(
              "text-[12px] font-black uppercase tracking-[0.18em] transition-colors hover:text-red-600",
              isInicio ? "text-red-600" : "text-zinc-400"
            )}
          >
            Inicio
          </Link>

          {/* EL CLUB DROPDOWN */}
          <div className="group relative flex h-full items-center">
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 text-[12px] font-black uppercase tracking-[0.18em] transition-colors group-hover:text-red-600",
                isClubRoute ? "text-red-600" : "text-zinc-400"
              )}
            >
              El Club
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 border border-zinc-800 bg-zinc-950 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              {[
                { href: "/el-club", label: "Historia" },
                { href: "/centenario", label: "Centenario" },
                { href: "/galeria", label: "Galería" },
                { href: "/sponsors", label: "Sponsors" },
                { href: "/contacto", label: "Contacto" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* DEPORTES DROPDOWN */}
          <div className="group relative flex h-full items-center">
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 text-[12px] font-black uppercase tracking-[0.18em] transition-colors group-hover:text-red-600",
                isDeportesRoute ? "text-red-600" : "text-zinc-400"
              )}
            >
              Deportes
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 border border-zinc-800 bg-zinc-950 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              {[
                { href: "/deportes", label: "Portal Deportes" },
                { href: "/deportes/rugby", label: "Rugby" },
                { href: "/deportes/hockey", label: "Hockey" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/noticias"
            className={cn(
              "text-[12px] font-black uppercase tracking-[0.18em] transition-colors hover:text-red-600",
              isNoticias ? "text-red-600" : "text-zinc-400"
            )}
          >
            Noticias
          </Link>

          <Link
            href="/fixture"
            className={cn(
              "text-[12px] font-black uppercase tracking-[0.18em] transition-colors hover:text-red-600",
              isFixture ? "text-red-600" : "text-zinc-400"
            )}
          >
            Fixture
          </Link>

          {/* LINK TIENDA DESKTOP */}
          <Link
            href="/tienda"
            className={cn(
              "flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] transition-colors hover:text-red-600",
              isTienda ? "text-red-600" : "text-zinc-400"
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Tienda
          </Link>
        </div>

        {/* ACCIONES (SOCIOS + BURGER) */}
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="hidden lg:block">
            <Button
              asChild
              className="h-11 min-w-[170px] rounded-sm border border-red-600 bg-red-600 px-6 text-[11px] font-black uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-transparent hover:text-red-500"
            >
              <Link href="/socios" className="flex items-center justify-center">
                Hacete Socio
              </Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            className="z-[120] p-2 text-white transition-colors hover:bg-zinc-900 lg:hidden"
            onClick={() => setMenuAbierto((prev) => !prev)}
          >
            {menuAbierto ? (
              <X className="h-8 w-8 text-red-600" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL FULLSCREEN */}
      <div
        className={cn(
          "fixed inset-0 z-[110] flex h-screen w-full flex-col bg-zinc-950 transition-all duration-500 ease-in-out lg:hidden",
          menuAbierto
            ? "translate-y-0 opacity-100"
            : "-translate-y-full pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-8 pb-8 pt-28">
          <div className="space-y-8">
            <Link
              href="/"
              onClick={cerrarMenu}
              className={cn(
                "block border-b border-zinc-900 pb-4 text-4xl font-black uppercase italic tracking-tighter transition-colors",
                isInicio ? "text-red-600" : "text-white"
              )}
            >
              Inicio
            </Link>

            {/* SECCIÓN CLUB MOBILE */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase italic tracking-widest text-red-600">
                El Club
              </span>
              <div className="flex flex-col gap-5 border-l border-zinc-800 pl-4">
                {[
                  { href: "/el-club", label: "Historia" },
                  { href: "/centenario", label: "Centenario" },
                  { href: "/galeria", label: "Galería" },
                  { href: "/sponsors", label: "Sponsors" },
                  { href: "/contacto", label: "Contacto" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={cerrarMenu}
                    className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* SECCIÓN DEPORTES MOBILE */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase italic tracking-widest text-red-600">
                Deportes
              </span>
              <div className="flex flex-col gap-5 border-l border-zinc-800 pl-4">
                {[
                  { href: "/deportes", label: "Portal Deportes" },
                  { href: "/deportes/rugby", label: "Rugby" },
                  { href: "/deportes/hockey", label: "Hockey" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={cerrarMenu}
                    className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* OTROS LINKS MOBILE */}
            <Link
              href="/tienda"
              onClick={cerrarMenu}
              className={cn(
                "block text-2xl font-black uppercase tracking-widest transition-colors",
                isTienda ? "text-red-600" : "text-white"
              )}
            >
              Tienda
            </Link>

            <Link
              href="/noticias"
              onClick={cerrarMenu}
              className={cn(
                "block text-2xl font-black uppercase tracking-widest transition-colors",
                isNoticias ? "text-red-600" : "text-white"
              )}
            >
              Noticias
            </Link>

            <Link
              href="/fixture"
              onClick={cerrarMenu}
              className={cn(
                "block text-2xl font-black uppercase tracking-widest transition-colors",
                isFixture ? "text-red-600" : "text-white"
              )}
            >
              Fixture
            </Link>
          </div>

          {/* BOTÓN HACETE SOCIO MOBILE */}
          <div className="mt-auto pt-10">
            <Button
              asChild
              className="group h-20 w-full rounded-none bg-red-600 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/30 transition-all hover:bg-white hover:text-black"
            >
              <Link
                href="/socios"
                onClick={cerrarMenu}
                className="flex items-center justify-between px-8"
              >
                Hacete Socio
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
