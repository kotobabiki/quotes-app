// lib/api.ts
// サーバー: https://<vercel-url>/api/quotes
// ブラウザ: /api/quotes
const originForServer =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

const BASE = typeof window === "undefined"
  ? `${originForServer}/api/quotes`
  : "/api/quotes";

const J = async (p: Promise<Response>) => {
  const r = await p;
  const t = await r.text();
  let j: any; try { j = JSON.parse(t); } catch {}
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${t}`);
  if (j?.ok === false) throw new Error(j.error || "GAS returned ok:false");
  return j ?? t;
};

export const listRecent = (limit=50) =>
  J(fetch(`${BASE}?action=list_recent&limit=${limit}`, { cache:"no-store" }));

export const listTop = (limit=50) =>
  J(fetch(`${BASE}?action=list_top&limit=${limit}`, { cache:"no-store" }));

export const listByUser = (user_name: string) =>
  J(fetch(`${BASE}?action=list_by_user&user=${encodeURIComponent(user_name)}`, { cache:"no-store" }));

export const createQuote = (input: {
  text: string; author_name?: string; source?: string; url?: string; user_name: string;
}) =>
  J(fetch(BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", ...input }) }));

export const likeQuote = (id: string) =>
  J(fetch(BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "like", id }) }));
