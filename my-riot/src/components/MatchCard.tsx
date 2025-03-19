import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getSummonerSpellImage } from "@/app/utils/api";

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

const MatchCardContainer = styled.div<{ $win: boolean }>`
  padding: 16px;
  margin: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: ${({ $win }) => ($win ? "#c3e0f7" : "#f7c3c3")};
  display: flex;
  align-items: center;
  gap: 16px;
  @media (min-width: 1080px) {
    width: 740px;
  }
`;

const ChampionImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;

const MatchInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Stats = styled.p`
  font-size: 0.9rem;
`;

const Items = styled.p`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px; /* 아이템 간격 조절 */
  flex-wrap: wrap; /* 너무 많을 경우 줄바꿈 */
`;

const ItemImage = styled.img`
  width: 22px;
  heigh: 22px;
  border-radius: 0.25rem;
`;

const SpellImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
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
    <MatchCardContainer $win={player.win}>
      <ChampionImage
        src={championImg[player.championName] || undefined}
        alt={player.championName}
      />

      {queueId === 1700 ? (
        ""
      ) : (
        <div className="flex flex-col gap-1">
          <SpellImage src={spell1Img || undefined} alt="Summoner Spell 1" />
          <SpellImage src={spell2Img || undefined} alt="Summoner Spell 2" />
        </div>
      )}

      <MatchInfo>
        <Stats>
          {player.kda.kills} / {player.kda.deaths} / {player.kda.assists} (
          {(
            (player.kda.kills + player.kda.assists) /
            Math.max(1, player.kda.deaths)
          ).toFixed(2)}{" "}
          KDA)
        </Stats>
        <Stats>
          CS: {player.totalMinionsKilled} | 골드: {player.goldEarned}
        </Stats>
        <Items>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const itemId =
              player.items[`item${i}` as keyof typeof player.items];
            return (
              itemId !== 0 && (
                <ItemImage
                  key={i}
                  src={itemImg[itemId] || undefined}
                  alt={`아이템 ${itemId}`}
                />
              )
            );
          })}
        </Items>
      </MatchInfo>
    </MatchCardContainer>
  );
};

export default MatchCard;
