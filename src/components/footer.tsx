import Image from "next/image";
import Link from "next/link";
import { 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  ArrowUpRight 
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950 text-white border-t border-zinc-900 pt-20 pb-10 font-sans selection:bg-red-600">
      {/* El mx-auto es CLAVE para que el contenido se centre en pantallas anchas */}
      <div className="container mx-auto px-6 md:px-8">

        {/* --- COLUMNAS PRINCIPALES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* SECCIÓN 1: BRANDING & REDES */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl shadow-xl shadow-red-600/5 p-2 overflow-hidden">
                <Image
                  src="/images/logohuazi.png"
                  alt="Huazihul Escudo"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="block text-3xl font-black uppercase tracking-tighter leading-none italic">
                  Huazihul
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">
                  San Juan Rugby Club
                </span>
              </div>
            </div>
            
            <p className="text-zinc-500 font-light text-lg leading-relaxed max-w-sm">
              Formando el carácter de San Juan desde 1927. El club más histórico de la región, unido por una misma pasión.
            </p>
            
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/clubhuazihul" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all group"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="mailto:contacto@huazihul.com" 
                className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* SECCIÓN 2: DEPORTES */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 italic">Deportes</h4>
            <ul className="space-y-4">
              {[
                { label: 'Rugby', href: '/deportes/rugby' },
                { label: 'Hockey', href: '/deportes/hockey' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest flex items-center group">
                    {item.label} <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECCIÓN 3: INSTITUCIONAL */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 italic">El Club</h4>
            <ul className="space-y-4">
              {[
                { label: 'Historia', href: '/el-club' },
                { label: 'Centenario', href: '/centenario' },
                { label: 'Sponsors', href: '/sponsors' },
                { label: 'Contacto', href: '/contacto' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-zinc-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest flex items-center group">
                    {item.label} <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECCIÓN 4: CONTACTO DIRECTO */}
          <div className="lg:col-span-3 space-y-6 bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800/50">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-red-600 italic">Secretaría</h4>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <MapPin className="text-red-600 w-5 h-5 shrink-0" />
                <p className="text-sm font-bold text-zinc-300 italic leading-tight">
                  Sgto Cabral Oeste 5400, <br/>J5400 Rivadavia, San Juan.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <Phone className="text-red-600 w-5 h-5 shrink-0" />
                <p className="text-sm font-bold text-zinc-300">
                  +54 264 577 1409
                </p>
              </div>
            </div>
            <Link 
              href="/socios" 
              className="block w-full bg-red-600 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-lg shadow-red-600/10"
            >
              Hacete Socio
            </Link>
          </div>
        </div>

        {/* --- BARRA INFERIOR --- */}
        <div className="mt-24 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            © {currentYear} Huazihul San Juan Rugby Club.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Desarrollado por</span>
            <a 
              href="https://rivaestudio.com.ar/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-white uppercase tracking-widest bg-zinc-800 px-3 py-1 rounded-lg italic hover:bg-red-600 transition-colors duration-300 shadow-sm"
            >
              Riva Estudio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
