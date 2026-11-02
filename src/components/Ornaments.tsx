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
    corner-tall  bloom at the lower left, stems rising up and running right
    bouquet      a standing cluster of three blooms

  The watercolour autumn florals from the updated card. Each was cut by the
  card's edges, so it names the corner it must sit flush in (`cut`, before
  any flip), and blooms and sways from that corner so the cut never shows:
    autumn-corner  rust daisies, copper and sage leaves falling from the top right
    autumn-spray   copper and sage leaves rising from the bottom right
*/
const FLORALS: Record<string, { file: string; w: number; h: number; cut?: [x: 0 | 1, y: 0 | 1] }> = {
  "corner-a": { file: "floral-corner-a", w: 700, h: 766 },
  "corner-tall": { file: "floral-corner-tall", w: 600, h: 758 },
  bouquet: { file: "floral-bouquet", w: 480, h: 635 },
  "autumn-corner": { file: "autumn-corner", w: 720, h: 838, cut: [1, 0] },
  "autumn-spray": { file: "autumn-spray", w: 600, h: 750, cut: [1, 1] },
};

export type FloralName =
  | "corner-a"
  | "corner-tall"
  | "bouquet"
  | "autumn-corner"
  | "autumn-spray";

const pct = (v: number) => `${v * 100}%`;

/**
 * One of the florals, placed by `className` (position and width). It blooms
 * in when it scrolls into view, then sways. Three layers so each owns its own
 * transform: the outer one the bloom-in, the middle one the mirroring, the
 * image the sway.
 *
 * On the light paper the ivory needs a soft shadow to hold its edge; `onPaper`
 * adds it. The autumn florals carry their own colour and need none.
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
  const { file, w, h, cut } = FLORALS[name];
  const mirror = `${flipX ? "scaleX(-1)" : ""} ${flipY ? "scaleY(-1)" : ""}`.trim();
  // The image sways about its cut corner as drawn; the outer layer blooms about where that corner lands after the flip.
  const swayOrigin = cut ? `${pct(cut[0])} ${pct(cut[1])}` : undefined;
  const bloomOrigin = cut ? `${pct(flipX ? 1 - cut[0] : cut[0])} ${pct(flipY ? 1 - cut[1] : cut[1])}` : undefined;
  return (
    <span
      data-inview
      aria-hidden
      className={`bloom pointer-events-none -z-10 block select-none ${className}`}
      style={bloomOrigin ? { transformOrigin: bloomOrigin } : undefined}
    >
      <span className="block" style={mirror ? { transform: mirror } : undefined}>
        <Image
          src={`/invitation/ornaments/${file}.webp`}
          alt=""
          width={w}
          height={h}
          draggable={false}
          sizes="320px"
          style={swayOrigin ? { transformOrigin: swayOrigin } : undefined}
          className={`sway block h-auto w-full ${onPaper && !cut ? "drop-shadow-[0_2px_5px_rgb(138_106_63/0.35)]" : ""}`}
        />
      </span>
    </span>
  );
}

/** A single rust daisy from the updated card, for small accents. */
export function Daisy({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/invitation/ornaments/daisy.webp"
      alt=""
      aria-hidden
      width={185}
      height={169}
      draggable={false}
      className={`pointer-events-none block h-auto select-none ${className}`}
    />
  );
}
