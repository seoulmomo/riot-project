import { NextRequest, NextResponse } from "next/server";
import {
  fetchFullSummonerData,
  FullSummonerData,
} from "../../../info/lib/riot";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "게임 닉네임과 태그를 입력하세요." },
      { status: 400 }
    );
  }

  const summonerData: FullSummonerData | null = await fetchFullSummonerData(
    gameName,
    tagLine
  );
  if (!summonerData) {
    return NextResponse.json(
      { error: "소환사를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(summonerData);
}
