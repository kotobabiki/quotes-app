// app/page.tsx
import { listRecent } from "@/lib/api";
import QuoteCard from "@/app/components/QuoteCard";

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
  const res = (await listRecent(20)) as { ok: boolean; data: Quote[] };
  const quotes: Quote[] = res.data ?? [];

  return (
    <main className="max-w-2xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">名言一覧</h1>
        <nav className="flex gap-3 text-sm">
          <a className="underline" href="/submit">投稿する</a>
          <a className="underline" href="/top">TOP50</a>
        </nav>
      </header>

      {quotes.length === 0 ? (
        <p>まだ名言はありません。</p>
      ) : (
        <ul className="space-y-4">
          {quotes.map((q) => (
            <QuoteCard key={q.id} {...q} />
          ))}
        </ul>
      )}
    </main>
  );
}
