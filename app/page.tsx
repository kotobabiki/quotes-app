// app/page.tsx
import { listRecent } from "@/lib/api";

export default async function Home() {
  const data = await listRecent(10); // 最新10件を取得
  const quotes = data.data || [];

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">名言一覧</h1>

      {quotes.length === 0 ? (
        <p>まだ名言はありません。</p>
      ) : (
        <ul className="space-y-4">
          {quotes.map((q: any) => (
            <li key={q.id} className="border p-3 rounded">
              <p className="text-lg">{q.text}</p>
              <p className="text-sm text-gray-600">
                by {q.author_name}（投稿者：{q.user_name}）
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
