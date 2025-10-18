

'use client';

import { useEffect, useState } from "react";
import { listRecent, likeQuote } from "@/lib/api";

type Quote = {
  id: string; text: string; author_name?: string; source?: string; url?: string;
  user_name: string; created_at: string; likes: number;
};

export default function RecentPage() {
  const [items, setItems] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = (await listRecent(50)) as { ok: boolean; data: Quote[] };
    setItems(res.data as Quote[]);
    setLoading(false);
  }
  
  useEffect(() => { load(); }, []);

  function likedKey(id:string){ return `liked:${id}`; }

  async function onLike(id: string) {
    if (localStorage.getItem(likedKey(id))) return;
    await likeQuote(id);
    localStorage.setItem(likedKey(id), "1");
    setItems(prev => prev.map(x => x.id===id ? {...x, likes:(x.likes||0)+1} : x));
  }

  function copy(t:string){ navigator.clipboard.writeText(t); }

  if (loading) return <div className="p-6">読み込み中…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">最近の投稿</h1>
      {items.map(q => (
        <div key={q.id} className="border rounded p-4 space-y-2">
          <p className="whitespace-pre-wrap text-lg">{q.text}</p>
          <div className="text-sm text-gray-600">
            {q.author_name && <span>引用元: {q.author_name}　</span>}
            {q.source && <span>補足: {q.source}　</span>}
            {q.url && <a className="underline" href={q.url} target="_blank">URL</a>}
          </div>
          <div className="text-xs text-gray-500">
            投稿者: {q.user_name}　/　{new Date(q.created_at).toLocaleString()}
          </div>
          <div className="flex gap-2">
            <button onClick={()=>copy(q.text)} className="px-3 py-1 border rounded">コピー</button>
            <button
              onClick={()=>onLike(q.id)}
              disabled={!!localStorage.getItem(likedKey(q.id))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              いいね（{q.likes || 0}）
            </button>
            <a className="px-3 py-1 border rounded"
               href={`https://twitter.com/intent/tweet?${new URLSearchParams({ text: q.text, url: q.url || "" })}`}
               target="_blank" rel="noopener noreferrer">
              Xで共有
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
