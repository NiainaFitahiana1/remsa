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
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e9590c',       // ton orange terracotta signature
          foreground: '#ffffff',     // texte sur primary → blanc pur
          50:  '#fef5f0',
          100: '#fee8d9',
          200: '#fcd0b3',
          300: '#f9b38c',
          400: '#f69666',
          500: '#e9590c',
          600: '#d14e0b',
          700: '#b03f09',
          800: '#8f3207',
          900: '#752906',
        },

        secondary: {
          DEFAULT: '#1e293b',        // slate-900 / bleu nuit profond (complémentaire élégant)
          foreground: '#f1f5f9',     // texte clair sur fond sombre
        },

        accent: {
          DEFAULT: '#d4a373',        // doré-bronze chaud, très cosy avec l’orange
          foreground: '#1e293b',     // texte sombre dessus
        },

        background: {
          DEFAULT: '#f8f6f5',        // light – ton beige très clair chaud
          dark:  '#221610',          // dark – ton marron presque noir chaleureux
        },

        // Pour les borders, inputs, etc. (variables CSS souvent utilisées par shadcn)
        border: 'hsl(20 14% 90%)',          // light mode → beige clair
        input: 'hsl(20 14% 90%)',
        ring: '#e9590c',                    // focus ring = primary

        foreground: {
          DEFAULT: '#1f1a17',         // texte principal light mode (proche noir chaud)
          dark:   '#f5f0ed',          // texte principal dark mode (proche blanc cassé)
        },

        muted: {
          DEFAULT: '#e2dedb',
          foreground: '#6b5e57',
        },
        'muted-foreground': '#8d7c72',

        destructive: {
          DEFAULT: '#e9590c',         // rouge sombre (danger) – reste dans la vibe warm
          foreground: '#ffffff',
        },

        popover: {
          DEFAULT: 'hsl(0 0% 100%)',  // light
          dark:  '#2a1e18',
        },
        'popover-foreground': 'hsl(20 14% 4%)',

        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          dark:  '#2a1e18',
        },
        'card-foreground': 'hsl(20 14% 4%)',
      },

      borderRadius: {
        DEFAULT: '3px',
        sm:    '3px',
        md:    '3px',
        lg:    '3px',
        xl:    '3px',
        '2xl': '6px',
        full:  '9999px',
      },

      fontFamily: {
        display: ["Rubik", "sans-serif"],
        sans:    ["Inter", "sans-serif"],    // ou body si tu préfères garder le nom
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      }
    }
  },

  plugins: [require("tailwindcss-animate")],
}