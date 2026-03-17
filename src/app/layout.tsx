import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Configuración de fuentes
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos globales (Lo que aparece en Google y la pestaña)
export const metadata: Metadata = {
  title: "Huazihul San Juan Rugby Club",
  description: "Sitio oficial del club más histórico de San Juan. Rugby, Hockey y familia desde 1927.",
  icons: {
    icon: "/favicon.ico", // Asegurate de tener un favicon en /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}
      >
        {children}
      </body>
    </html>
  );
}