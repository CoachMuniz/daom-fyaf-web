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
          // Paleta oficial Rediseño Deportivo DAOM
          night: '#020D20',       // Azul noche profundo — fondo principal
          petroleum: '#04172D',   // Azul petróleo oscuro — superficies secundarias
          navy: '#082A50',        // Azul marino — degradados y geometría
          electric: '#00B8F5',    // Azul eléctrico — detalles, íconos y acentos
          textLight: '#C5D3E3',   // Gris azulado claro — textos secundarios
          sportRed: '#F12D43',    // Rojo deportivo — CTA principal
          sportRedHover: '#D91F34',
          
          // Compatibilidad con tokens anteriores
          dark: '#020D20',
          surface: '#04172D',
          surfaceAlt: '#082A50',
          border: '#0d325a',
          primary: '#F12D43',
          primaryHover: '#D91F34',
          accent: '#00B8F5',
          accentHover: '#0090C5',
          gold: '#F5A623',
          text: '#FFFFFF',
          muted: '#C5D3E3',
          dim: '#7E97B3',
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
