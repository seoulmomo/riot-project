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
    <div className="w-full lg:h-[500px] bg-white rounded-lg mt-6 pb-2 flex flex-col items-center justify-start gap-4 lg:w-[332px]">
      <div className="flex items-center w-full h-[36px] border-b-[0.5px] border-b-[#edeef1]">
        <div className="text-sm text-gray-800 leading-[36px] px-4">
          솔로 랭크
        </div>
      </div>
      <div className="mt-[10px] flex flex-col gap-5 justify-center md:flex-row lg:flex-col">
        <div className="flex justify-center gap-4 mb-4 lg:items-center">
          <img
            src={tierImgUrl || undefined}
            alt={soloRankTier}
            width={80}
            height={80}
          />
          <div className="flex flex-col justify-center">
            <span className="text-xl font-bold">{soloRankTier}</span>
            <span className="text-xs text-gray-500">{soloRankPoint} LP</span>
          </div>
        </div>
        <SoloRankWinRatePieChart wins={soloRankWins} losses={soloRankLoses} />
      </div>
      <div className="mt-[10px] w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-[11px] bg-[#e0eeee]">챔피언</th>
              <th className="p-1 text-[11px] bg-[#e0eeee]">게임 수</th>
              <th className="p-1 text-[11px] bg-[#e0eeee]">승률</th>
              <th className="p-1 text-[11px] bg-[#e0eeee]">KDA</th>
            </tr>
          </thead>
          <tbody>
            {playerChampion.slice(0, 5).map((champion, index) => (
              <tr key={index}>
                <td className="flex items-center pl-[10px] gap-[10px]">
                  <img
                    src={champion.imageUrl}
                    alt={champion.championName}
                    className="w-[22px] h-[22px]"
                  />
                  <span className="text-[12px]">
                    {CHAMPION_KR[champion.championName]}
                  </span>
                </td>
                <td className="text-center">{champion.count}</td>
                <td className="text-center">
                  {Math.floor(champion.win / champion.count) / 100}
                </td>
                <td className="text-center">
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
      </div>
    </div>
  );
};

export default LeagueInfo;
