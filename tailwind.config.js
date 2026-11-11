/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0c0f12',     // Fondo principal oscuro ultra legible
          surface: '#151920',  // Superficie de tarjetas / contenedores
          surfaceAlt: '#1c222c',// Superficie elevada / hover
          border: '#2a3240',   // Bordes y separadores sutiles
          primary: '#e63946',  // Rojo enérgico deportivo institucional DAOM
          primaryHover: '#d62828',
          accent: '#457b9d',   // Azul secundario institucional DAOM
          accentHover: '#1d3557',
          gold: '#f4a261',     // Dorado sutil para etiquetas destacadas
          text: '#f1f5f9',     // Texto primario de alto contraste
          muted: '#94a3b8',    // Texto secundario
          dim: '#64748b',      // Texto terciario
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
