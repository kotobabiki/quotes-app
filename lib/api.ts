// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL!;
const KEY  = process.env.NEXT_PUBLIC_API_KEY!;

// fetch の Promise を受け取り、中で await して共通処理
const J = async (p: Promise<Response>) => {
  const r = await p;
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};

// 一覧
export const listRecent = (limit = 50) =>
  J(fetch(`${BASE}?action=list_recent&limit=${limit}&key=${KEY}`, { cache: "no-store" }));

export const listTop = (limit = 50) =>
  J(fetch(`${BASE}?action=list_top&limit=${limit}&key=${KEY}`, { cache: "no-store" }));

export const listByUser = (user_name: string) =>
  J(fetch(`${BASE}?action=list_by_user&user=${encodeURIComponent(user_name)}&key=${KEY}`, { cache: "no-store" }));

// 投稿（create）が抜けていたので追加
export const createQuote = (input: {
  text: string;
  author_name?: string;
  source?: string;
  url?: string;
  user_name: string;
}) =>
  J(fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "text/plain" }, // GASはtext/plainが安定
    body: JSON.stringify({ key: KEY, action: "create", ...input }),
  }));

// いいね
export const likeQuote = (id: string) =>
  J(fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ key: KEY, action: "like", id }),
  }));

// サンプル：最近5件（任意）
export const listQuotes = () =>
  J(fetch(`${BASE}?action=list_recent&limit=5&key=${KEY}`, { cache: "no-store" }));
