// 최신 버전 가져오기
export async function getLatestVersion(): Promise<string> {
  const versionRes = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const versions = await versionRes.json();
  return versions[0];
}

// 특정 챔피언 정보 가져오기
export async function getChampionData(championName: string) {
  const version = await getLatestVersion();
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion/${championName}.json`
  );
  return await res.json();
}

export async function getChampionImage(championName: string): Promise<string> {
  const version = await getLatestVersion();
  if (!championName) return "";

  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
}
