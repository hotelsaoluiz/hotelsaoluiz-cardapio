/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapping tokens for ease of use in Admin panel
        navy: {
          dark: "var(--navy-dark)",
          DEFAULT: "var(--navy)",
          mid: "var(--navy-mid)",
          light: "var(--navy-light)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          pale: "var(--gold-pale)",
        },
        ivory: "var(--ivory)",
        bgcard: "var(--bg-card)",
        surface: "var(--bg-surface)",
        bronze: "var(--bronze)",
      },
      fontFamily: {
        display: "var(--font-display)",
        ui: "var(--font-ui)",
      },
      borderRadius: {
        menu: "var(--radius-menu)",
        admin: "var(--radius-admin)",
      },
      transitionProperty: {
        'allowed': 'opacity, border-color, background-color',
      }
    },
  },
  plugins: [],
}
