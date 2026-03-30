"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Camera,
  LogOut,
  ShieldCheck,
  Trophy,
  Mail,
  Key,
  Loader2,
  Users,
  MessageSquare,
  ClipboardList,
  ShoppingBag, // Importamos el ícono para la tienda
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
  const [inscripcionesPendientes, setInscripcionesPendientes] = useState(0);

  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        fetchBadges();
      }
      setIsLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setIsAuthenticated(!!session);
      if (session) fetchBadges();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchBadges = async () => {
    try {
      const [{ count: noLeidos }, { count: pendientes }] = await Promise.all([
        supabase
          .from("mensajes_contacto")
          .select("*", { count: "exact", head: true })
          .eq("leido", false),
        supabase
          .from("inscripciones_prueba")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente"),
      ]);
      setMensajesNoLeidos(noLeidos ?? 0);
      setInscripcionesPendientes(pendientes ?? 0);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoginError("Credenciales incorrectas. Verificá tu email y contraseña.");
    } else {
      setIsAuthenticated(true);
      router.push("/admin");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4 font-sans selection:bg-red-600 selection:text-white">
        <Card className="w-full max-w-md shadow-xl border-zinc-200 bg-white rounded-none border-t-4 border-t-red-600">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-none bg-zinc-950 text-white shadow-lg mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-zinc-900 italic">
              Acceso <span className="text-red-600">Restringido.</span>
            </CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2">
              Portal exclusivo para la administración de Huazihul.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-600 font-bold uppercase tracking-tight">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Email Institucional
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@huazihul.com"
                    className="pl-10 rounded-none border-zinc-200 focus:border-red-600 focus:ring-0 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Contraseña
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 rounded-none border-zinc-200 focus:border-red-600 focus:ring-0 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-zinc-950 hover:bg-red-600 text-white uppercase font-black tracking-[0.2em] text-[10px] py-7 rounded-none transition-all"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ingresar al Sistema"}
              </Button>
            </form>
            <div className="mt-8 text-center border-t border-zinc-100 pt-6">
              <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">
                &larr; Volver al sitio público
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navItem = (
    href: string,
    icon: React.ReactNode,
    label: string,
    badge?: number
  ) => {
    const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex items-center justify-between gap-3 rounded-none px-4 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all ${
          active 
            ? "bg-zinc-950 text-white shadow-lg shadow-black/10" 
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 border-b border-transparent"
        }`}
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        {badge && badge > 0 ? (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-none bg-red-600 px-1.5 text-[9px] font-black text-white">
            {badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-red-600 selection:text-white">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden w-72 flex-col border-r border-zinc-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:flex z-10">
        <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-red-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter text-zinc-950">
            Huazihul<span className="text-red-600">Admin.</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-0">
          <div className="mt-8 mb-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
            Navegación
          </div>
          {navItem("/admin", <LayoutDashboard className="h-4 w-4" />, "Tablero")}
          {navItem("/admin/tienda", <ShoppingBag className="h-4 w-4" />, "Tienda Oficial")}
          {navItem("/admin/noticias", <Newspaper className="h-4 w-4" />, "Noticias")}
          {navItem("/admin/socios", <Users className="h-4 w-4" />, "Socios")}
          {navItem("/admin/partidos", <Trophy className="h-4 w-4" />, "Partidos")}
          {navItem("/admin/galeria", <Camera className="h-4 w-4" />, "Galería")}
          
          <div className="mt-8 mb-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
            Interacciones
          </div>
          {navItem("/admin/mensajes", <MessageSquare className="h-4 w-4" />, "Mensajes", mensajesNoLeidos)}
          {navItem("/admin/inscripciones", <ClipboardList className="h-4 w-4" />, "Clases de Prueba", inscripcionesPendientes)}
        </nav>

        <div className="border-t border-zinc-100 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 rounded-none border border-zinc-200 px-3 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-950 hover:text-white hover:border-zinc-950"
          >
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* HEADER MOBILE */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white p-6 shadow-sm md:hidden">
          <span className="font-black uppercase italic tracking-tighter text-zinc-950">
            Huazihul<span className="text-red-600">Admin.</span>
          </span>
          <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-red-600">
            Salir
          </button>
        </div>
        
        <div className="flex-1 p-6 md:p-12 lg:p-16 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}