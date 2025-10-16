// app/page.tsx
import { listRecent } from "@/lib/api";

type Quote = {
  id: string;
  text: string;
  author_name?: string;
  source?: string;
  url?: string;
  user_name: string;
  created_at: string;
  likes: number;
};

export default async function Home() {
  const res = (await listRecent(10)) as { ok: boolean; data: Quote[] };
  const quotes: Quote[] = res.data ?? [];

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">名言一覧</h1>

      {quotes.length === 0 ? (
        <p>まだ名言はありません。</p>
      ) : (
        <ul className="space-y-4">
          {quotes.map((q) => (
            <li key={q.id} className="border p-3 rounded">
              <p className="text-lg whitespace-pre-wrap">{q.text}</p>
              <p className="text-sm text-gray-600">
                {q.author_name ? `引用元: ${q.author_name}　` : ""}
                投稿者: {q.user_name}　/　
                {new Date(q.created_at).toLocaleString("ja-JP")}
              </p>
              {q.url && (
                <a className="text-sm underline" href={q.url} target="_blank">
                  URL
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
