// components/SummonerPage.tsx
import React, { useState, useEffect } from "react";
import { FullSummonerData, MatchDetails } from "../lib/riot";
import { getChampionImage } from "@/app/utils/api";

interface SummonerPageProps {
  summonerData: FullSummonerData | null;
}

// MatchDetails가 participants 속성을 포함한다고 가정
interface Match {
  participants: {
    championName: string;
    puuid: string;
    win: boolean;
    kda: { kills: number; deaths: number; assists: number };
    totalMinionsKilled: number;
    goldEarned: number;
  }[];
}

export default function SummonerPage({ summonerData }: SummonerPageProps) {
  const [matchDetails, setMatchDetails] = useState<{
    [key: string]: Match | null;
  }>({});
  const [championImg, setChampionImg] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!summonerData?.matchId) return;
    console.log(summonerData.matchId);

    async function fetchAllMatch() {
      try {
        const res = await fetch(
          `/api/match/batch?${(summonerData?.matchId ?? [])
            .map((id) => `matchId=${id}`)
            .join("&")}`
        );

        if (!res.ok) {
          console.error("매치 데이터 요청 실패:", res.status);
          return;
        }

        const matchDataMap: { [key: string]: Match } = await res.json();
        setMatchDetails(matchDataMap);

        const championImgMap: { [key: string]: string } = {};

        // ⚡ 비동기 로직 개선
        await Promise.all(
          Object.values(matchDataMap)
            .flatMap((match) => match?.participants ?? []) // participants가 없으면 빈 배열 반환
            .map(async (player) => {
              if (player.championName && !championImgMap[player.championName]) {
                championImgMap[player.championName] = await getChampionImage(
                  player.championName
                );
              }
            })
        );

        setChampionImg(championImgMap);
      } catch (error) {
        console.error("매치 데이터 가져오는 중 오류 발생:", error);
      }
    }

    fetchAllMatch();
  }, [summonerData]);

  return (
    <div className="container mx-auto p-4 md:max-w-2xl lg:max-w-4xl">
      <h1 className="text-xl md:text-2xl">소환사 Data</h1>
      {summonerData ? (
        <div>
          <h2>최근 매치 기록</h2>
          {(summonerData.matchId ?? []).length > 0 ? (
            <div className="space-y-4">
              {(summonerData.matchId ?? []).map((matchId, index) => {
                const match = matchDetails[matchId];
                if (!match) return null;

                const player = match.participants.find(
                  (p) => p.puuid === summonerData.puuid
                );
                if (!player) return null;

                return (
                  <div
                    key={index}
                    className={`p-4 shadow-md border ${
                      player.win ? "bg-blue-100" : "bg-red-100"
                    }`}
                  >
                    <div className="flex items-center space-x-5">
                      <div className="relative w-8 h-8 md:w-16 md:h-16 overflow-hidden">
                        <img
                          src={championImg[player.championName]}
                          alt={player.championName}
                          className="absolute w-full h-full"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-lg md:text-xl font-bold">
                          {player.championName}
                        </p>
                        <p className="text-sm md:text-base">
                          {player.kda.kills} / {player.kda.deaths} /{" "}
                          {player.kda.assists} (
                          {(
                            (player.kda.kills + player.kda.assists) /
                            Math.max(1, player.kda.deaths)
                          ).toFixed(2)}{" "}
                          KDA)
                        </p>
                        <p className="text-sm md:text-base">
                          CS: {player.totalMinionsKilled} | 골드:{" "}
                          {player.goldEarned}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>매치 기록이 없습니다.</p>
          )}
        </div>
      ) : (
        <p>데이터를 가져오지 못했습니다.</p>
      )}
    </div>
  );
}
