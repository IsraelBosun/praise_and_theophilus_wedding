import type { ScheduleItem } from "@/lib/wedding";

/*
  Line-art icons for the order of the day, drawn in the same hand as the
  florals so they draw themselves in the same way (see `.draw` in
  globals.css). Every stroke carries pathLength={1} for that reason. Groups
  marked d1 and d2 draw second and third.
*/

/** Yoruba talking drum: hourglass body, tension cords, waist band and the hooked stick. */
function TalkingDrum() {
  return (
    <>
      <ellipse pathLength={1} cx="22" cy="9" rx="10" ry="2.8" />
      <ellipse pathLength={1} cx="22" cy="39" rx="10" ry="2.8" />
      <path pathLength={1} d="M12 9 C 12 17 18.5 20 18.5 24 C 18.5 28 12 31 12 39" />
      <path pathLength={1} d="M32 9 C 32 17 25.5 20 25.5 24 C 25.5 28 32 31 32 39" />
      <g className="d1">
        <path pathLength={1} d="M15 11.4 Q 21 24 15 36.6" />
        <path pathLength={1} d="M19 11.8 Q 22.4 24 19 36.2" />
        <path pathLength={1} d="M25 11.8 Q 21.6 24 25 36.2" />
        <path pathLength={1} d="M29 11.4 Q 23 24 29 36.6" />
        <ellipse pathLength={1} cx="22" cy="24" rx="4.2" ry="1.3" />
      </g>
      <g className="d2">
        <path pathLength={1} d="M33 5 C 40 1.5 46 5 44 12 C 43.4 14 41.6 14.6 40.6 13.4" />
        <circle pathLength={1} cx="14" cy="43.6" r="0.8" />
        <circle pathLength={1} cx="22" cy="44.4" r="0.8" />
        <circle pathLength={1} cx="30" cy="43.6" r="0.8" />
      </g>
    </>
  );
}

/** A small church: cross, steeple, tower with rose window, nave and an arched door. */
function Chapel() {
  return (
    <>
      <path pathLength={1} d="M6 44 H42" />
      <path pathLength={1} d="M18 44 V20 H30 V44" />
      <path pathLength={1} d="M17 20 L24 10 L31 20" />
      <g className="d1">
        <path pathLength={1} d="M18 30 L8 34 V44" />
        <path pathLength={1} d="M30 30 L40 34 V44" />
        <path pathLength={1} d="M21 44 V38.5 A3 3 0 0 1 27 38.5 V44" />
      </g>
      <g className="d2">
        <path pathLength={1} d="M24 10 V3" />
        <path pathLength={1} d="M21.5 5.3 H26.5" />
        <circle pathLength={1} cx="24" cy="26" r="2.4" />
        <path pathLength={1} d="M24 23.6 V28.4 M21.6 26 H26.4" />
        <path pathLength={1} d="M11 41 V38 A1.5 1.5 0 0 1 14 38 V41" />
        <path pathLength={1} d="M34 41 V38 A1.5 1.5 0 0 1 37 38 V41" />
      </g>
    </>
  );
}

function Flute({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path pathLength={1} d="M0 0 C 0 10 1.8 16 5 17 C 8.2 16 10 10 10 0 Z" />
      <path pathLength={1} d="M5 17 V29" />
      <path pathLength={1} d="M1 30 Q 5 28 9 30" />
      <g className="d1">
        <path pathLength={1} d="M0.6 5 H9.4" />
        <circle pathLength={1} cx="4" cy="9" r="0.6" />
        <circle pathLength={1} cx="6.2" cy="12" r="0.5" />
      </g>
    </g>
  );
}

/** Two champagne flutes meeting in a toast, with a sparkle where they touch. */
function Toast() {
  return (
    <>
      <Flute transform="translate(9 12) rotate(-16)" />
      <Flute transform="translate(27.5 9.2) rotate(16)" />
      <g className="d2">
        <path pathLength={1} d="M24 1.5 V7.5 M21 4.5 H27" />
        <path pathLength={1} d="M17 5 L18.5 7 M31 5 L29.5 7" />
        <circle pathLength={1} cx="14" cy="3" r="0.7" />
        <circle pathLength={1} cx="34" cy="3" r="0.7" />
      </g>
    </>
  );
}

const ICONS = { traditional: TalkingDrum, church: Chapel, reception: Toast };

export function ScheduleIcon({ name, className = "" }: { name: ScheduleItem["icon"]; className?: string }) {
  const Icon = ICONS[name];
  return (
    <svg
      data-inview
      viewBox="0 0 48 48"
      aria-hidden
      className={`draw ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Icon />
    </svg>
  );
}
