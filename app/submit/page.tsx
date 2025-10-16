/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from "react";
import { createQuote } from "@/lib/api";

export default function SubmitPage() {
  const [text, setText] = useState("");
  const [userName, setUserName] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => { setUserName(localStorage.getItem("user_name") || ""); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return setMsg("名言テキストは必須です");
    if (!userName.trim()) return setMsg("あなたの名前を入れてね");

    try {
      setSaving(true); setMsg(null);
      await createQuote({ text, author_name: author, source, url, user_name: userName });
      localStorage.setItem("user_name", userName);
      setText(""); setAuthor(""); setSource(""); setUrl("");
      setMsg("投稿しました！");
    } catch (e:any) {
      setMsg("投稿に失敗しました：" + e.message);
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">名言を投稿</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">名言（必須）</span>
          <textarea className="w-full border rounded p-2 mt-1" rows={5}
            value={text} onChange={e=>setText(e.target.value)} placeholder="やってみせ、言って聞かせ、させてみせる。" />
        </label>

        <label className="block">
          <span className="text-sm">あなたの名前（保存されます）</span>
          <input className="w-full border rounded p-2 mt-1" value={userName}
            onChange={e=>setUserName(e.target.value)} placeholder="たかはし" />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">引用元（人・著作など）</span>
            <input className="w-full border rounded p-2 mt-1" value={author}
              onChange={e=>setAuthor(e.target.value)} placeholder="山本五十六" />
          </label>
          <label className="block">
            <span className="text-sm">URL（任意）</span>
            <input className="w-full border rounded p-2 mt-1" value={url}
              onChange={e=>setUrl(e.target.value)} placeholder="https://..." />
          </label>
        </div>

        <label className="block">
          <span className="text-sm">補足（任意）</span>
          <input className="w-full border rounded p-2 mt-1" value={source}
            onChange={e=>setSource(e.target.value)} placeholder="書名など" />
        </label>

        <button disabled={saving} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          {saving ? "送信中..." : "投稿する"}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
