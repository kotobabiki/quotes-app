"use client";
import { useState, useEffect } from "react";
import { likeQuote } from "@/lib/api";

type Props = {
  id: string;
  text: string;
  author_name?: string;
  user_name: string;
  created_at: string;
  url?: string;
  likes: number;
};

export default function QuoteCard(p: Props) {
  const [likes, setLikes] = useState(p.likes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked:${p.id}`) === "1");
  }, [p.id]);

  const onLike = async () => {
    if (liked) return;
    try {
      await likeQuote(p.id);
      setLikes((v) => v + 1);
      setLiked(true);
      localStorage.setItem(`liked:${p.id}`, "1");
    } catch (e) {
      alert("いいねに失敗しました");
    }
  };

  const onCopy = async () => {
    const body = `${p.text}\n— ${p.author_name ?? ""}`;
    await navigator.clipboard.writeText(body.trim());
    alert("コピーしました");
  };

  const onShareX = () => {
    const t = encodeURIComponent(`${p.text}\n— ${p.author_name ?? ""}`);
    const u = p.url ? `&url=${encodeURIComponent(p.url)}` : "";
    window.open(`https://twitter.com/intent/tweet?text=${t}${u}`, "_blank");
  };

  return (
    <li className="border p-4 rounded-xl shadow-sm hover:shadow transition">
      <p className="text-xl whitespace-pre-wrap">{p.text}</p>
      <p className="text-sm text-gray-600 mt-2">
        {p.author_name ? `引用元: ${p.author_name}　` : ""}
        投稿者: {p.user_name}　/　{new Date(p.created_at).toLocaleString("ja-JP")}
      </p>
      {p.url && (
        <a className="text-sm underline" href={p.url} target="_blank" rel="noreferrer">
          参照URL
        </a>
      )}
      <div className="flex gap-3 mt-3">
        <button
          onClick={onLike}
          disabled={liked}
          className={`px-3 py-1 rounded border ${liked ? "opacity-50 cursor-default" : "hover:bg-gray-50"}`}
        >
          ♥ いいね {likes}
        </button>
        <button onClick={onCopy} className="px-3 py-1 rounded border hover:bg-gray-50">
          コピー
        </button>
        <button onClick={onShareX} className="px-3 py-1 rounded border hover:bg-gray-50">
          Xで共有
        </button>
      </div>
    </li>
  );
}
