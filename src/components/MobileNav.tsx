"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type NavItem = { label: string; href: string; openInNewTab?: boolean };

export default function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle side effects of opening/closing
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      return () => {
        document.body.style.overflow = originalStyle;
        triggerRef.current?.focus();
      };
    }
  }, [open]);

  // Handle keyboard events (Escape and focus trapping)
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="p-2 rounded-lg glass-card border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all flex flex-col justify-center gap-1.5 w-10 h-10"
      >
        <span className="block w-5 h-0.5 bg-[var(--color-cool-cyan)] transition-all" />
        <span className="block w-3.5 h-0.5 bg-[var(--color-electric-blue)] transition-all" />
      </button>

      {open && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 backdrop-blur-2xl bg-[rgba(5,8,22,0.96)]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-cool-cyan)] animate-ping" />
              <span className="font-mono text-xs text-[var(--color-cool-cyan)] tracking-wider">
                NAVIGATION // HUD
              </span>
            </div>
            <button
              aria-label="Close menu"
              className="w-9 h-9 rounded-lg glass-card border border-[var(--color-border)] flex items-center justify-center text-lg text-[var(--color-text-secondary)] hover:text-white"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Links List */}
          <div className="flex flex-col gap-4 py-8 overflow-y-auto">
            {items.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-heading text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-cool-cyan)] transition-colors flex items-center justify-between group py-1"
                onClick={() => setOpen(false)}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-cool-cyan)] transition-colors">
                  0{idx + 1} →
                </span>
              </Link>
            ))}
          </div>

          {/* Footer Info */}
          <div className="pt-6 border-t border-[var(--color-border)] font-mono text-xs text-[var(--color-text-muted)] flex justify-between items-center">
            <span>JAISHANTH M // CYBERSECURITY</span>
            <span className="text-[var(--color-cool-cyan)]">MCET POLLACHI</span>
          </div>
        </div>
      )}
    </div>
  );
}
