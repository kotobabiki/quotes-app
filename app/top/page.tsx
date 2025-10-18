export const dynamic = "force-dynamic";

import { listTop } from "@/lib/api";

type Quote = {
  id: string; text: string; author_name?: string; url?: string;
  user_name: string; created_at: string; likes: number;
};

export default async function Top() {
  const res = (await listTop(50)) as { ok: boolean; data: Quote[] };
  const quotes = res.data ?? [];
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">いいねTOP50</h1>
      <ol className="space-y-4">
        {quotes.map((q, i) => (
          <li key={q.id} className="border p-4 rounded-xl">
            <div className="text-sm text-gray-500 mb-1">#{i + 1} ♥{q.likes}</div>
            <p className="text-xl whitespace-pre-wrap">{q.text}</p>
            <p className="text-sm text-gray-600 mt-2">
              {q.author_name ? `引用元: ${q.author_name}　` : ""}
              投稿者: {q.user_name}　/　{new Date(q.created_at).toLocaleString("ja-JP")}
            </p>
          </li>
        ))}
      </ol>
    </main>
  );
}
