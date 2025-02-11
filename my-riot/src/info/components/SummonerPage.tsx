// components/SummonerPage.tsx
// 검색 결과 화면
import React from "react";
import { FullSummonerData } from "../lib/riot";

interface SummonerPageProps {
  summonerData: FullSummonerData | null;
}

export default function SummonerPage({ summonerData }: SummonerPageProps) {
  return (
    <div>
      <h1>소환사 Data</h1>
      {summonerData ? (
        <div>
          <pre>{JSON.stringify(summonerData, null, 2)}</pre>


          {/* ✅ 리그 정보 표시 */}
          <h2>리그 정보</h2>
          {summonerData.leagueEntries &&
          summonerData.leagueEntries.length > 0 ? (
            summonerData.leagueEntries.map((entry, index) => (
              <div key={index}>
                <p>큐 타입: {entry.queueType}</p>
                <p>
                  티어: {entry.tier} {entry.rank}
                </p>
                <p>리그 포인트: {entry.leaguePoints} LP</p>
                <p>
                  승/패: {entry.wins}승 {entry.losses}패
                </p>
              </div>
            ))
          ) : (
            <p>리그 정보가 없습니다.</p>
          )}
        </div>
      ) : (
        <p>데이터를 가져오지 못했습니다.</p>
      )}
    </div>
  );
}
