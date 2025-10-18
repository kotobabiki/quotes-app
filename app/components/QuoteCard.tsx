"use client";
import { useEffect, useMemo, useState } from "react";
import { likeQuote } from "@/lib/api";

type Props = {
  id: string;
  text: string;
  author_name?: string;
  user_name: string;
  created_at: string;
  url?: string;
  likes: number;
  source?: string; // もし型に無ければ消してOK
};

export default function QuoteCard(p: Props) {
  const [likes, setLikes] = useState(p.likes);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);     // 連打ガード
  const [copied, setCopied] = useState(false); // トースト

  const likeKey = useMemo(() => `liked:${p.id}`, [p.id]);

  useEffect(() => {
    setLiked(typeof window !== "undefined" && localStorage.getItem(likeKey) === "1");
  }, [likeKey]);

  const onLike = async () => {
    if (liked || busy) return;
    setBusy(true);

    // 楽観的更新
    setLiked(true);
    setLikes(v => v + 1);
    const prev = likes;
    try {
      await likeQuote(p.id);
      localStorage.setItem(likeKey, "1");
    } catch {
      // ロールバック
      setLiked(false);
      setLikes(prev);
      console.error("failed to like");
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    const body =
      `${p.text}\n` +
      (p.author_name ? `— ${p.author_name}\n` : "") +
      (p.source ? `出典: ${p.source}\n` : "");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(body.trim());
      } else {
        // 古いiOS等のフォールバック
        const ta = document.createElement("textarea");
        ta.value = body.trim();
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const onShareX = () => {
    const text =
      `${p.text}\n` +
      (p.author_name ? `— ${p.author_name}\n` : "") +
      (p.source ? `出典: ${p.source}\n` : "");
    const withTags = `${text}#名言`;
    const qs = new URLSearchParams({ text: withTags });
    if (p.url) qs.set("url", p.url);
    const shareUrl = `https://twitter.com/intent/tweet?${qs.toString()}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <li className="border p-4 rounded-xl shadow-sm hover:shadow transition">
      <p className="text-xl whitespace-pre-wrap">{p.text}</p>

      <p className="text-sm text-gray-600 mt-2">
        {p.author_name ? `引用元: ${p.author_name}　` : ""}
        投稿者: {p.user_name}　/　{new Date(p.created_at).toLocaleString("ja-JP")}
      </p>

      {p.url && (
        <a
          className="text-sm underline inline-block mt-1"
          href={p.url}
          target="_blank"
          rel="noreferrer"
        >
          参照URL
        </a>
      )}

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={onLike}
          disabled={liked || busy}
          aria-disabled={liked || busy}
          className={`px-3 py-1 rounded border transition ${
            liked ? "opacity-50 cursor-default" : "hover:bg-gray-50"
          }`}
        >
          ♥ いいね {likes}
        </button>

        <button onClick={onCopy} className="px-3 py-1 rounded border hover:bg-gray-50">
          コピー
        </button>

        <button onClick={onShareX} className="px-3 py-1 rounded border hover:bg-gray-50">
          Xで共有
        </button>

        {/* ミニ・トースト */}
        {copied && <span className="text-sm text-green-600">コピーしました</span>}
      </div>
    </li>
  );
}
