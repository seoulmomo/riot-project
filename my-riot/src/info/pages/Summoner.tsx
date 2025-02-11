// pages/summoner.tsx
import { GetServerSideProps, NextPage } from "next";
import { fetchFullSummonerData, SummonerData } from "../lib/riot";

interface SummonerPageProps {
  summonerData: SummonerData | null;
}

const SummonerPage: NextPage<SummonerPageProps> = ({ summonerData }) => {
  return (
    <div>
      <h1>Summoner Data</h1>
      {summonerData ? (
        <pre>{JSON.stringify(summonerData, null, 2)}</pre>
      ) : (
        <p>데이터를 가져오지 못했습니다.</p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  SummonerPageProps
> = async () => {
  const gameName = "허거덩";
  const tagLine = "0303";

  const summonerData = await fetchFullSummonerData(gameName, tagLine);

  return { props: { summonerData } };
};

export default SummonerPage;
