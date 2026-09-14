import { NextRequest, NextResponse } from "next/server";
import { getCachedTryHackMeStats, syncTryHackMeStats } from "@/lib/tryhackme";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getCachedTryHackMeStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {}

    const input = (body as any).url || (body as any).username || "jaishanth";
    const stats = await syncTryHackMeStats(input);

    return NextResponse.json({
      success: true,
      message: `Successfully crawled & synced TryHackMe metrics for ${stats.username}`,
      stats,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to crawl TryHackMe" },
      { status: 500 }
    );
  }
}
