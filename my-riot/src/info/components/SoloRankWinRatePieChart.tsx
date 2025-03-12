import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import styled from "styled-components";

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: "Arial", sans-serif;
  gap: 10px;
`;

const MatchStats = styled.div`
  font-size: 14px;
  color: #6b7280; /* Tailwind text-gray-500 */
  margin-bottom: 8px;
`;

const WinRateText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: bold;
  color: #2563eb; /* Tailwind text-blue-600 */
`;

const ChartWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function SoloRankWinRatePieChart({
  wins,
  losses,
}: {
  wins: number;
  losses: number;
}) {
  const totalGames = wins + losses;
  const winRate = ((wins / totalGames) * 100).toFixed(0); // 정수로 변환
  const loseRate = 100 - parseInt(winRate);

  const data = [
    { name: "승리", value: parseInt(winRate) },
    { name: "패배", value: loseRate },
  ];

  const COLORS = ["#3B82F6", "#EF4444"]; // 승리(파랑), 패배(빨강)

  return (
    <ChartContainer>
      <ChartWrapper>
        {/* 승률 텍스트 */}
        <WinRateText>{winRate}%</WinRateText>

        {/* 원형 차트 */}
        <PieChart width={120} height={120}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40} // 도넛 모양으로 만들기
            outerRadius={50}
            startAngle={90} // 시작 지점을 조정해서 시계 방향 진행
            endAngle={-270} // 360도 기준 반시계 방향으로 설정
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ChartWrapper>
      {/* 총 경기 수 및 승/패 표시 */}
      <MatchStats>
        {totalGames}전 {wins}승 {losses}패
      </MatchStats>
    </ChartContainer>
  );
}
