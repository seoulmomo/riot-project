const QUEUETYPE = {
  400: "norm", //Normal Draft Pick
  420: "solo",
  430: "norm",
  440: "flex",
  450: "aram",
  700: "clash",
  800: "ai", // Deprecated
  810: "ai", // Deprecated
  820: "ai", // Deprecated
  830: "ai",
  840: "ai",
  850: "ai",
  900: "urf",
  920: "poro",
  1020: "ofa",
  1300: "nbg",
  1400: "usb", // Ultimate Spellbook
  2000: "tut",
  2010: "tut",
  2020: "tut",
};

export const QUEUE_INFO: Record<number, string> = {
  400: "일반",
  420: "솔로 랭크",
  430: "일반 (선택)",
  440: "자유 랭크",
  450: "무작위 총력전",
  700: "격전",
  830: "입문 봇전",
  840: "초보 봇전",
  850: "중급 봇전",
  900: "우르프",
  920: "전설의 포로왕",
  1020: "단일 챔피언",
  1300: "돌격! 넥서스",
  1400: "궁극기 주문서",
  1700: "아레나",
  2000: "튜토리얼 1",
  2010: "튜토리얼 2",
  2020: "튜토리얼 3",
};
