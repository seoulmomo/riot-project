import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const versionUrl = "https://ddragon.leagueoflegends.com/api/versions.json";

  try {
    const res = await fetch(versionUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Riot API 호출 실패" },
        { status: 500 }
      );
    }

    const versions = await res.json();
    const latestVersion = versions[0];

    return NextResponse.json({ latestVersion });
  } catch (error) {
    console.error("❌ 버전 정보 가져오기 실패:", error);
    return NextResponse.json({ error: "❌ 서버 오류 발생" }, { status: 500 });
  }
}
