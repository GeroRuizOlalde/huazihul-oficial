import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* flex-col + min-h-screen: Obliga al footer a irse al fondo.
       w-full + overflow-x-hidden: Evita desplazamientos horizontales y asegura el 100% de ancho.
    */
    <div className="flex min-h-screen flex-col bg-white w-full overflow-x-hidden">
      
      {/* Navbar: Se mantiene arriba */}
      <Navbar />
      
      {/* Main: flex-1 hace que ocupe todo el espacio disponible.
          w-full asegura que el contenido no se achique.
      */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer: Al estar fuera del 'main' y dentro del div 'w-full', 
          su fondo (bg-zinc-950) cubrirá toda la pantalla de lado a lado.
      */}
      <Footer />
      
    </div>
  );
}