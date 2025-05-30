"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FullSummonerData, fetchMatchId } from "../info/lib/riot";
import { getChampionImage, getItemData } from "@/app/utils/api";
import LeagueInfo from "./LeagueInfo";
import MatchCard from "./MatchCard";

interface SummonerPageProps {
  summonerData: FullSummonerData | null;
}

export interface Match {
  queueId: number;
  participants: {
    championName: string;
    puuid: string;
    win: boolean;
    kda: { kills: number; deaths: number; assists: number };
    summonerSpells: { summoner1Id: number; summoner2Id: number };
    totalMinionsKilled: number;
    goldEarned: number;
    items: {
      item0: number;
      item1: number;
      item2: number;
      item3: number;
      item4: number;
      item5: number;
      item6: number;
    };
  }[];
}

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: 1080px) {
    width: 1080px;
    flex-direction: row;
  }
  gap: 0.5rem;
`;

const MatchContainer = styled.div`
  width: 100%;
  @media (min-width: 1080px) {
    flex: 1;
  }
  margin-top: 16px;
`;

const ClickMoreListBtn = styled.button`
  width: 100%;
  padding: 10px 0px;
`;

export default function SummonerPage({ summonerData }: SummonerPageProps) {
  const [matchDetails, setMatchDetails] = useState<{
    [key: string]: Match | null;
  }>({});
  const [championImg, setChampionImg] = useState<{ [key: string]: string }>({});
  const [itemImg, setItemImg] = useState<{ [key: number]: string }>({});
  const [soloRankTier, setSoloRankTier] = useState("");
  const [soloRankPoint, setSoloRankPoint] = useState(0);
  const [soloRankWins, setSoloRankWins] = useState(0);
  const [soloRankLoses, setSoloRankLoses] = useState(0);
  const [start, setStart] = useState(0); // 🔹 현재 불러온 매치 개수 (스크롤 시 증가)
  const [loading, setLoading] = useState(false);
  const [hasMoreMatches, setHasMoreMatches] = useState(true); // 🔹 추가 매치가 있는지 확인
  const [playerChampion, setPlayerChampion] = useState<
    {
      championName: string;
      count: number;
      win: number;
      defeat: number;
      kills: number;
      deaths: number;
      assists: number;
      imageUrl: string;
    }[]
  >([]);

  const tierImgUrl = `/tier-icons/Rank=${soloRankTier}.png`;

  useEffect(() => {
    if (!summonerData?.matchId) return;
    const soloRank = summonerData?.leagueEntries?.find(
      (entry) => entry.queueType === "RANKED_SOLO_5x5"
    );

    setSoloRankTier(soloRank?.tier ?? "");
    setSoloRankPoint(soloRank?.leaguePoints ?? 0);
    setSoloRankWins(soloRank?.wins ?? 0);
    setSoloRankLoses(soloRank?.losses ?? 0);

    async function fetchAllMatch() {
      if (loading || !hasMoreMatches) return;
      setLoading(true);
      try {
        const matchIds = await fetchMatchId(summonerData?.puuid ?? "", start);

        if (!matchIds || matchIds.length === 0) {
          setHasMoreMatches(false); // 🔹 더 이상 불러올 데이터 없음
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/match/batch?${(matchIds ?? [])
            .map((id) => `matchId=${id}`)
            .join("&")}`
        );

        if (!res.ok) {
          console.error("매치 데이터 요청 실패:", res.status);
          return;
        }

        const matchDataMap: { [key: string]: Match } = await res.json();
        setMatchDetails((prev) => ({ ...prev, ...matchDataMap })); // ✅ 기존 데이터 유지하며 추가

        // 챔피언 이미지
        const championImgMap: { [key: string]: string } = {};
        await Promise.all(
          Object.values(matchDataMap)
            .flatMap((match) => match?.participants ?? [])
            .map(async (player) => {
              if (player.championName && !championImgMap[player.championName]) {
                championImgMap[player.championName] = await getChampionImage(
                  player.championName
                );
              }
            })
        );
        setChampionImg((prev) => ({ ...prev, ...championImgMap }));

        // 아이템 이미지
        const itemData = await getItemData();
        const itemImgMap: { [key: number]: string } = {};
        Object.keys(itemData.data).forEach((itemId) => {
          itemImgMap[
            parseInt(itemId)
          ] = `https://ddragon.leagueoflegends.com/cdn/${itemData.version}/img/item/${itemId}.png`;
        });
        setItemImg(itemImgMap);
      } catch (error) {
        console.error("매치 데이터 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllMatch();
  }, [summonerData, start]);

  function clickMoreList() {
    if (!loading) {
      setStart((prev) => prev + 10);
    }
  }

  useEffect(() => {
    async function summonerRankData(matchDetails: {
      [key: string]: Match | null;
    }) {
      const playerChampionStat: Array<{
        championName: string;
        count: number;
        win: number;
        defeat: number;
        kills: number;
        deaths: number;
        assists: number;
        imageUrl: string;
      }> = [];

      Object.values(matchDetails).forEach((match) => {
        if (!match) return null;
        const player = match?.participants.find(
          (p) => p.puuid === summonerData?.puuid
        );
        if (player) {
          const existingChampion = playerChampionStat.find(
            (champion) => champion.championName === player.championName
          );
          if (existingChampion) {
            // 기존 챔피언이 있으면 count 증가, 승리 여부 반영
            existingChampion.count++;
            existingChampion.kills += player.kda.kills;
            existingChampion.deaths += player.kda.deaths;
            existingChampion.assists += player.kda.assists;
            player.win ? existingChampion.win++ : existingChampion.defeat++;
          } else {
            // 기존 챔피언이 없으면 새로 추가
            playerChampionStat.push({
              championName: player.championName,
              count: 1,
              win: player.win ? 1 : 0,
              defeat: player.win ? 0 : 1,
              kills: player.kda.kills,
              deaths: player.kda.deaths,
              assists: player.kda.assists,
              imageUrl: "",
            });
          }
        }
      });
      const updatedPlayerChampion = await Promise.all(
        playerChampionStat.map(async (champion) => ({
          ...champion,
          imageUrl: await getChampionImage(champion.championName),
        }))
      );
      setPlayerChampion(updatedPlayerChampion);
    }
    summonerRankData(matchDetails);
  }, [matchDetails]);

  return (
    <>
      <Container>
        <LeagueInfo
          tierImgUrl={tierImgUrl}
          soloRankTier={soloRankTier}
          soloRankPoint={soloRankPoint}
          soloRankWins={soloRankWins}
          soloRankLoses={soloRankLoses}
          playerChampion={playerChampion}
        />
        {/* <div>{playerCh}</div> */}
        <MatchContainer>
          {Object.values(matchDetails).length ? (
            Object.values(matchDetails).map((match, index) => {
              if (!match) return null;
              const player = match.participants.find(
                (p) => p.puuid === summonerData?.puuid
              );

              if (!player) return null;

              return (
                <MatchCard
                  key={index}
                  player={player}
                  championImg={championImg}
                  itemImg={itemImg}
                  queueId={match.queueId}
                />
              );
            })
          ) : (
            <p>매치 기록이 없습니다.</p>
          )}
          <ClickMoreListBtn
            onClick={clickMoreList}
            disabled={loading || !hasMoreMatches}
          >
            {loading
              ? "로딩 중..."
              : hasMoreMatches
              ? "더보기"
              : "더 이상 매치 없음"}
          </ClickMoreListBtn>
        </MatchContainer>
      </Container>
    </>
  );
}
