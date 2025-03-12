// app/page.tsx
// 처음 화면
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FullSummonerData } from "../info/lib/riot";
import Link from "next/link";
import { IoIosMenu } from "react-icons/io";

export default function Page() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [summonerData, setSummonerData] = useState<FullSummonerData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameNameTag, setGameNameTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "챔피언", to: "/champions" },
    { name: "아이템", to: "/items" },
  ];

  useEffect(() => {
    const parts = gameNameTag.split("#");
    const [nickName, tag] = parts.length === 2 ? parts : ["", ""];
    setGameName(nickName);
    setTagLine(tag);
  }, [gameNameTag]);

  async function handleSearch() {
    try {
      setLoading(true);
      setError(null); // 에러 초기화

      // ✅ Next.js API 엔드포인트 호출
      const res = await fetch(
        `/api/riot?gameName=${encodeURIComponent(
          gameName
        )}&tagLine=${encodeURIComponent(tagLine)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "소환사 정보를 찾을 수 없습니다.");
      } else {
        localStorage.setItem("summonerData", JSON.stringify(data));
        router.push(
          `/summoner/${encodeURIComponent(gameName)}-${encodeURIComponent(
            tagLine
          )}`
        );
      }
    } catch (err) {
      setError("데이터 패칭 중 오류가 발생했습니다.");
    } finally {
      setGameNameTag("");
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <header className="bg-white w-full shadow-sm">
        <nav className="mx-auto px-4 py-3">
          {/* 데스크탑 navbar */}
          <div className="hidden md:flex gap-5">
            {menuItems.map((menu) => (
              <Link
                key={menu.name}
                href={menu.to}
                className="text-gray-600 hover:text-gray-900"
              >
                {menu.name}
              </Link>
            ))}
          </div>

          {/* 모바일 navbar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <IoIosMenu />
          </button>

          {/* <div className="" */}
        </nav>
      </header>

      <div className="flex flex-col items-center justify-center h-screen bg-white p-6">
        <h1 className="text-4xl font-bold m-3">My LOL</h1>
        <div className="card w-full max-w-sm p-4">
          <div className="card-body flex flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="게임 닉네임 + #태그"
              value={gameNameTag}
              onChange={(e) => {
                setGameNameTag(e.target.value);
                setError(null); // 입력 변경 시 에러 초기화
              }}
              className="input input-bordered flex-grow border-black"
            />
            <button
              className="btn btn-outline border-black bg-white text-black"
              onClick={handleSearch}
            >
              {loading ? "검색 중..." : "검색"}
            </button>
          </div>
          {!error ? (
            <p className="h-5"></p>
          ) : (
            <p className="text-red-500 text-sm pl-8">{error}</p>
          )}
          {/* {error && <p className="text-red-500 text-sm pl-8">{error}</p>} */}
        </div>
      </div>
    </div>
  );
}
