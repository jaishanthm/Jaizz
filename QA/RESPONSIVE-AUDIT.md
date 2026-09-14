# Responsive & Device-Tier Audit — Jaishanth M Portfolio

**Date:** September 12, 2026  
**Auditor:** Frontend Systems & Device Compatibility Specialist  
**Breakpoints Audited:**
- Mobile Small: 375px (iPhone SE, small Android)
- Mobile Standard: 390px - 414px (iPhone 14/15, Pixel)
- Tablet: 768px - 834px (iPad Mini / Air)
- Desktop Standard: 1024px - 1440px (MacBook Air / Pro)
- Wide Display: 1920px+ (External 4K Monitors)

---

## 1. Breakpoint Behavior Matrix

| Viewport | Component / Section | Responsive Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Mobile (<768px)** | **Navigation** | Hamburger trigger opens full-screen backdrop-blurred overlay. Body scroll is locked. Focus is trapped. Closes on link click or Escape. | **PASSED** |
| | **Hero Section** | Stacks vertically (left column content on top, 3D viewport on bottom). Headline scales from `text-4xl` to `text-6xl`. | **PASSED** |
| | **3D Viewport** | WebGL canvas is bypassed in favor of crisp, lightweight SVG fallback (`/hero-fallback.svg`) to preserve battery, GPU, and avoid gesture conflicts. | **PASSED** |
| | **Background Canvas** | Density reduced to 30 nodes on screens <768px to ensure 60fps scrolling on lower-end mobile processors. | **PASSED** |
| | **Capability Matrix** | Multi-column grid collapses to a single stacked column with generous padding. | **PASSED** |
| | **Project & Research** | 3-column and 2-column cards stack cleanly as 1-column cards. | **PASSED** |
| **Tablet (768px - 1023px)** | **Navigation** | Desktop navigation bar appears at 1024px; mobile drawer active below 1024px to prevent link wrapping. | **PASSED** |
| | **Hero Section** | Spacing scales gracefully. 3D canvas is mounted in LITE mode with ambient rotation only (touch drag disabled to avoid page-scroll conflict). | **PASSED** |
| | **Card Grids** | Projects and Research transition to 2-column grid. | **PASSED** |
| **Desktop (1024px+)** | **Navigation** | Full horizontal navbar with call-sign monogram, 12 navigation links, and "Connect" CTA. | **PASSED** |
| | **Hero Section** | Asymmetric 7-column / 5-column spatial split. Interactive mouse parallax camera tilt (±8° max) enabled. | **PASSED** |
| | **Background Canvas** | Full 65-node constellation with dynamic proximity lines and cursor spotlight active. | **PASSED** |
| | **Card Grids** | 3-column asymmetric layout with hardware-accelerated 3D hover tilt active. | **PASSED** |

---

## 2. Touch Target Ergonomics

WCAG 2.1 Success Criterion 2.5.5 requires touch targets to be at least 44x44 CSS pixels.
- **Mobile Menu Trigger:** `w-10 h-10` with generous tap padding (`p-2`, effective 48x48px).
- **Navigation Links in Drawer:** Full-width block links with `py-3` padding, exceeding 48px height.
- **CTA Buttons:** Buttons have `px-6 py-3.5` and `px-8 py-3.5`, providing 48px to 52px tap height.
- **Form Inputs:** Height of 48px (`py-3`) ensures comfortable mobile typing and eliminates iOS auto-zoom on input focus (font-size >= 16px on mobile).

---

## 3. Gesture Conflict Analysis (Phase 7 §6)

- **Problem:** Embedding an interactive 3D WebGL canvas on touch devices causes finger drag gestures to manipulate the 3D scene rather than scroll the page, trapping user scroll.
- **Solution Verified:**
  - `DeferredThreeDScene` runs `useDeviceTier()`.
  - On mobile (`width < 768px`), the 3D scene is not mounted; the optimized static vector `hero-fallback.svg` renders with zero touch event interception.
  - On tablet, `interactive={false}` is passed to `Scene.tsx`, disabling mouse/pointer listeners and using pure ambient rotational easing.
  - On desktop, mouse movement triggers subtle bounded parallax without capturing page scroll.

---

## 4. Responsive Viewport Meta Configuration

Verified in `src/app/layout.tsx`:
```tsx
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050816",
};
```
Ensures proper responsive scaling without disabling accessibility zooming.
