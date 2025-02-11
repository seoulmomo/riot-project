"use client"; // ✅ 클라이언트 컴포넌트 설정
import { useEffect, useState, use } from "react";
import SummonerPage from "@/info/components/SummonerPage";
import { FullSummonerData } from "@/info/lib/riot";

export default function SummonerDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ gameName: string }>;
}) {
  const params = use(paramsPromise);
  const [summonerData, setSummonerData] = useState<FullSummonerData | null>(
    null
  );

  const gameName = decodeURIComponent(params.gameName).split("-")[0];
  const tagLine = decodeURIComponent(params.gameName).split("-")[1];

  useEffect(() => {
    // ✅ localStorage에서 데이터 가져오기 (API 호출 없이 클라이언트에서 데이터 로드)
    const storedData = localStorage.getItem("summonerData");
    if (storedData) {
      setSummonerData(JSON.parse(storedData));
    }
  }, []);

  if (!tagLine) return <p>태그 정보가 없습니다.</p>;

  return (
    <div>
      <h1>
        {gameName}#{tagLine}님의 소환사 정보
      </h1>
      {summonerData ? (
        <SummonerPage summonerData={summonerData} />
      ) : (
        <p>데이터 로딩 중...</p>
      )}
    </div>
  );
}
