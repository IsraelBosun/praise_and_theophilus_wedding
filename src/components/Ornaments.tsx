import { wedding } from "@/lib/wedding";

/** The "P/T" mark from the reference's top-left corner. */
export function Monogram({ className = "", size = 40 }: { className?: string; size?: number }) {
  const { left, right } = wedding.monogram;
  return (
    <span
      aria-label={`${wedding.bride.name} and ${wedding.groom.name}`}
      className={`relative inline-block font-serif leading-none ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="absolute top-0 left-0" style={{ fontSize: size * 0.55 }}>
        {left}
      </span>
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 h-px origin-center -translate-x-1/2 -rotate-[60deg] bg-current opacity-70"
        style={{ width: size * 0.75 }}
      />
      <span className="absolute right-0 bottom-0" style={{ fontSize: size * 0.55 }}>
        {right}
      </span>
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

const PETAL = "M0 0 C -14 -10 -16 -34 0 -46 C 16 -34 14 -10 0 0 Z";

// pathLength={1} on every stroke lets the CSS draw any of them in with the
// same dash values, whatever its real length.
function Bloom({ x, y, r = 1, rotate = 0 }: { x: number; y: number; r?: number; rotate?: number }) {
  return (
    <g className="d2" transform={`translate(${x} ${y}) rotate(${rotate}) scale(${r})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} pathLength={1} d={PETAL} transform={`rotate(${a})`} />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <path key={a} pathLength={1} d={PETAL} transform={`rotate(${a}) scale(0.62)`} />
      ))}
      <circle pathLength={1} r="5" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          pathLength={1}
          r="1.2"
          cx={Math.round(Math.cos((a * Math.PI) / 180) * 900) / 100}
          cy={Math.round(Math.sin((a * Math.PI) / 180) * 900) / 100}
        />
      ))}
    </g>
  );
}

function Leaf({ x, y, rotate, s = 1 }: { x: number; y: number; rotate: number; s?: number }) {
  return (
    <g className="d1 leaf" transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <path pathLength={1} d="M0 0 C 10 -8 30 -8 44 0 C 30 8 10 8 0 0 Z" />
      <path pathLength={1} d="M2 0 L 40 0" />
    </g>
  );
}

/**
 * Gold line-art florals, drawn rather than shipped as images so they stay
 * sharp at any size and take their colour from the surrounding text. They
 * draw themselves in when they scroll into view, then sway.
 */
export function FloralSpray({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      data-inview
      viewBox="0 0 260 220"
      aria-hidden
      className={`draw sway ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      {/* The mirror lives inside the SVG so the sway can own the element's transform. */}
      <g transform={flip ? "translate(260 0) scale(-1 1)" : undefined}>
        <path pathLength={1} d="M10 210 C 60 170 100 140 150 110 C 180 92 205 70 220 40" />
        <path pathLength={1} d="M120 128 C 112 100 116 80 128 62" />
        <path pathLength={1} d="M170 96 C 190 100 210 112 222 130" />
        <Leaf x={60} y={172} rotate={-60} />
        <Leaf x={90} y={150} rotate={20} s={0.9} />
        <Leaf x={140} y={116} rotate={-75} s={0.8} />
        <Leaf x={190} y={80} rotate={10} s={0.7} />
        <Bloom x={128} y={58} r={0.9} rotate={-10} />
        <Bloom x={222} y={36} r={0.65} rotate={20} />
        <Bloom x={224} y={134} r={0.55} rotate={40} />
        <circle className="d2" pathLength={1} cx="40" cy="190" r="1.6" />
        <circle className="d2" pathLength={1} cx="200" cy="160" r="1.2" />
      </g>
    </svg>
  );
}
