/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#384B70',    // Azul oscuro principal
        secondary: '#507687',  // Azul grisáceo
        background: '#FCFAEE', // Crema/beige claro
        accent: '#B8001F',     // Rojo para acciones importantes
      },
    },
  },
  plugins: [],
}