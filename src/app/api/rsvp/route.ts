/**
 * Saves an RSVP as a row in the Supabase `rsvps` table (supabase/rsvps.sql),
 * with SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY. The table's policy lets that
 * key insert only. Without them this answers 503 and the form falls back to
 * WhatsApp.
 */

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return Response.json({ ok: false, error: "not-configured" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const name = text(body?.name, 120);
  const phone = text(body?.phone, 30);
  if (!name || !phone || (body?.attending !== "yes" && body?.attending !== "no")) {
    return Response.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  const attending = body.attending === "yes";
  const guests = attending ? Math.min(Math.max(Number(body?.guests) || 1, 1), 4) : 0;
  const row = {
    name,
    phone,
    attending,
    guests,
    side: text(body?.side, 60) || null,
    message: text(body?.message, 1000) || null,
  };

  const res = await fetch(`${url}/rest/v1/rsvps`, {
    method: "POST",
    headers: {
      // sb_publishable_ keys are not JWTs, so they go in apikey alone, with no Authorization header.
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  }).catch((error: unknown) => {
    console.error("RSVP insert failed:", error);
    return null;
  });

  if (!res?.ok) {
    if (res) console.error("RSVP insert failed:", res.status, await res.text());
    return Response.json({ ok: false, error: "save-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
