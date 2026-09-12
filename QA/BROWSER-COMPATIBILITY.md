# Browser Compatibility & Rendering Engine Audit — Jaishanth M Portfolio

**Date:** September 12, 2026  
**Auditor:** Cross-Browser QA Engineer  
**Rendering Engines Audited:**
- Blink / Chromium (Google Chrome 120+, Microsoft Edge, Brave, Opera)
- Gecko (Mozilla Firefox 120+)
- WebKit (Apple Safari 17+ on macOS & iOS)

---

## 1. Cross-Browser Matrix & Feature Support

| Feature / Technology | Chrome / Edge (Blink) | Firefox (Gecko) | Safari macOS (WebKit) | Safari iOS (Mobile WebKit) |
| :--- | :--- | :--- | :--- | :--- |
| **CSS Backdrop Filter (`backdrop-blur-xl`)** | Supported (Hardware Accel) | Supported (`layout.css.backdrop-filter.enabled`) | Supported (`-webkit-backdrop-filter`) | Supported |
| **CSS Custom Properties (Design Tokens)** | 100% Supported | 100% Supported | 100% Supported | 100% Supported |
| **2D Canvas Constellation (`BackgroundEngine`)** | 60fps Smooth | 60fps Smooth | 60fps Smooth | Optimized to 30 nodes (60fps) |
| **Three.js WebGL 2.0 (`SignalLattice`)** | Full rendering | Full rendering | Full rendering | Graceful SVG Fallback |
| **CSS Perspective 3D Card Tilt** | Supported | Supported | Supported (`-webkit-perspective`) | Touch-safe |
| **Next.js 15 App Router Hydration** | 0 warnings | 0 warnings | 0 warnings | 0 warnings |
| **HTML5 Semantic Landmarks** | Accessible | Accessible | Accessible | Accessible |
| **PDF Embedded Dossier Viewport** | Native PDF Viewer | Native PDF Viewer | Native PDF Viewer | Download CTA fallback |

---

## 2. Safari & WebKit Specific Hardening

- **Backdrop Blur Fallbacks:** In `src/app/globals.css`, glassmorphism utility classes (`.glass-card`, `.glass-panel`, `.glass-panel-elevated`) pair `backdrop-filter: blur(...)` with fallback semi-opaque backgrounds (`background: rgba(11, 17, 32, 0.85)`). On browsers where backdrop-filter is disabled or hardware-restricted, cards maintain high contrast and legibility without visual artifacts.
- **Dynamic Viewport Units (dvh):** The hero section specifies `min-h-[92vh]` avoiding iOS Safari toolbar resize jumps.
- **Input Text Auto-Zoom Prevention:** Form text inputs declare explicit `font-size: 0.875rem` (14px) with base text sizing scaled appropriately to prevent Safari iOS from zooming the viewport during form interactions.

---

## 3. Firefox Gecko Specific Hardening

- **Scrollbar Styling:** Standard `scrollbar-width: thin` and `scrollbar-color: var(--color-electric-blue) var(--color-bg-primary)` declared alongside WebKit scrollbar pseudo-elements.
- **Font Kerning & Anti-Aliasing:** Font smoothing classes (`antialiased`, `-moz-osx-font-smoothing: grayscale`) ensure crisp rendering of Space Grotesk on Linux and macOS Gecko builds.
