// ─── DESIGN SYSTEM PARTAGÉ ───
export const font = `'DM Sans', sans-serif`;
export const fontDisplay = `'DM Serif Display', serif`;
export const mono = `'DM Mono', monospace`;

export const palette = {
  bg:          "#080B10",
  bgAlt:       "#0C0F14",
  surface:     "#111520",
  surfaceHigh: "#161C28",
  border:      "#1E2535",
  borderLight: "#28334A",
  accent:      "#3ECF8E",
  accentDim:   "rgba(62,207,142,0.10)",
  accentGlow:  "rgba(62,207,142,0.22)",
  accentDark:  "#2BA86E",
  purple:      "#A78BFA",
  purpleDim:   "rgba(167,139,250,0.10)",
  blue:        "#60A5FA",
  blueDim:     "rgba(96,165,250,0.10)",
  danger:      "#F87171",
  dangerDim:   "rgba(248,113,113,0.10)",
  warn:        "#FBBF24",
  warnDim:     "rgba(251,191,36,0.10)",
  orange:      "#FB923C",
  orangeDim:   "rgba(251,146,60,0.10)",
  text:        "#E2E8F0",
  textMuted:   "#7E8FA8",
  textDim:     "#4A5568",
  white:       "#FFFFFF",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${palette.bg}; color: ${palette.text}; font-family: ${font}; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${palette.border}; border-radius: 4px; }
  a { color: inherit; text-decoration: none; }
  button { font-family: ${font}; cursor: pointer; }
  input, select, textarea { font-family: ${font}; }
  input:focus, select:focus, textarea:focus { outline: none; border-color: ${palette.accent} !important; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
  .fade-up { animation: fadeUp 0.6s ease forwards; }
  .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
  .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }
  .fade-up-5 { animation: fadeUp 0.6s 0.5s ease both; }
`;
