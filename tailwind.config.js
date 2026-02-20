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
          DEFAULT: '#e73645',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#1D3557',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#F4D35E',
          foreground: '#1D3557',
        },
        background: {
			DEFAULT: '#F8FAFC',  
			dark: '#211112',
		},
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        destructive: {
          DEFAULT: '#e73645',
          foreground: '#ffffff',
        },
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '3px',
        lg: '3px',
        xl: '4px',
        full: '9999px',
      },
      fontFamily: {
        display: ['Work Sans', 'system-ui', 'sans-serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
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
};