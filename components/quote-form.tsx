"use client";

import { useState, useEffect } from "react";        // ← ここで useEffect を import
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Sparkles } from "lucide-react";


type FormData = {
  text: string;
  user_name: string;
  author_name?: string;
  url?: string;
  source?: string; // 補足（任意）
};

export default function QuoteForm() {
  const [formData, setFormData] = useState<FormData>({
    text: "",
    user_name: "",
    author_name: "",
    url: "",
    source: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.text.trim()) {
      setError("名言は必須です。");
      return;
    }
    setSending(true);
    try {
      // 既存の内部APIへ投げる（GAS鍵はサーバ側で付与）
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          text: formData.text,
          author_name: formData.author_name,
          source: formData.source,
          url: formData.url,
          user_name: formData.user_name,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "投稿に失敗しました");
      setDone(true);
      // 入力保持：投稿者名は簡易ログインの代わりに localStorage
      if (formData.user_name) localStorage.setItem("user_name", formData.user_name);
      setFormData((p) => ({ ...p, text: "" }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setSending(false);
    }
  };

  // 起動時に user_name を復元
  useEffect(() => {                                    // ← React.useEffect -> useEffect
    const u = localStorage.getItem("user_name") || "";
    if (u) setFormData((p) => ({ ...p, user_name: u }));
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="text" className="block text-base font-semibold">名言（必須）</label>
        <textarea
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          rows={5}
          className="w-full rounded-xl border-2 px-4 py-3 bg-white focus:outline-none focus:border-blue-500"
          placeholder="やってみせ、言って聞かせ、させてみせる。"
        />
      </div>

      <div>
        <label htmlFor="user_name" className="text-base font-semibold">あなたの名前（保存されます）</label>
        <Input id="user_name" name="user_name" value={formData.user_name} onChange={handleChange} placeholder="たかはし" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="author_name" className="text-base font-semibold">
            引用元（人・著作など） <span className="text-gray-500 text-sm">(任意)</span>
          </label>
          <Input id="author_name" name="author_name" value={formData.author_name} onChange={handleChange} placeholder="山本五十六" />
        </div>
        <div>
          <label htmlFor="url" className="text-base font-semibold">
            参考URL <span className="text-gray-500 text-sm">(任意)</span>
          </label>
          <Input id="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" />
        </div>
      </div>

      <div>
        <label htmlFor="source" className="text-base font-semibold">
          補足 <span className="text-gray-500 text-sm">(任意)</span>
        </label>
        <Input id="source" name="source" value={formData.source} onChange={handleChange} placeholder="書名など" />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {done && <p className="text-green-700">投稿しました！「最近の投稿」に反映されます。</p>}

      <div className="pt-2">
        <Button type="submit" size="lg" className="w-full font-bold hover:bg-gray-100" disabled={sending}>
          <Sparkles className="w-5 h-5 mr-2" />
          {sending ? "投稿中..." : "名言を投稿する"}
        </Button>
      </div>
    </form>
  );
}
