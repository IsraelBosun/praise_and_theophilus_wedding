"use client";

import { useEffect } from "react";

/**
 * One observer for the whole page. Anything marked `data-inview` gets
 * `is-visible` the first time it scrolls into view, and the CSS in
 * globals.css does the rest. Keeps every section a server component.
 */
export function Animator() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-inview]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
