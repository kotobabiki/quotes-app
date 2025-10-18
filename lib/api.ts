// lib/api.ts（差分は j の型と type guard）
const originForServer =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

const BASE =
  typeof window === "undefined" ? `${originForServer}/api/quotes` : "/api/quotes";

function isOkFalse(x: unknown): x is { ok: false; error?: string } {
  if (typeof x !== "object" || x === null) return false;
  const rec = x as Record<string, unknown>;
  return rec.ok === false;
}

// lib/api.ts
const J = async <T = unknown>(p: Promise<Response>): Promise<T> => {
    const r = await p;
    const t = await r.text();
    let j: unknown;
    try { j = JSON.parse(t); } catch {}
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${t}`);
    if (isOkFalse(j)) throw new Error((j as any).error || "GAS returned ok:false");
    return j as T;
  };
  

export const listRecent = (limit = 50) =>
  J(fetch(`${BASE}?action=list_recent&limit=${limit}`, { cache: "no-store" }));

export const listTop = (limit = 50) =>
  J(fetch(`${BASE}?action=list_top&limit=${limit}`, { cache: "no-store" }));

export const listByUser = (user_name: string) =>
  J(
    fetch(`${BASE}?action=list_by_user&user=${encodeURIComponent(user_name)}`, {
      cache: "no-store",
    }),
  );

export const createQuote = (input: {
  text: string;
  author_name?: string;
  source?: string;
  url?: string;
  user_name: string;
}) =>
  J(
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...input }),
    }),
  );

export const likeQuote = (id: string) =>
  J(
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like", id }),
    }),
  );
