// app/submit/page.tsx
import QuoteForm from "@/components/quote-form";

export default function SubmitPage() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">名言を投稿</h1>
      <QuoteForm />
    </main>
  );
}
