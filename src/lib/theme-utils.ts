export interface ThemeSettings {
  accentColor: string;
  glassIntensity: number;
  animationIntensity: number;
  threeDMode: "FULL" | "LITE" | "OFF";
}

export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [239, 68, 68];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function generateThemeCssVariables(settings: Partial<ThemeSettings>): string {
  const accent = settings.accentColor || "#ef4444";
  const [r, g, b] = hexToRgb(accent);
  const glass = typeof settings.glassIntensity === "number" ? settings.glassIntensity : 50;
  const anim = typeof settings.animationIntensity === "number" ? settings.animationIntensity : 50;

  // Tint mixes with white (for lighter 50..400)
  const tint = (f: number) => [
    Math.round(r + (255 - r) * f),
    Math.round(g + (255 - g) * f),
    Math.round(b + (255 - b) * f),
  ];
  // Shade mixes with black (for darker 600..950)
  const shade = (f: number) => [
    Math.round(r * f),
    Math.round(g * f),
    Math.round(b * f),
  ];

  const c50 = tint(0.95);
  const c100 = tint(0.90);
  const c200 = tint(0.75);
  const c300 = tint(0.55);
  const c400 = tint(0.25);
  const c500 = [r, g, b];
  const c600 = shade(0.88);
  const c700 = shade(0.72);
  const c800 = shade(0.55);
  const c900 = shade(0.35);
  const c950 = shade(0.18);

  const glassBgAlpha = (0.45 + (glass / 100) * 0.45).toFixed(2);
  const glassBlurPx = Math.round((glass / 100) * 24);

  // Speed factor: 0% -> 3x duration (reduced motion), 50% -> 1.5x, 100% -> 1x duration (fast)
  const speedScale = anim === 0 ? 3 : 2 - anim / 100;
  const durationFast = Math.round(150 * speedScale);
  const durationBase = Math.round(250 * speedScale);
  const durationSlow = Math.round(500 * speedScale);

  return `
    :root, html {
      --color-signal-red: ${accent};
      --color-primary: ${accent};
      --color-signal-red-hover: rgb(${c600.join(", ")});
      --color-signal-red-dark: rgb(${c700.join(", ")});
      --color-signal-crimson: rgb(${c400.join(", ")});
      --color-signal-light: rgb(${c300.join(", ")});
      --color-signal-darkest: rgba(${r}, ${g}, ${b}, 0.25);
      --color-signal-burgundy: rgba(${r}, ${g}, ${b}, 0.08);
      --color-border-hover: rgba(${r}, ${g}, ${b}, 0.35);
      --color-border-active: rgba(${r}, ${g}, ${b}, 0.6);
      --glass-border-glow: rgba(${r}, ${g}, ${b}, 0.25);
      --shadow-red-signal: 0 0 20px -3px rgba(${r}, ${g}, ${b}, 0.25);

      --color-signal-50: rgb(${c50.join(", ")});
      --color-signal-100: rgb(${c100.join(", ")});
      --color-signal-200: rgb(${c200.join(", ")});
      --color-signal-300: rgb(${c300.join(", ")});
      --color-signal-400: rgb(${c400.join(", ")});
      --color-signal-500: ${accent};
      --color-signal-600: rgb(${c600.join(", ")});
      --color-signal-700: rgb(${c700.join(", ")});
      --color-signal-800: rgb(${c800.join(", ")});
      --color-signal-900: rgb(${c900.join(", ")});
      --color-signal-950: rgb(${c950.join(", ")});

      --color-red-50: rgb(${c50.join(", ")});
      --color-red-100: rgb(${c100.join(", ")});
      --color-red-200: rgb(${c200.join(", ")});
      --color-red-300: rgb(${c300.join(", ")});
      --color-red-400: rgb(${c400.join(", ")});
      --color-red-500: ${accent};
      --color-red-600: rgb(${c600.join(", ")});
      --color-red-700: rgb(${c700.join(", ")});
      --color-red-800: rgb(${c800.join(", ")});
      --color-red-900: rgb(${c900.join(", ")});
      --color-red-950: rgb(${c950.join(", ")});

      --glass-bg: rgba(18, 18, 22, ${glassBgAlpha});
      --glass-blur: ${glassBlurPx}px;
      --duration-fast: ${durationFast}ms;
      --duration-base: ${durationBase}ms;
      --duration-slow: ${durationSlow}ms;
      --animation-speed-factor: ${(anim / 50).toFixed(2)};
    }
  `.trim();
}

