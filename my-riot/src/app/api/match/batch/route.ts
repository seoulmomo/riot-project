// /api/match/batch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchMatchDetails } from "@/info/lib/riot";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matchIds = searchParams.getAll("matchId");
  if (matchIds.length === 0)
    return NextResponse.json(
      { error: "❌ matchId가 필요합니다." },
      { status: 400 }
    );

  try {
    const matchDataMap: { [key: string]: any } = {};

    await Promise.all(
      matchIds.map(async (matchId) => {
        const matchData = await fetchMatchDetails(matchId);
        matchDataMap[matchId] = matchData;
        await new Promise((resolve) => setTimeout(resolve, 500));
      })
    );
    return NextResponse.json(matchDataMap);
  } catch (error) {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
