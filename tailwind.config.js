/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        clinical: {
          ink: "#172033",
          teal: "#0F766E",
          mint: "#DDF7EE",
          amber: "#B45309",
          rose: "#BE123C"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};
