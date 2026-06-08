import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0A14',
        surface: '#12121F',
        card: '#1A1A2E',
        'card-hover': '#202038',
        border: '#2A2A45',
        primary: '#6C63FF',
        'primary-dark': '#5A52E0',
        'primary-light': '#8B85FF',
        accent: '#FF6B9D',
        'text-primary': '#F0F0FF',
        'text-secondary': '#A0A0C0',
        'text-muted': '#606080',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        category: {
          food: '#FF6B6B',
          transport: '#4ECDC4',
          shopping: '#FFE66D',
          bills: '#A8E6CF',
          health: '#FF8B94',
          entertainment: '#B39DDB',
          others: '#90A4AE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        app: '480px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,22,42,0.9) 100%)',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(108, 99, 255, 0.25)',
        'glow-sm': '0 0 12px rgba(108, 99, 255, 0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'fab': '0 8px 32px rgba(108,99,255,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up-fast': 'slideUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(108,99,255,0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(108,99,255,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
