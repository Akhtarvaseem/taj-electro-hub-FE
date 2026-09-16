// Empty PostCSS config.
// Its purpose is to STOP Vite from climbing up to the parent folder and
// loading the root Next.js `postcss.config.mjs` (which needs Tailwind).
// This React app uses plain CSS — no PostCSS plugins are needed.
module.exports = {
  plugins: {},
};
