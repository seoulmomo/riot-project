import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const puuid = searchParams.get("puuid");
  const start = searchParams.get("start") || 0;
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "❌ 서버에 API Key가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  if (!puuid) {
    return NextResponse.json(
      { error: "❌ puuid가 필요합니다." },
      { status: 400 }
    );
  }
  const count = 10;
  const matchIdUrl = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;

  try {
    const response = await fetch(matchIdUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://developer.riotgames.com",
        "X-Riot-Token": apiKey,
      },
    });

    if (!response.ok) {
      console.error("❌ Riot API 호출 실패:", response.status);
      return NextResponse.json(
        { error: "❌ Riot API 호출 실패" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "❌ 서버에서 API 요청 중 오류 발생" },
      { status: 500 }
    );
  }
}
