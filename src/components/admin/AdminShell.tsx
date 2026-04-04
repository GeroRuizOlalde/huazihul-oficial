"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Camera,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Newspaper,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type AdminShellProps = {
  children: React.ReactNode;
};

type BadgeCounts = {
  mensajes: number;
  inscripciones: number;
  aspirantes: number;
  galeria: number;
};

type NavItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
};

const BADGE_POLL_INTERVAL_MS = 20000;
const BADGE_REFRESH_DEBOUNCE_MS = 400;

export function AdminShell({ children }: AdminShellProps) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const pathname = usePathname();

  const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>({
    mensajes: 0,
    inscripciones: 0,
    aspirantes: 0,
    galeria: 0,
  });
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

    const syncBadges = async () => {
      const [
        { count: mensajes },
        { count: inscripciones },
        { count: aspirantes },
        { count: galeria },
      ] = await Promise.all([
        supabase
          .from("mensajes_contacto")
          .select("*", { count: "exact", head: true })
          .eq("leido", false),
        supabase
          .from("inscripciones_prueba")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente"),
        supabase
          .from("socios_aspirantes")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("galeria")
          .select("*", { count: "exact", head: true })
          .eq("aprobado", false),
      ]);

      if (!active) {
        return;
      }

      setBadgeCounts({
        mensajes: mensajes ?? 0,
        inscripciones: inscripciones ?? 0,
        aspirantes: aspirantes ?? 0,
        galeria: galeria ?? 0,
      });
    };

    const scheduleSync = () => {
      if (refreshTimeout) {
        return;
      }

      refreshTimeout = setTimeout(() => {
        refreshTimeout = null;
        void syncBadges();
      }, BADGE_REFRESH_DEBOUNCE_MS);
    };

    void syncBadges();

    const intervalId = setInterval(() => {
      void syncBadges();
    }, BADGE_POLL_INTERVAL_MS);

    const channel = supabase
      .channel("admin-sidebar-badges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mensajes_contacto" },
        scheduleSync
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inscripciones_prueba" },
        scheduleSync
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "socios_aspirantes" },
        scheduleSync
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "galeria" },
        scheduleSync
      )
      .subscribe();

    return () => {
      active = false;
      clearInterval(intervalId);

      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }

      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  const solicitudesPendientes =
    badgeCounts.aspirantes + badgeCounts.galeria + badgeCounts.inscripciones;

  const items: NavItem[] = [
    {
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
      label: "Tablero",
    },
    {
      href: "/admin/tienda",
      icon: <ShoppingBag className="h-4 w-4 shrink-0" />,
      label: "Tienda Oficial",
    },
    {
      href: "/admin/noticias",
      icon: <Newspaper className="h-4 w-4 shrink-0" />,
      label: "Noticias",
    },
    {
      href: "/admin/socios",
      icon: <Users className="h-4 w-4 shrink-0" />,
      label: "Socios",
      badge: badgeCounts.aspirantes,
    },
    {
      href: "/admin/partidos",
      icon: <Trophy className="h-4 w-4 shrink-0" />,
      label: "Partidos",
    },
    {
      href: "/admin/galeria",
      icon: <Camera className="h-4 w-4 shrink-0" />,
      label: "Galeria",
      badge: badgeCounts.galeria,
    },
    {
      href: "/admin/mensajes",
      icon: <MessageSquare className="h-4 w-4 shrink-0" />,
      label: "Mensajes",
      badge: badgeCounts.mensajes,
    },
    {
      href: "/admin/inscripciones",
      icon: <ClipboardList className="h-4 w-4 shrink-0" />,
      label: "Clases de Prueba",
      badge: badgeCounts.inscripciones,
    },
  ];

  const desktopLabelClass =
    "max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-200 group-hover/sidebar:max-w-[180px] group-hover/sidebar:opacity-100";

  const navItem = ({ href, icon, label, badge }: NavItem) => {
    const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

    return (
      <Link
        key={href}
        href={href}
        title={label}
        className={`relative flex items-center justify-center gap-3 rounded-none px-3 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 group-hover/sidebar:justify-between group-hover/sidebar:px-4 ${
          active
            ? "bg-zinc-950 text-white shadow-lg shadow-black/10"
            : "border-b border-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          {icon}
          <span className={desktopLabelClass}>{label}</span>
        </span>
        {badge && badge > 0 ? (
          <span className="absolute right-2 top-1/2 flex h-5 min-w-[20px] -translate-y-1/2 items-center justify-center rounded-none bg-red-600 px-1.5 text-[9px] font-black text-white transition-all duration-200 group-hover/sidebar:static group-hover/sidebar:translate-y-0">
            {badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-red-600 selection:text-white">
      <aside className="group/sidebar z-10 hidden w-20 overflow-hidden border-r border-zinc-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-[width] duration-300 ease-out hover:w-72 md:flex md:flex-col">
        <div className="flex items-center justify-center gap-3 border-b border-zinc-100 px-4 py-6 transition-all duration-300 group-hover/sidebar:justify-start group-hover/sidebar:px-6 group-hover/sidebar:py-8">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-red-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span
            className={`text-xl font-black uppercase tracking-tighter text-zinc-950 italic ${desktopLabelClass}`}
          >
            Huazihul<span className="text-red-600">Admin.</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-0">
          <div className="mt-6 px-3 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 opacity-0 transition-[opacity,padding,margin] duration-200 group-hover/sidebar:mb-4 group-hover/sidebar:mt-8 group-hover/sidebar:px-6 group-hover/sidebar:text-left group-hover/sidebar:opacity-100">
            Navegacion
          </div>
          {items.slice(0, 6).map(navItem)}

          <div className="mt-6 flex items-center justify-center px-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 opacity-0 transition-[opacity,padding,margin] duration-200 group-hover/sidebar:mb-4 group-hover/sidebar:mt-8 group-hover/sidebar:justify-between group-hover/sidebar:px-6 group-hover/sidebar:opacity-100">
            <span className={desktopLabelClass}>Interacciones</span>
            {solicitudesPendientes > 0 ? (
              <span className="rounded-none bg-red-600 px-2 py-1 text-[9px] text-white">
                {solicitudesPendientes}
              </span>
            ) : null}
          </div>
          {items.slice(6).map(navItem)}
        </nav>

        <div className="border-t border-zinc-100 p-4 transition-all duration-300 group-hover/sidebar:p-6">
          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            title="Cerrar sesion"
            className="flex w-full items-center justify-center gap-3 rounded-none border border-zinc-200 px-3 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            <span className={desktopLabelClass}>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="border-b border-zinc-200 bg-white shadow-sm md:hidden">
          <div className="flex items-center justify-between p-6">
            <span className="font-black uppercase tracking-tighter text-zinc-950 italic">
              Huazihul<span className="text-red-600">Admin.</span>
            </span>
            <button
              onClick={handleLogout}
              disabled={isSigningOut}
              className="text-[10px] font-black uppercase tracking-widest text-red-600 disabled:opacity-60"
            >
              {isSigningOut ? "Saliendo..." : "Salir"}
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-zinc-100 px-4 py-3">
            {items.map(({ href, label, badge }) => {
              const active =
                href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                    active
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-zinc-200 bg-white text-zinc-500"
                  }`}
                >
                  {label}
                  {badge && badge > 0 ? ` (${badge})` : ""}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="max-w-[1600px] flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
