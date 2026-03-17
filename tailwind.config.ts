import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  container: {
    center: true,
    padding: "2rem",
  },
      screens: {
        "2xl": "1400px", // Limita el ancho máximo en monitores gigantes
      },
    },
    extend: {
      // ... (acá quedan tus colores y fuentes que ya tenías)
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config