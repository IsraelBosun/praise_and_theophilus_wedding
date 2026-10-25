import type { ReactNode } from "react";

/**
 * Its children rise in one after another the first time the block scrolls
 * into view. The observing is done once for the whole page by Animator.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-inview className={`reveal ${className}`}>
      {children}
    </div>
  );
}
