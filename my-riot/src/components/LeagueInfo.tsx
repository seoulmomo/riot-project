import styled from "styled-components";
import SoloRankWinRatePieChart from "./SoloRankWinRatePieChart";
import { CHAMPION_KR } from "@/app/utils/ChampionName";

interface LeagueInfoProps {
  tierImgUrl: string;
  soloRankTier: string;
  soloRankPoint: number;
  soloRankWins: number;
  soloRankLoses: number;
  playerChampion: Array<{
    championName: string;
    count: number;
    win: number;
    defeat: number;
    kills: number;
    deaths: number;
    assists: number;
    imageUrl: string;
  }>;
}

const LeagueContainer = styled.div`
  width: 100%;
  height: 500px;
  background-color: white;
  border-radius: 8px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  @media (min-width: 1080px) {
    width: 332px;
    flex-direction: column;
    align-items: center;
  }
  .tierChartMobileUi {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;

    @media (min-width: 768px) and (max-width: 1079px) {
      display: block;
      flex-direction: row;
    }
  }
`;

const SoloRankText = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  border-bottom: 0.5px solid #edeef1;
`;

const Text = styled.div`
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 36px;
  padding-left: 16px;
  padding-right: 16px;
`;

const RankTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RankText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
`;

const RankPoint = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const TierInfo = styled.div`
  // width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;

  @media (min-width: 1080px) {
    align-items: center;
  }
`;

const ChampionKDAContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    padding: 4px;
    font-size: 11px;
    background-color: #e0eeee;
  }
  td {
    text-align: center;
  }
  img {
    // margin: 0 auto;
    width: 22px;
    heigh: 22px;
  }
  .tbodyChampionNameImg {
    display: flex;
    align-items: center;
    padding-left: 10px;
    gap: 10px;
    span {
      font-size: 12px;
    }
  }
`;

// 📌 **함수형 컴포넌트 변환**
const LeagueInfo: React.FC<LeagueInfoProps> = ({
  tierImgUrl,
  soloRankTier,
  soloRankPoint,
  soloRankWins,
  soloRankLoses,
  playerChampion,
}) => {
  if (Array.isArray(playerChampion)) {
    playerChampion.sort((a, b) => b.count - a.count);
  }
  return (
    <LeagueContainer>
      <SoloRankText>
        <Text>솔로 랭크</Text>
      </SoloRankText>
      <div className="tierChartMobileUi">
        <TierInfo>
          <img
            src={tierImgUrl || undefined}
            alt={soloRankTier}
            width={80}
            height={80}
          />
          <RankTextContainer>
            <RankText>{soloRankTier}</RankText>
            <RankPoint>{soloRankPoint} LP</RankPoint>
          </RankTextContainer>
        </TierInfo>
        <SoloRankWinRatePieChart wins={soloRankWins} losses={soloRankLoses} />
      </div>
      <ChampionKDAContainer>
        <table>
          <thead>
            <tr>
              <th>챔피언</th>
              <th>게임 수</th>
              <th>승률</th>
              <th>KDA</th>
            </tr>
          </thead>
          <tbody>
            {playerChampion.slice(0, 5).map((champion, index) => (
              <tr key={index}>
                <td className="tbodyChampionNameImg">
                  <img src={champion.imageUrl} alt={champion.championName} />
                  <span>{CHAMPION_KR[champion.championName]}</span>
                </td>
                <td>{champion.count}</td>
                <td>{Math.floor(champion.win / champion.count) / 100}</td>
                <td>
                  {champion.deaths !== 0
                    ? Math.floor(
                        (champion.kills + champion.assists) / champion.deaths
                      ) / 100
                    : "Perfect"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChampionKDAContainer>
    </LeagueContainer>
  );
};

export default LeagueInfo;
