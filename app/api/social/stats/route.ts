import { NextResponse } from "next/server";
import { getSocialStats } from "@/lib/server/socialStats";

export const revalidate = 3600;

export async function GET() {
  const stats = await getSocialStats();

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
