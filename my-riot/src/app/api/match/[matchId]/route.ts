import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { matchId: string } }
) {
  const { matchId } = await context.params;
  const apiKey = process.env.RIOT_API_KEY;
  const region = "asia";

  if (!apiKey) {
    return NextResponse.json(
      { error: "❌ Riot API Key가 없습니다." },
      { status: 500 }
    );
  }

  if (!matchId) {
    return NextResponse.json(
      { error: "❌ matchId가 필요합니다." },
      { status: 400 }
    );
  }

  const matchUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`;

  try {
    const res = await fetch(matchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://developer.riotgames.com",
        "X-Riot-Token": apiKey,
      },
    });

    if (!res.ok) {
      console.error(`❌ Riot API 호출 실패: ${res.status}`);
      return NextResponse.json(
        { error: "❌ Riot API 호출 실패" },
        { status: res.status }
      );
    }

    const matchData = await res.json();

    return NextResponse.json(matchData);
  } catch (error) {
    console.error("❌ 서버 오류 발생:", error);
    return NextResponse.json({ error: "❌ 서버 오류 발생" }, { status: 500 });
  }
}
