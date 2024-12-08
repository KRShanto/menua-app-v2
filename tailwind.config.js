/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
    },
    extend: {
      fontFamily: {
        cairo: ["Cairo-Regular", "sans-serif"],
      },
      colors: {
        primaryText: "#F2E7D4",
        backgroundColor: "#343436",
        foregroundColor: "#F2E7D4",
      },
    },
  },
  plugins: [],
};
