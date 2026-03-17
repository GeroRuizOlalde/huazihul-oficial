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
  Users // <--- Agregamos este ícono
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

  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
        <Card className="w-full max-w-md shadow-xl border-zinc-200 bg-white">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20 mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
              Acceso <span className="text-red-600">Restringido</span>
            </CardTitle>
            <p className="text-sm font-light text-zinc-500 mt-2">
              Portal exclusivo para la administración de Huazihul.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-600 text-sm text-red-600 font-medium">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Institucional</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@huazihul.com" 
                    className="pl-10 border-zinc-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Contraseña</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 border-zinc-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white uppercase font-bold tracking-widest py-6 rounded-xl transition-all" disabled={isLoggingIn}>
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
              </Button>
            </form>
            <div className="mt-8 text-center">
              <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">
                &larr; Volver al sitio público
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-red-600 selection:text-white">
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:flex z-10">
        <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-600/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-black uppercase tracking-tighter text-zinc-900">
            Huazihul<span className="text-red-600">Admin</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Menú Principal</div>
          
          <Link href="/admin" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${pathname === '/admin' ? 'bg-red-50 text-red-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-red-600'}`}>
            <LayoutDashboard className="h-4 w-4" /> Tablero
          </Link>

          <Link href="/admin/socios" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${pathname?.includes('/admin/socios') ? 'bg-red-50 text-red-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-red-600'}`}>
            <Users className="h-4 w-4" /> Socios
          </Link>

          <Link href="/admin/noticias" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${pathname?.includes('/admin/noticias') ? 'bg-red-50 text-red-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-red-600'}`}>
            <Newspaper className="h-4 w-4" /> Noticias
          </Link>

          <Link href="/admin/partidos" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${pathname?.includes('/admin/partidos') ? 'bg-red-50 text-red-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-red-600'}`}>
            <Trophy className="h-4 w-4" /> Partidos
          </Link>

          <Link href="/admin/galeria" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${pathname?.includes('/admin/galeria') ? 'bg-red-50 text-red-600' : 'text-zinc-600 hover:bg-zinc-50 hover:text-red-600'}`}>
            <Camera className="h-4 w-4" /> Galería
          </Link>
        </nav>

        <div className="border-t border-zinc-100 p-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition-all hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white p-4 shadow-sm md:hidden">
          <span className="font-black uppercase tracking-tighter text-zinc-900">
            Huazihul<span className="text-red-600">Admin</span>
          </span>
          <button onClick={handleLogout} className="text-[10px] font-bold uppercase text-red-600">Salir</button>
        </div>
        
        <div className="flex-1 p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}