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

// 챔피언 이미지 가져오기
export async function getChampionImage(championName: string): Promise<string> {
  const version = await getLatestVersion();
  if (!championName) return "";

  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
}

// 아이템 데이터 가져오기
export async function getItemData() {
  const version = await getLatestVersion();
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/item.json`
  );
  return await res.json();
}

// 특정 아이템 이미지 가져오기
export async function getItemImage(itemId: number): Promise<string> {
  const version = await getLatestVersion();
  if (!itemId) return "";

  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
}

// 스펠 이미지 가져오기
const summonerSpellMap: { [key: number]: string } = {
  21: "SummonerBarrier",
  1: "SummonerBoost",
  14: "SummonerDot",
  3: "SummonerExhaust",
  4: "SummonerFlash",
  6: "SummonerHaste",
  7: "SummonerHeal",
  13: "SummonerMana",
  11: "SummonerSmite",
  12: "SummonerTeleport",
  32: "SummonerSnowball",
};

export async function getSummonerSpellImage(spellId: number): Promise<string> {
  const version = await getLatestVersion();
  const spellName = summonerSpellMap[spellId];
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spellName}.png`;
}
