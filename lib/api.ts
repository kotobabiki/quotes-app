// lib/api.ts
const originForServer =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

const BASE =
  typeof window === "undefined" ? `${originForServer}/api/quotes` : "/api/quotes";

// ---------- type guards ----------
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function isOkFalse(x: unknown): x is { ok: false; error?: string } {
  return isRecord(x) && x.ok === false;
}

// ---------- fetch wrapper ----------
const J = async <T>(p: Promise<Response>): Promise<T> => {
  const r = await p;
  const t = await r.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(t);
  } catch {
    parsed = undefined;
  }

  if (!r.ok) throw new Error(`HTTP ${r.status}: ${t}`);
  if (isOkFalse(parsed)) throw new Error(parsed.error || "GAS returned ok:false");

  return parsed as T;
};

// ---------- APIs ----------
export const listRecent = <T = unknown[]>(limit = 50) =>
  J<{ ok: boolean; data: T }>(
    fetch(`${BASE}?action=list_recent&limit=${limit}`, { cache: "no-store" })
  );

export const listTop = <T = unknown[]>(limit = 50) =>
  J<{ ok: boolean; data: T }>(
    fetch(`${BASE}?action=list_top&limit=${limit}`, { cache: "no-store" })
  );

export const listByUser = <T = unknown[]>(user_name: string) =>
  J<{ ok: boolean; data: T }>(
    fetch(
      `${BASE}?action=list_by_user&user=${encodeURIComponent(user_name)}`,
      { cache: "no-store" }
    )
  );

export const createQuote = (input: {
  text: string;
  author_name?: string;
  source?: string;
  url?: string;
  user_name: string;
}) =>
  J<{ ok: boolean; id: string }>(
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...input }),
    })
  );

export const likeQuote = (id: string) =>
  J<{ ok: boolean }>(
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like", id }),
    })
  );
