"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";

export type NavItem = { label: string; href: string; openInNewTab?: boolean };

export type SocialLinkItem = {
  id: string;
  platform: string;
  url: string;
  iconKey?: string | null;
  customLabel?: string | null;
};

export default function MobileNav({
  items,
  socialLinks = [],
}: {
  items: NavItem[];
  socialLinks?: SocialLinkItem[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock and focus management
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        triggerRef.current?.focus();
      };
    }
  }, [open]);

  // Keyboard navigation: Escape to dismiss & focus trap
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div>
      {/* Mobile Menu Trigger Button (matching jaiz.vercel.app responsive layout) */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="p-2 rounded-xl border border-[var(--color-border)] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] transition-all flex flex-col justify-center items-center gap-1.5 w-10 h-10 group"
      >
        <span className="block w-5 h-0.5 bg-[var(--color-signal-red)] group-hover:scale-x-110 transition-transform origin-left" />
        <span className="block w-3.5 h-0.5 bg-zinc-300 group-hover:scale-x-110 transition-transform origin-left" />
      </button>

      {/* Full-Screen Editorial Navigation Overlay */}
      {open && mounted && createPortal(
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-12 md:p-16 backdrop-blur-2xl bg-[#09090b]/98 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-8 border-b border-[var(--color-border)] max-w-6xl mx-auto w-full">
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-tight text-white">
                JAISHANTH M.
              </span>
              <span className="font-mono text-[10px] text-[var(--color-text-muted)] tracking-widest uppercase">
                OFFENSIVE SECURITY RESEARCH
              </span>
            </div>

            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[var(--color-border)] hover:border-white/30 text-xs font-mono text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              <span>CLOSE</span>
              <span className="text-sm leading-none font-sans">×</span>
            </button>
          </div>

          {/* Editorial Links Index Grid */}
          <div className="max-w-6xl mx-auto w-full py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            {items.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                className="group flex items-baseline justify-between py-2.5 border-b border-white/[0.04] hover:border-white/20 transition-colors"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[var(--color-signal-red)] opacity-80 group-hover:opacity-100 transition-opacity">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-zinc-300 group-hover:text-white group-hover:translate-x-1.5 transition-all">
                    {item.label}
                  </span>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--color-signal-red)] transition-all">
                  EXPLORE →
                </span>
              </Link>
            ))}
          </div>

          {/* Footer Presence & Direct Channels */}
          <div className="max-w-6xl mx-auto w-full pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-text-muted)]">
              <span>SECURITY RESEARCH</span>
              <span>·</span>
              <span>RED TEAMING</span>
              <span>·</span>
              <span>EXPLOIT TOOLING</span>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={`Visit ${link.platform}`}
                    className="w-9 h-9 rounded-sm border border-[var(--color-border)] hover:border-[var(--color-signal-red)] bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-all"
                  >
                    <SocialIcon platform={link.platform} iconKey={link.iconKey} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
