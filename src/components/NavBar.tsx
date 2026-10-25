"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Monogram } from "./Ornaments";

const LINKS = [
  { href: "#invitation", label: "Invitation" },
  { href: "#date", label: "Save the Date" },
  { href: "#schedule", label: "Order of the Day" },
  { href: "#venues", label: "Venues" },
  { href: "#dress-code", label: "Colours of the Day" },
  { href: "#gifts", label: "Gifts" },
  { href: "#rsvp", label: "RSVP" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      // Written straight to the element so scrolling never re-renders for it.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the wine hero the bar is clear with gold marks; past it, it turns to paper.
  const tone = scrolled || open ? "bg-paper/95 text-gold-deep shadow-sm backdrop-blur" : "text-gold-light";

  return (
    <>
      <header
        className={`nav-in fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between px-5 py-3 transition-colors duration-500 ${tone}`}
      >
        <span
          ref={progress}
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-light to-gold"
        />
        <a href="#top" aria-label="Back to top">
          <Monogram size={34} />
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2"
        >
          {open ? <X size={22} strokeWidth={1.2} /> : <Menu size={22} strokeWidth={1.2} />}
        </button>
      </header>

      {open && (
        <nav
          id="site-menu"
          className="fixed inset-x-0 top-[58px] z-30 mx-auto max-w-[480px] border-t border-gold/20 bg-paper/97 py-6 shadow-lg backdrop-blur"
        >
          <ul className="flex flex-col items-center gap-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="heading text-[0.85rem] text-ink transition-colors hover:text-gold-deep"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
