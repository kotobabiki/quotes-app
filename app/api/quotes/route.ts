// app/api/quotes/route.ts
export async function GET(req: Request) {
    const qs = new URL(req.url).searchParams;
    qs.set("key", process.env.GAS_API_KEY!);
    const r = await fetch(`${process.env.GAS_API_URL!}?${qs.toString()}`, { cache: "no-store" });
    return new Response(await r.text(), {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  export async function POST(req: Request) {
    const body = await req.json();
    const r = await fetch(process.env.GAS_API_URL!, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ key: process.env.GAS_API_KEY, ...body }),
    });
    return new Response(await r.text(), {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  