"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { wedding } from "@/lib/wedding";
import { Reveal } from "./Reveal";

const whatsapp = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

const field =
  "w-full appearance-none rounded-sm border border-tan/40 bg-paper px-4 py-3 font-serif text-[1rem] text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-gold-deep";

/**
 * There is no backend: the form composes a WhatsApp message to the chosen
 * contact, so every reply lands with Jude or Esther like the card asks.
 */
export function Rsvp() {
  const { rsvp, bride, groom } = wedding;
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState("1");
  const [contact, setContact] = useState(rsvp.phones[0].whatsapp);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const yes = attending === "yes";
    const message = yes
      ? `Hello! This is ${name}. I will joyfully attend the wedding of ${bride.name} & ${groom.name} on Saturday 5 December 2026. Number of guests: ${guests}.`
      : `Hello! This is ${name}. Sadly I will not be able to attend the wedding of ${bride.name} & ${groom.name}, but I am celebrating with you in spirit.`;
    window.open(whatsapp(contact, message), "_blank", "noopener");
  };

  return (
    <section id="rsvp" className="border-t border-gold/15 bg-champagne/35 px-8 py-20 text-center">
      <Reveal>
        <h2 className="font-serif text-[2.2rem] tracking-[0.08em] text-gold-deep">{rsvp.heading}</h2>
        <p className="mx-auto mt-3 max-w-[28ch] font-serif text-[1.05rem] text-ink">{rsvp.body}</p>

        <form onSubmit={submit} className="mx-auto mt-8 max-w-[320px] space-y-3 text-left">
          <label className="block">
            <span className="sr-only">Your name</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
          </label>

          <label className="relative block">
            <span className="sr-only">Will you be with us?</span>
            <select required value={attending} onChange={(e) => setAttending(e.target.value)} className={field}>
              <option value="" disabled>
                Will you be with us?
              </option>
              <option value="yes">Yes, joyfully</option>
              <option value="no">Sorry, I can&apos;t make it</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gold" size={16} />
          </label>

          {attending !== "no" && (
            <label className="relative block">
              <span className="sr-only">Number of guests</span>
              <select value={guests} onChange={(e) => setGuests(e.target.value)} className={field}>
                {["1", "2", "3", "4"].map((n) => (
                  <option key={n} value={n}>
                    {n === "1" ? "Just me" : `${n} guests`}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gold" size={16} />
            </label>
          )}

          <label className="relative block">
            <span className="sr-only">Send to</span>
            <select value={contact} onChange={(e) => setContact(e.target.value)} className={field}>
              {rsvp.phones.map((p) => (
                <option key={p.whatsapp} value={p.whatsapp}>
                  Send to {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gold" size={16} />
          </label>

          <button type="submit" className="shine shine-auto eyebrow w-full rounded-sm bg-wine py-3.5 text-[0.65rem] text-paper transition-colors hover:bg-wine-soft">
            Confirm via WhatsApp
          </button>
        </form>

        <div className="mt-10 space-y-1 font-serif text-[1rem] text-ink-soft">
          <p className="eyebrow mb-2 text-[0.6rem] text-herbal-deep">Or call</p>
          {rsvp.phones.map((p) => (
            <p key={p.whatsapp}>
              {p.name}:{" "}
              <a href={`tel:+${p.whatsapp}`} className="text-ink underline decoration-gold/50 underline-offset-4 hover:text-gold-deep">
                {p.display}
              </a>
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
