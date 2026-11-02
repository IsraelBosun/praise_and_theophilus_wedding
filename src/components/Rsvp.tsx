"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { wedding } from "@/lib/wedding";
import { Reveal } from "./Reveal";

const whatsapp = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

const field =
  "w-full appearance-none rounded-sm border border-tan/40 bg-paper px-4 py-3 font-serif text-[1rem] text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-gold-deep";

type Status = "idle" | "sending" | "saved" | "failed";

/**
 * Replies are saved to Supabase through /api/rsvp. If that cannot be reached
 * (or is not set up yet), the guest is offered the same reply as a WhatsApp
 * message to Jude or Esther instead, so no answer is lost.
 */
export function Rsvp() {
  const { rsvp, bride, groom } = wedding;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState("1");
  const [side, setSide] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const yes = attending === "yes";

  const summary = [
    yes
      ? `Hello! This is ${name}. I will joyfully attend the wedding of ${bride.name} & ${groom.name} on Saturday 5 December 2026. Number of guests: ${guests}.`
      : `Hello! This is ${name}. Sadly I will not be able to attend the wedding of ${bride.name} & ${groom.name}, but I am celebrating with you in spirit.`,
    message.trim() ? `A word for the couple: ${message.trim()}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, attending, guests, side, message }),
      });
      setStatus(res.ok ? "saved" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const whatsappButtons = (
    <div className="mt-5 space-y-2">
      {rsvp.phones.map((p) => (
        <a
          key={p.whatsapp}
          href={whatsapp(p.whatsapp, summary)}
          target="_blank"
          rel="noopener"
          className="eyebrow block w-full rounded-sm border border-wine/40 py-3 text-center text-[0.6rem] text-wine transition-colors hover:bg-wine hover:text-paper"
        >
          Send to {p.name} on WhatsApp
        </a>
      ))}
    </div>
  );

  return (
    <section id="rsvp" className="border-t border-gold/15 bg-champagne/35 px-8 py-20 text-center">
      <Reveal>
        <h2 className="font-serif text-[2.2rem] tracking-[0.08em] text-gold-deep">{rsvp.heading}</h2>
        <p className="mx-auto mt-3 max-w-[28ch] font-serif text-[1.05rem] text-ink">{rsvp.body}</p>

        {status === "saved" || status === "failed" ? (
          <div role="status" className="mx-auto mt-8 max-w-[320px] font-serif text-[1.05rem] text-ink">
            {status === "saved" ? (
              <>
                <p className="text-[1.3rem] text-gold-deep">Thank you, {name.split(" ")[0]}!</p>
                <p className="mt-2">
                  {yes ? "Your reply is saved. We can't wait to celebrate with you." : "Your reply is saved. Thank you for letting us know."}
                </p>
              </>
            ) : (
              <p>We couldn&apos;t save your reply just now. Please send it on WhatsApp instead:</p>
            )}
            {status === "failed" && whatsappButtons}
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-5 text-[0.95rem] text-ink-soft underline decoration-gold/50 underline-offset-4 hover:text-gold-deep"
            >
              Change my reply
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 max-w-[320px] space-y-3 text-left">
            <label className="block">
              <span className="sr-only">Your name</span>
              <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
            </label>

            <label className="block">
              <span className="sr-only">Phone number</span>
              <input
                required
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className={field}
              />
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
              <span className="sr-only">Whose guest are you?</span>
              <select required value={side} onChange={(e) => setSide(e.target.value)} className={field}>
                <option value="" disabled>
                  Whose guest are you?
                </option>
                <option value={bride.name}>{bride.name}&apos;s family &amp; friends</option>
                <option value={groom.name}>{groom.name}&apos;s family &amp; friends</option>
                <option value="Both">Both</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gold" size={16} />
            </label>

            <label className="block">
              <span className="sr-only">A message for the couple (optional)</span>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A message for the couple (optional)"
                className={`${field} resize-none`}
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="shine shine-auto eyebrow w-full rounded-sm bg-wine py-3.5 text-[0.65rem] text-paper transition-colors hover:bg-wine-soft disabled:opacity-70"
            >
              {status === "sending" ? "Sending..." : "Send my reply"}
            </button>
          </form>
        )}

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
