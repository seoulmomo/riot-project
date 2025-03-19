// app/page.tsx
// 처음 화면
"use client";

import { KeyboardEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameNameTag, setGameNameTag] = useState("");

  const router = useRouter();



  useEffect(() => {
    const parts = gameNameTag.split("#");
    const [nickName, tag] = parts.length === 2 ? parts : ["", ""];
    setGameName(nickName);
    setTagLine(tag);
  }, [gameNameTag]);

  function activeEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

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
              onKeyDown={activeEnter}
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
