const typography = require('@tailwindcss/typography');

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#111827',
          lighter: '#1f2937',
          accent: '#2563eb',
        },
      },
      typography: ({ theme }) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.slate[300]'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.sky[400]'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-quotes': theme('colors.slate[200]'),
            '--tw-prose-quote-borders': theme('colors.slate[600]'),
            '--tw-prose-code': theme('colors.sky[300]'),
            '--tw-prose-pre-bg': theme('colors.slate[900]'),
          },
        },
      }),
    },
  },
  plugins: [typography],
};
