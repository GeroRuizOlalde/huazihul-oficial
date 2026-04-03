"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Key, Loader2, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AdminLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoginError("Credenciales incorrectas. Verifica tu email y contrasena.");
      setIsLoggingIn(false);
      return;
    }

    router.replace(pathname?.startsWith("/admin") ? pathname : "/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans selection:bg-red-600 selection:text-white">
      <Card className="w-full max-w-md rounded-none border-zinc-200 border-t-4 border-t-red-600 bg-white shadow-xl">
        <CardHeader className="pb-8 pt-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-zinc-950 text-white shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter text-zinc-900 italic">
            Acceso <span className="text-red-600">Restringido.</span>
          </CardTitle>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Portal exclusivo para la administracion de Huazihul.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError ? (
              <div className="border-l-4 border-red-600 bg-red-50 p-3 text-xs font-bold uppercase tracking-tight text-red-600">
                {loginError}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
              >
                Email Institucional
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@huazihul.com"
                  className="rounded-none border-zinc-200 pl-10 transition-all focus:border-red-600 focus:ring-0"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
              >
                Contrasena
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="admin-password"
                  type="password"
                  className="rounded-none border-zinc-200 pl-10 transition-all focus:border-red-600 focus:ring-0"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-none bg-zinc-950 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-red-600"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Ingresar al Sistema"
              )}
            </Button>
          </form>

          <div className="mt-8 border-t border-zinc-100 pt-6 text-center">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-red-600"
            >
              &larr; Volver al sitio publico
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
