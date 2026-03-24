/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "#d97706",        // or-600 (jaune or riche)
          foreground: "#ffffff",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },

        secondary: {
          DEFAULT: "#374151",        // gray-700 (gris neutre foncé)
          foreground: "#f9fafb",
        },

        accent: {
          DEFAULT: "#eab308",        // yellow-500 (or clair pour accents)
          foreground: "#1f2937",
        },

        background: {
          DEFAULT: "#f8f7f4",        // neutral-light chaleureux
          dark: "#111827",           // gris foncé neutre pour dark mode
        },

        foreground: {
          DEFAULT: "#1f2937",        // gray-800
          dark: "#f3f4f6",
        },

        card: {
          DEFAULT: "#ffffff",
          dark: "#1f2937",
        },
        "card-foreground": {
          DEFAULT: "#1f2937",
          dark: "#f3f4f6",
        },

        popover: {
          DEFAULT: "#ffffff",
          dark: "#1f2937",
        },
        "popover-foreground": {
          DEFAULT: "#1f2937",
          dark: "#f3f4f6",
        },

        muted: {
          DEFAULT: "#f3f4f6",        // neutral-light
          foreground: "#6b7280",     // gray-500
        },
        "muted-foreground": "#9ca3af", // gray-400

        border: "#e5e7eb",           // gray-200
        input: "#e5e7eb",
        ring: "#d97706",             // primary or

        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },

        surface: "#f8f7f4",
        "surface-dark": "#111827",
      },

      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },

      fontFamily: {
        display: ["Rubik", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
}