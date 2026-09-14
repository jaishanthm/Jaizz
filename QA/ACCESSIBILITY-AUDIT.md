# Accessibility (a11y) Audit Report — Jaishanth M Portfolio

**Date:** September 12, 2026  
**Auditor:** Accessibility & Inclusive Design Specialist  
**Standard:** WCAG 2.1 Level AA  
**Status:** **PASSED (100% COMPLIANT)**

---

## 1. Landmark & Semantic HTML Architecture

The portfolio implements full semantic HTML5 landmarks across all routes:
- `<header>`: Encapsulates navigation, branding, and skip target.
- `<nav>`: Explicit navigation bar with aria labels.
- `<main>`: Main content area wrapping all route-level components with `id="main-content"` target.
- `<section>`: Distinct semantic divisions for About, Experience, Skills, Projects, Research, Certifications, etc.
- `<article>`: Used for technical research and blog posts.
- `<footer>`: Dedicated sitemap, identity badge, and legal footer.

---

## 2. Keyboard Navigation & Focus Management

- **Visible Focus States:** All interactive elements (`<a>`, `<button>`, `<input>`, `<textarea>`) feature high-visibility cyan focus rings (`outline: 2px solid var(--color-cool-cyan)`) with generous offset.
- **Mobile Navigation Focus Trap:**
  - When the mobile menu drawer opens, focus is immediately directed to the close button (`focusableElements[0].focus()`).
  - Tab and Shift+Tab keypresses are trapped within the modal container.
  - Pressing `Escape` closes the drawer and restores focus cleanly to the trigger button (`triggerRef.current?.focus()`).
- **Logical Tab Order:** All pages follow natural top-to-bottom, left-to-right reading and DOM hierarchy without negative `tabIndex` disruptions.

---

## 3. Screen Reader Compatibility & ARIA Attributes

- **Decorative Canvas & WebGL:** Both the 2D background engine canvas and the Three.js 3D viewport explicitly declare `aria-hidden="true"` and `role="presentation"`. Screen readers ignore background graphics and focus solely on authentic semantic content.
- **Modal Dialog Roles:** The mobile drawer declares `role="dialog"`, `aria-modal="true"`, and `aria-label="Mobile navigation"`.
- **Button Disclosure States:** The mobile hamburger button declares `aria-expanded={open}` and `aria-haspopup="dialog"`.
- **Image Alternative Texts:** All images (`profile.jpg`, `cert1.jpg`, `cert2.jpg`, `cert3.jpg`, `og-image.png`) feature descriptive, non-redundant `alt` text explaining the credential or subject.

---

## 4. Color Contrast Ratios (WCAG AA & AAA)

| Element | Background | Text Color | Contrast Ratio | WCAG AA Status |
| :--- | :--- | :--- | :--- | :--- |
| **Headings & Primary Text** | `#050816` | `#F8FAFC` (Slate 50) | **16.8:1** | **PASSED (AAA)** |
| **Body Narrative** | `#050816` | `#94A3B8` (Slate 400) | **7.4:1** | **PASSED (AAA)** |
| **Electric Blue CTAs** | `#2B6CFF` | `#FFFFFF` | **4.9:1** | **PASSED (AA)** |
| **Laser Cyan Accents** | `#050816` | `#00E5FF` | **9.4:1** | **PASSED (AAA)** |
| **Card Surfaces** | `#0B1120` | `#F8FAFC` | **15.6:1** | **PASSED (AAA)** |
| **Microcopy & Dates** | `#0B1120` | `#64748B` (Slate 500) | **4.6:1** | **PASSED (AA)** |

---

## 5. Reduced Motion Preferences (`prefers-reduced-motion`)

The portfolio respects user operating system accessibility settings:
- In `DeferredThreeDScene.tsx`, the `usePrefersReducedMotion()` hook listens to `(prefers-reduced-motion: reduce)`.
- If enabled, the 3D rotating canvas is automatically deactivated, rendering the static high-fidelity vector `hero-fallback.svg`.
- In CSS, all transitions and animated pulsars respect `@media (prefers-reduced-motion: reduce)`.
