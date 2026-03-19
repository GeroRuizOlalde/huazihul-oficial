import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
 
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
 
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
 
  // 1. Obtener sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
 
  if (!isAdminRoute) {
    return supabaseResponse;
  }
 
  // 2. Sin sesión → dejar que el admin layout muestre el formulario de login
  if (!user) {
    return supabaseResponse;
  }
 
  // 3. Con sesión → verificar que el usuario tenga rol 'admin' en profiles
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
 
  // Si hay error al leer el perfil o el rol no es admin → redirigir al inicio
  if (error || !profile || profile.role !== "admin") {
    // Cerrar la sesión para que no quede un usuario logueado sin acceso
    await supabase.auth.signOut();
 
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("acceso", "denegado");
 
    return NextResponse.redirect(redirectUrl);
  }
 
  // 4. Usuario autenticado con rol admin → acceso permitido
  return supabaseResponse;
}
 
export const config = {
  matcher: ["/admin/:path*"],
};