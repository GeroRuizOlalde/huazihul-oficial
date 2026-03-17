"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = usePathname();

  const cerrarMenu = () => setMenuAbierto(false);

  const isInicio = pathname === "/";
  const isNoticias =
    pathname === "/noticias" || pathname.startsWith("/noticias/");
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

  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-zinc-800 bg-black text-white shadow-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 md:px-8">
        {/* LOGO */}
        <Link
          href="/"
          onClick={cerrarMenu}
          className="group z-[120] flex items-center gap-3"
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
            <span className="mt-1 text-[8px] font-bold uppercase leading-none tracking-[0.4em] text-zinc-500">
              San Juan
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden h-full items-center gap-10 lg:flex">
          <Link
            href="/"
            className={cn(
              "text-[12px] font-black uppercase tracking-[0.18em] transition-colors hover:text-red-600",
              isInicio ? "text-red-600" : "text-zinc-400"
            )}
          >
            Inicio
          </Link>

          {/* EL CLUB */}
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
              <Link
                href="/el-club"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Historia
              </Link>
              <Link
                href="/centenario"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Centenario
              </Link>
              <Link
                href="/galeria"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Galería
              </Link>
              <Link
                href="/sponsors"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Sponsors
              </Link>
              <Link
                href="/contacto"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* DEPORTES */}
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
              <Link
                href="/deportes"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Portal Deportes
              </Link>
              <Link
                href="/deportes/rugby"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Rugby
              </Link>
              <Link
                href="/deportes/hockey"
                className="block border-l-2 border-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all hover:border-red-600 hover:bg-zinc-900 hover:text-white"
              >
                Hockey
              </Link>
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
        </div>

        {/* ACCIONES */}
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

      {/* MENÚ MÓVIL */}
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
              className="border-b border-zinc-900 pb-4 text-4xl font-black uppercase italic tracking-tighter text-white"
            >
              Inicio
            </Link>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase italic tracking-widest text-red-600">
                El Club
              </span>

              <div className="flex flex-col gap-6 border-l border-zinc-800 pl-4">
                <Link
                  href="/el-club"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Historia
                </Link>
                <Link
                  href="/centenario"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Centenario
                </Link>
                <Link
                  href="/galeria"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Galería
                </Link>
                <Link
                  href="/sponsors"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Sponsors
                </Link>
                <Link
                  href="/contacto"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Contacto
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase italic tracking-widest text-red-600">
                Deportes
              </span>

              <div className="flex flex-col gap-6 border-l border-zinc-800 pl-4">
                <Link
                  href="/deportes"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Portal Deportes
                </Link>
                <Link
                  href="/deportes/rugby"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Rugby
                </Link>
                <Link
                  href="/deportes/hockey"
                  onClick={cerrarMenu}
                  className="text-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
                >
                  Hockey
                </Link>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/noticias"
                onClick={cerrarMenu}
                className="text-2xl font-black uppercase tracking-widest text-white"
              >
                Noticias
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-8">
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