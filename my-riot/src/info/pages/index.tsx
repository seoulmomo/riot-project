// // pages/index.tsx
// import { GetServerSideProps, NextPage } from 'next';

// interface SummonerData {
//   id: string;
//   accountId: string;
//   puuid: string;
//   name: string;
//   profileIconId: number;
//   revisionDate: number;
//   summonerLevel: number;
// }

// interface HomeProps {
//   summonerData: SummonerData | null;
// }

// const Home: NextPage<HomeProps> = ({ summonerData }) => {
//   return (
//     <div>
//       <h1>Summoner Data</h1>
//       {summonerData ? (
//         <pre>{JSON.stringify(summonerData, null, 2)}</pre>
//       ) : (
//         <p>데이터를 가져오지 못했습니다.</p>
//       )}
//     </div>
//   );
// };

// export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
//   const apiKey = process.env.RIOT_API_KEY;
//   const region = 'kr'; // 예: 한국 서버
//   const summonerName = 'Faker'; // 예시 소환사 이름

//   if (!apiKey) {
//     console.error('Riot API Key가 설정되지 않았습니다.');
//     return { props: { summonerData: null } };
//   }

//   // Riot API 호출 시, 쿼리 파라미터 방식(예시)
//   // ※ 필요에 따라 헤더 방식으로 전환할 수 있습니다.
//   const riotUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
//     summonerName
//   )}?api_key=${apiKey}`;

//   try {
//     const res = await fetch(riotUrl);
//     if (!res.ok) {
//       console.error('Riot API 호출 실패:', res.status);
//       return { props: { summonerData: null } };
//     }
//     const data: SummonerData = await res.json();

//     return {
//       props: { summonerData: data },
//     };
//   } catch (error) {
//     console.error('데이터 패칭 중 에러 발생:', error);
//     return {
//       props: { summonerData: null },
//     };
//   }
// };

// export default Home;
