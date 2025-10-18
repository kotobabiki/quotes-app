// app/page.tsx
export const dynamic = "force-dynamic"; // ビルド時fetchを回避

export default async function Home() {
  try {
    // ここで API 叩く（失敗してもcatchへ）
    return (
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">ようこそ</h1>
        <p className="mb-4">最近の投稿は <a className="underline" href="/recent">/recent</a> へ</p>
      </main>
    );
  } catch {
    // 失敗しても 500 にしない
    return (
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">ようこそ</h1>
        <p className="text-red-600 mb-4">トップの読み込みに失敗しました。</p>
        <a className="underline" href="/recent">最近の投稿を見る</a>
      </main>
    );
  }
}
