export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface AccountData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface LeagueEntry {
  leagueId: string;
  summonerId: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface FullSummonerData extends SummonerData {
  leagueEntries: LeagueEntry[] | null;
}

export async function fetchPuuid(
  gameName: string,
  tagLine: string
): Promise<string | null> {
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    console.error("❌ Riot API Key가 설정되지 않았습니다.");
    return null;
  }

  const riotUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;

  console.log(`🔍 Riot API 요청: ${riotUrl}`); // ✅ API URL 확인

  try {
    const res = await fetch(riotUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://developer.riotgames.com",
        "X-Riot-Token": apiKey,
      },
    });

    console.log(`🛠 응답 상태 코드: ${res.status}`); // ✅ HTTP 상태 코드 로그

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Riot API 호출 실패:", res.status, errorData);
      return null;
    }

    const data = await res.json();
    console.log("✅ PUUID 응답 데이터:", data); // ✅ 응답 데이터 출력
    return data.puuid;
  } catch (error) {
    console.error("❌ PUUID 가져오기 중 에러 발생:", error);
    return null;
  }
}

export async function fetchSummonerData(
  puuid: string
): Promise<SummonerData | null> {
  const apiKey = process.env.RIOT_API_KEY;
  const region = "kr"; // 한국 서버

  if (!apiKey) {
    console.error("❌ Riot API Key가 설정되지 않았습니다.");
    return null;
  }

  const riotUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

  try {
    const res = await fetch(riotUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://developer.riotgames.com",
        "X-Riot-Token": apiKey,
      },
    });

    if (!res.ok) {
      console.error("❌ Riot API 호출 실패2:", res.status);
      return null;
    }

    const data: SummonerData = await res.json();
    return data; // ✅ 소환사 정보 반환
  } catch (error) {
    console.error("❌ 소환사 정보 가져오기 중 에러 발생:", error);
    return null;
  }
}

export async function fetchLeagueData(
  summonerId: string
): Promise<LeagueEntry[] | null> {
  const apiKey = process.env.RIOT_API_KEY;
  const region = "kr";

  if (!apiKey) {
    console.error("Riot API Key가 설정되지 않았습니다.");
    return null;
  }

  const riotUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;

  try {
    const res = await fetch(riotUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://developer.riotgames.com",
        "X-Riot-Token": apiKey,
      },
    });

    if (!res.ok) {
      console.error("❌ Riot API 호출 실패3:", res.status);
      return null;
    }

    const data: LeagueEntry[] = await res.json();
    return data.length > 0 ? data : null; // 리그 정보가 없을 수도 있음
  } catch (error) {
    console.error("❌ 리그 정보 가져오기 중 에러 발생:", error);
    return null;
  }
}

export async function fetchFullSummonerData(
  gameName: string,
  tagLine: string
): Promise<FullSummonerData | null> {
  const summonerData = await fetchPuuid(gameName, tagLine);
  if (!summonerData) return null; // ❌ 소환사 정보가 없으면 중단

  const fullSummonerData = await fetchSummonerData(summonerData);
  if (!fullSummonerData) return null; // ❌ PUUID 기반 소환사 정보 가져오기 실패 시 중단

  const leagueEntries = await fetchLeagueData(fullSummonerData.id); // ✅ 리그 정보 가져오기

  return {
    ...fullSummonerData, // 기존 SummonerData
    leagueEntries, // 🔹 추가된 리그 정보
  };
}