export function applyThemeToDom(settings: Partial<ThemeSettings>) {
  if (typeof document === "undefined") return;
  const accent = settings.accentColor || "#ef4444";
  const [r, g, b] = hexToRgb(accent);
  const glass = typeof settings.glassIntensity === "number" ? settings.glassIntensity : 50;
  const anim = typeof settings.animationIntensity === "number" ? settings.animationIntensity : 50;

  const tint = (f: number) => [
    Math.round(r + (255 - r) * f),
    Math.round(g + (255 - g) * f),
    Math.round(b + (255 - b) * f),
  ];
  const shade = (f: number) => [
    Math.round(r * f),
    Math.round(g * f),
    Math.round(b * f),
  ];

  const c50 = tint(0.95);
  const c100 = tint(0.90);
  const c200 = tint(0.75);
  const c300 = tint(0.55);
  const c400 = tint(0.25);
  const c600 = shade(0.88);
  const c700 = shade(0.72);
  const c800 = shade(0.55);
  const c900 = shade(0.35);
  const c950 = shade(0.18);

  const root = document.documentElement;
  root.style.setProperty("--color-signal-red", accent);
  root.style.setProperty("--color-primary", accent);
  root.style.setProperty("--color-signal-red-hover", `rgb(${c600.join(", ")})`);
  root.style.setProperty("--color-signal-red-dark", `rgb(${c700.join(", ")})`);
  root.style.setProperty("--color-signal-crimson", `rgb(${c400.join(", ")})`);
  root.style.setProperty("--color-signal-light", `rgb(${c300.join(", ")})`);
  root.style.setProperty("--color-signal-darkest", `rgba(${r}, ${g}, ${b}, 0.25)`);
  root.style.setProperty("--color-signal-burgundy", `rgba(${r}, ${g}, ${b}, 0.08)`);
  root.style.setProperty("--color-border-hover", `rgba(${r}, ${g}, ${b}, 0.35)`);
  root.style.setProperty("--color-border-active", `rgba(${r}, ${g}, ${b}, 0.6)`);
  root.style.setProperty("--glass-border-glow", `rgba(${r}, ${g}, ${b}, 0.25)`);
  root.style.setProperty("--shadow-red-signal", `0 0 20px -3px rgba(${r}, ${g}, ${b}, 0.25)`);

  root.style.setProperty("--color-signal-50", `rgb(${c50.join(", ")})`);
  root.style.setProperty("--color-signal-100", `rgb(${c100.join(", ")})`);
  root.style.setProperty("--color-signal-200", `rgb(${c200.join(", ")})`);
  root.style.setProperty("--color-signal-300", `rgb(${c300.join(", ")})`);
  root.style.setProperty("--color-signal-400", `rgb(${c400.join(", ")})`);
  root.style.setProperty("--color-signal-500", accent);
  root.style.setProperty("--color-signal-600", `rgb(${c600.join(", ")})`);
  root.style.setProperty("--color-signal-700", `rgb(${c700.join(", ")})`);
  root.style.setProperty("--color-signal-800", `rgb(${c800.join(", ")})`);
  root.style.setProperty("--color-signal-900", `rgb(${c900.join(", ")})`);
  root.style.setProperty("--color-signal-950", `rgb(${c950.join(", ")})`);

  root.style.setProperty("--color-red-50", `rgb(${c50.join(", ")})`);
  root.style.setProperty("--color-red-100", `rgb(${c100.join(", ")})`);
  root.style.setProperty("--color-red-200", `rgb(${c200.join(", ")})`);
  root.style.setProperty("--color-red-300", `rgb(${c300.join(", ")})`);
  root.style.setProperty("--color-red-400", `rgb(${c400.join(", ")})`);
  root.style.setProperty("--color-red-500", accent);
  root.style.setProperty("--color-red-600", `rgb(${c600.join(", ")})`);
  root.style.setProperty("--color-red-700", `rgb(${c700.join(", ")})`);
  root.style.setProperty("--color-red-800", `rgb(${c800.join(", ")})`);
  root.style.setProperty("--color-red-900", `rgb(${c900.join(", ")})`);
  root.style.setProperty("--color-red-950", `rgb(${c950.join(", ")})`);

  root.style.setProperty("--glass-bg", `rgba(18, 18, 22, ${(0.45 + (glass / 100) * 0.45).toFixed(2)})`);
  root.style.setProperty("--glass-blur", `${Math.round((glass / 100) * 24)}px`);

  const speedScale = anim === 0 ? 3 : 2 - anim / 100;
  root.style.setProperty("--duration-fast", `${Math.round(150 * speedScale)}ms`);
  root.style.setProperty("--duration-base", `${Math.round(250 * speedScale)}ms`);
  root.style.setProperty("--duration-slow", `${Math.round(500 * speedScale)}ms`);
  root.style.setProperty("--animation-speed-factor", `${(anim / 50).toFixed(2)}`);
}
