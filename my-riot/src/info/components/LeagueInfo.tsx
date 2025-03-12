import styled from "styled-components";
import SoloRankWinRatePieChart from "./SoloRankWinRatePieChart";

interface LeagueInfoProps {
  tierImgUrl: string;
  soloRankTier: string;
  soloRankPoint: number;
  soloRankWins: number;
  soloRankLoses: number;
}

const LeagueContainer = styled.div`
  width: 332px;
  background-color: white;
  border-radius: 8px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  @media (min-width: 1080px) {
    width: 320px;
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 1079px) {
    display: none;
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
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;

  @media (min-width: 1080px) {
    align-items: center;
  }
`;

// 📌 **함수형 컴포넌트 변환**
const LeagueInfo: React.FC<LeagueInfoProps> = ({
  tierImgUrl,
  soloRankTier,
  soloRankPoint,
  soloRankWins,
  soloRankLoses,
}) => {
  return (
    <LeagueContainer>
      <SoloRankText>
        <Text>솔로 랭크</Text>
      </SoloRankText>
      <TierInfo>
        <img src={tierImgUrl} alt={soloRankTier} width={80} height={80} />
        <RankTextContainer>
          <RankText>{soloRankTier}</RankText>
          <RankPoint>{soloRankPoint} LP</RankPoint>
        </RankTextContainer>
      </TierInfo>
      <SoloRankWinRatePieChart wins={soloRankWins} losses={soloRankLoses} />
    </LeagueContainer>
  );
};

export default LeagueInfo;
