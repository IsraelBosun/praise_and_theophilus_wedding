import { wedding } from "@/lib/wedding";
import { FloralSpray } from "./Ornaments";
import { Reveal } from "./Reveal";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/**
 * The month as weeks of day numbers, Monday first, with nulls for the blank
 * cells. Built from UTC so it is identical on the server and in any browser.
 */
function monthGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const offset = (first + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function SaveTheDate() {
  const { year, month, day } = wedding.calendar;
  const cells = monthGrid(year, month);

  return (
    <section id="date" className="wash relative overflow-hidden border-t border-gold/15 px-8 pt-16 pb-20 text-center">
      <FloralSpray className="absolute -top-2 -left-12 w-48 text-gold/40" flip />
      <Reveal>
        <p className="font-script text-[5rem] leading-none text-gold-deep">Save</p>
        <p className="heading -mt-1 text-[0.95rem] text-gold-deep">our date</p>
        <p className="mt-5 font-serif text-[1.6rem] tracking-[0.1em] text-ink">{wedding.dateStamp}</p>

        <div className="mx-auto mt-8 max-w-[300px] border border-gold/50 bg-champagne/30 p-5">
          <p className="heading text-[0.8rem] text-ink">
            {MONTHS[month - 1]} {year}
          </p>
          <div className="mt-4 grid grid-cols-7 gap-y-2 text-[0.85rem] text-ink-soft">
            {WEEKDAYS.map((d) => (
              <span key={d} className="eyebrow text-[0.55rem] tracking-[0.1em] text-herbal-deep">
                {d}
              </span>
            ))}
            {cells.map((n, i) =>
              n === day ? (
                <span key={i} className="pop-day mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-wine font-semibold text-paper">
                  {n}
                </span>
              ) : (
                <span key={i} className="flex h-7 items-center justify-center">
                  {n ?? ""}
                </span>
              ),
            )}
          </div>
          <p className="mt-4 font-serif text-[0.85rem] italic text-ink-soft">Saturday, the wedding day</p>
        </div>
      </Reveal>
    </section>
  );
}
