// app/page.tsx
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/recent");
}
