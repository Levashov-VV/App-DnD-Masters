export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './src/**/*.css'],
  theme: {
    extend: {
      clipPath: {
        'shield-straight': 'polygon(20% 0%, 80% 0%, 100% 70%, 50% 100%, 0% 70%)',
      },
    },
  },
  plugins: [],
  
};
