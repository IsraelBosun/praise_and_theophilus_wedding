"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Download, Eye, EyeOff, LogOut, RefreshCw, Search } from "lucide-react";
import { Monogram } from "./Ornaments";

type Rsvp = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  attending: boolean;
  guests: number;
  side: string | null;
  message: string | null;
};

type Session = { token: string; email: string; expiresAt: number };

const SESSION_KEY = "rsvp-admin-session";

const field =
  "w-full rounded-sm border border-tan/40 bg-paper px-4 py-3 font-serif text-[1rem] text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-gold-deep";

// Session storage only: closing the tab signs out, and nothing about it
// matters beyond convenience, so a blocked store just means signing in again.
function loadSession(): Session | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null") as Session | null;
    return s && s.expiresAt > Date.now() ? s : null;
  } catch {
    return null;
  }
}
function saveSession(s: Session | null) {
  try {
    if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/**
 * Theophilus's view of the replies. It signs in against Supabase Auth with an
 * email and password, then reads the rsvps table with that session; the
 * table's policy only returns rows to theophilusoni@gmail.com.
 */
export function AdminRsvps({ url, apiKey }: { url: string; apiKey: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Rsvp[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage only exists in the browser.
    setSession(loadSession());
    setReady(true);
  }, []);

  const signOut = useCallback(() => {
    saveSession(null);
    setSession(null);
    setRows(null);
  }, []);

  const load = useCallback(
    async (s: Session) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${url}/rest/v1/rsvps?select=*&order=created_at.desc`, {
          headers: { apikey: apiKey, Authorization: `Bearer ${s.token}` },
        });
        if (res.status === 401) return signOut();
        if (!res.ok) throw new Error(String(res.status));
        setRows(await res.json());
      } catch {
        setError("Couldn't load the replies. Check your connection and refresh.");
      } finally {
        setLoading(false);
      }
    },
    [url, apiKey, signOut],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching the list once signed in.
    if (session) load(session);
  }, [session, load]);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setError("");
    try {
      const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.access_token) {
        setError("That email and password don't match. Please try again.");
        return;
      }
      const s = { token: data.access_token, email: data.user?.email ?? email, expiresAt: Date.now() + data.expires_in * 1000 };
      saveSession(s);
      setSession(s);
      setPassword("");
      setShowPassword(false);
    } catch {
      setError("Couldn't reach the sign-in service. Check your connection.");
    } finally {
      setSigningIn(false);
    }
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (filter === "all" || r.attending === (filter === "yes")) &&
        (!q || [r.name, r.phone, r.side, r.message].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [rows, query, filter]);

  const totals = useMemo(() => {
    const all = rows ?? [];
    const yes = all.filter((r) => r.attending);
    return {
      replies: all.length,
      yes: yes.length,
      no: all.length - yes.length,
      people: yes.reduce((n, r) => n + r.guests, 0),
    };
  }, [rows]);

  const exportCsv = () => {
    const head = ["Received", "Name", "Phone", "Attending", "Guests", "Whose guest", "Message"];
    const lines = shown.map((r) =>
      [new Date(r.created_at).toISOString(), r.name, r.phone, r.attending ? "Yes" : "No", r.guests, r.side, r.message]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob([[head.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rsvps.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!ready) return <div className="min-h-screen bg-paper" />;

  if (!url || !apiKey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-6 text-center font-serif text-ink">
        <p>The RSVP list isn&apos;t connected yet. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="wash flex min-h-screen items-center justify-center px-6 py-16 text-center">
        <form onSubmit={signIn} className="w-full max-w-[340px] space-y-3">
          <Monogram size={44} className="text-gold-deep" />
          <h1 className="heading pt-4 text-[1.3rem] text-gold-deep">RSVP list</h1>
          <p className="pb-3 font-serif text-[1rem] italic text-ink-soft">Sign in to see who is coming.</p>
          <label className="block text-left">
            <span className="sr-only">Email</span>
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={field}
            />
          </label>
          <div className="relative text-left">
            <label>
              <span className="sr-only">Password</span>
              <input
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`${field} pr-12`}
              />
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-2 text-gold-deep transition-colors hover:bg-champagne"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.4} /> : <Eye size={18} strokeWidth={1.4} />}
            </button>
          </div>
          {error && (
            <p role="alert" className="font-serif text-[0.95rem] text-wine-soft">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={signingIn}
            className="eyebrow w-full rounded-sm bg-wine py-3.5 text-[0.65rem] text-paper transition-colors hover:bg-wine-soft disabled:opacity-70"
          >
            {signingIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper font-serif text-ink">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-3">
            <Monogram size={30} className="text-gold-deep" />
            <span className="eyebrow text-[0.6rem] text-ink-soft">RSVPs</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => load(session)}
              aria-label="Refresh"
              className="rounded-sm p-2 text-gold-deep transition-colors hover:bg-champagne"
            >
              <RefreshCw size={18} strokeWidth={1.4} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-sm px-2 py-2 text-[0.95rem] text-ink-soft transition-colors hover:bg-champagne hover:text-ink"
            >
              <LogOut size={16} strokeWidth={1.4} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Replies", value: totals.replies },
            { label: "Coming", value: totals.yes },
            { label: "People expected", value: totals.people },
            { label: "Can't make it", value: totals.no },
          ].map((t) => (
            <div key={t.label} className="rounded-sm border border-tan/30 bg-champagne/40 px-4 py-4">
              <dt className="eyebrow text-[0.55rem] text-ink-soft">{t.label}</dt>
              <dd className="mt-1 text-[2rem] leading-none font-medium text-gold-deep tabular-nums">{rows ? t.value : "–"}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search</span>
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gold" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search names, phones, messages"
              className={`${field} py-2.5 pl-9`}
            />
          </label>
          <div className="flex gap-1 rounded-sm border border-tan/40 p-1" role="group" aria-label="Filter">
            {(
              [
                ["all", "All"],
                ["yes", "Coming"],
                ["no", "Not coming"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                aria-pressed={filter === v}
                onClick={() => setFilter(v)}
                className={`rounded-sm px-3 py-1.5 text-[0.95rem] transition-colors ${
                  filter === v ? "bg-wine text-paper" : "text-ink-soft hover:bg-champagne"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!shown.length}
            className="flex items-center justify-center gap-2 rounded-sm border border-gold/50 px-4 py-2.5 text-[0.95rem] text-gold-deep transition-colors hover:bg-champagne disabled:opacity-50"
          >
            <Download size={16} strokeWidth={1.4} /> Export CSV
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-6 text-wine-soft">
            {error}
          </p>
        )}

        {rows && !shown.length && (
          <p className="mt-12 text-center text-[1.1rem] italic text-ink-soft">
            {rows.length ? "No replies match." : "No replies yet."}
          </p>
        )}

        {shown.length > 0 && (
          <>
            {/* Phones get cards; wider screens get a table. */}
            <ul className="mt-6 space-y-3 md:hidden">
              {shown.map((r) => (
                <li key={r.id} className="rounded-sm border border-tan/30 bg-paper px-4 py-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[1.15rem] font-semibold">{r.name}</p>
                    <Status r={r} />
                  </div>
                  <p className="mt-1 text-[0.95rem] text-ink-soft">
                    <a href={`tel:${r.phone}`} className="underline decoration-gold/50 underline-offset-4">
                      {r.phone}
                    </a>
                    {r.side && <> · {r.side === "Both" ? "Both sides" : `${r.side}'s guest`}</>}
                  </p>
                  {r.message && <p className="mt-2 text-[1rem] italic">&ldquo;{r.message}&rdquo;</p>}
                  <p className="mt-2 text-[0.8rem] text-ink-soft/80">{when(r.created_at)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 hidden overflow-x-auto rounded-sm border border-tan/30 md:block">
              <table className="w-full text-left text-[1rem]">
                <thead className="bg-champagne/50">
                  <tr className="eyebrow text-[0.55rem] text-ink-soft">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Reply</th>
                    <th className="px-4 py-3">Whose guest</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.id} className="border-t border-tan/20 align-top">
                      <td className="px-4 py-3 font-semibold">{r.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a href={`tel:${r.phone}`} className="underline decoration-gold/50 underline-offset-4">
                          {r.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <Status r={r} />
                      </td>
                      <td className="px-4 py-3">{r.side ?? "–"}</td>
                      <td className="max-w-[28ch] px-4 py-3 italic">{r.message ?? ""}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{when(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Status({ r }: { r: Rsvp }) {
  return r.attending ? (
    <span className="inline-block rounded-full bg-herbal/15 px-2.5 py-0.5 text-[0.9rem] whitespace-nowrap text-herbal-deep">
      Coming{r.guests > 1 ? ` · ${r.guests}` : ""}
    </span>
  ) : (
    <span className="inline-block rounded-full bg-tan/15 px-2.5 py-0.5 text-[0.9rem] whitespace-nowrap text-ink-soft">
      Not coming
    </span>
  );
}
