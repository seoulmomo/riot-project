import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getSummonerSpellImage } from "@/app/utils/api";
import { QUEUE_INFO } from "@/app/utils/QueueType";

interface Player {
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
}

interface MatchCardProps {
  player: Player;
  championImg: { [key: string]: string };
  itemImg: { [key: number]: string };
  queueId: number;
}

// 📌 ✅ 승/패에 따라 배경색 변경 (Styled-components 사용)
const MatchCardWrapper = styled.div<{ $isWin: boolean }>`
  background-color: ${(props) =>
    props.$isWin ? "#d1e7fd" : "#fdd1d1"}; // 승리: 파란색, 패배: 빨간색
`;

const MatchCard: React.FC<MatchCardProps> = ({
  player,
  championImg,
  itemImg,
  queueId,
}) => {
  const [spell1Img, setSpell1Img] = useState("");
  const [spell2Img, setSpell2Img] = useState("");

  useEffect(() => {
    const fetchSpellImages = async () => {
      const spell1 = await getSummonerSpellImage(
        player.summonerSpells.summoner1Id
      );
      const spell2 = await getSummonerSpellImage(
        player.summonerSpells.summoner2Id
      );
      setSpell1Img(spell1);
      setSpell2Img(spell2);
    };

    fetchSpellImages();
  }, [player.summonerSpells]);

  return (
    <MatchCardWrapper
      $isWin={player.win}
      className="p-4 m-2 shadow-md rounded-lg lg:flex items-center gap-4"
    >
      {/* 큐 타입 */}
      <div className="text-xs font-bold block lg:w-20 mb-1.5 lg:mb-0">
        {QUEUE_INFO[queueId] || "알 수 없는 큐"}
      </div>
      <div className="flex gap-4 items-center">
        {/* 챔피언 이미지 */}
        <img
          src={championImg[player.championName] || undefined}
          alt={player.championName}
          className="w-16 h-16 rounded-full"
        />

        {/* 소환사 스펠 (아레나 모드는 제외) */}
        {queueId !== 1700 && (
          <div className="flex flex-col gap-1">
            <img
              src={spell1Img || undefined}
              alt="Summoner Spell 1"
              className="w-6 h-6 rounded"
            />
            <img
              src={spell2Img || undefined}
              alt="Summoner Spell 2"
              className="w-6 h-6 rounded"
            />
          </div>
        )}

        {/* 매치 정보 */}
        <div className="flex flex-col">
          <p className="text-sm">
            {player.kda.kills} / {player.kda.deaths} / {player.kda.assists} (
            {(
              (player.kda.kills + player.kda.assists) /
              Math.max(1, player.kda.deaths)
            ).toFixed(2)}{" "}
            KDA)
          </p>
          <p className="text-sm">
            CS: {player.totalMinionsKilled} | 골드: {player.goldEarned}
          </p>

          {/* 아이템 이미지 */}
          <div className="flex items-center gap-1 flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const itemId =
                player.items[`item${i}` as keyof typeof player.items];
              return (
                itemId !== 0 && (
                  <img
                    key={i}
                    src={itemImg[itemId] || undefined}
                    alt={`아이템 ${itemId}`}
                    className="w-6 h-6 rounded-md"
                  />
                )
              );
            })}
          </div>
        </div>
      </div>
    </MatchCardWrapper>
  );
};

export default MatchCard;
