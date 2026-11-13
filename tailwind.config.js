/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'surface-0': 'rgb(var(--surface-0) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        side: 'rgb(var(--bg-side) / <alpha-value>)',
        editor: 'rgb(var(--bg-editor) / <alpha-value>)',
        panel: 'rgb(var(--bg-panel) / <alpha-value>)',
        line: 'rgb(var(--border) / var(--line-alpha))',
        ink: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-2) / <alpha-value>)',
        green: 'rgb(var(--green) / <alpha-value>)',
        orange: 'rgb(var(--orange) / <alpha-value>)',
        teal: 'rgb(var(--teal) / <alpha-value>)',
        cyan: 'rgb(var(--cyan) / <alpha-value>)',
        red: 'rgb(var(--red) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        warm: 'rgb(var(--warm) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Geist',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        blink: 'blink 1.1s steps(1, end) infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
