import Image from "next/image";
import { wedding } from "@/lib/wedding";

/** The couple's mark, TPRAYS'26: the name in spaced capitals, the year in script. */
export function Monogram({ className = "", size = 40 }: { className?: string; size?: number }) {
  const { text, year } = wedding.monogram;
  return (
    <span
      aria-label={`${text} ${year}`}
      className={`inline-flex items-baseline whitespace-nowrap leading-none ${className}`}
      style={{ fontSize: size * 0.42 }}
    >
      <span className="heading tracking-[0.2em]">{text}</span>
      <span className="font-script -ml-[0.1em] text-[1.45em] leading-none">’{year}</span>
    </span>
  );
}

export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" aria-hidden className={`h-5 w-5 ${className}`} fill="none">
      <path
        d="M12 20.5C6 16.3 1.5 12.6 1.5 7.4 1.5 4.1 4 1.5 7.1 1.5c2 0 3.8 1.1 4.9 2.8 1.1-1.7 2.9-2.8 4.9-2.8 3.1 0 5.6 2.6 5.6 5.9 0 5.2-4.5 8.9-10.5 13.1Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

/** A thin rule with a small diamond trio, after the card's divider. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-current opacity-40" />
      <span className="text-[0.6rem] tracking-[0.3em] text-herbal">✦✦✦</span>
      <span className="h-px w-16 bg-current opacity-40" />
    </div>
  );
}

/*
  The ivory florals from t-wedding, as drawn:
    corner-a     big bloom at the lower right, sprays rising left and up
    corner-b     bloom at the lower middle, stems rising to the right
    corner-tall  bloom at the lower left, stems rising up and running right
    bouquet      a standing cluster of three blooms
    spray-wide   a horizontal spray, bloom at the right
*/
const FLORALS = {
  "corner-a": { w: 700, h: 766 },
  "corner-b": { w: 600, h: 758 },
  "corner-tall": { w: 600, h: 758 },
  bouquet: { w: 480, h: 635 },
  "spray-wide": { w: 458, h: 300 },
} as const;

export type FloralName = keyof typeof FLORALS;

/**
 * One of the florals, placed by `className` (position and width). It blooms
 * in when it scrolls into view, then sways. Three layers so each owns its own
 * transform: the outer one the bloom-in, the middle one the mirroring, the
 * image the sway.
 *
 * On the light paper the ivory needs a soft shadow to hold its edge; `onPaper`
 * adds it.
 */
export function Floral({
  name,
  className = "",
  flipX = false,
  flipY = false,
  onPaper = false,
}: {
  name: FloralName;
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
  onPaper?: boolean;
}) {
  const { w, h } = FLORALS[name];
  const mirror = `${flipX ? "scaleX(-1)" : ""} ${flipY ? "scaleY(-1)" : ""}`.trim();
  return (
    <span data-inview aria-hidden className={`bloom pointer-events-none -z-10 block select-none ${className}`}>
      <span className="block" style={mirror ? { transform: mirror } : undefined}>
        <Image
          src={`/invitation/ornaments/floral-${name}.webp`}
          alt=""
          width={w}
          height={h}
          draggable={false}
          sizes="320px"
          className={`sway block h-auto w-full ${onPaper ? "drop-shadow-[0_2px_5px_rgb(138_106_63/0.35)]" : ""}`}
        />
      </span>
    </span>
  );
}

/** The peony on its own, for small accents and the timeline's rider. */
export function Peony({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/invitation/ornaments/peony.webp"
      alt=""
      aria-hidden
      width={200}
      height={200}
      draggable={false}
      className={`pointer-events-none block h-auto select-none ${className}`}
    />
  );
}
