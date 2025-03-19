import { useState } from "react";
import Link from "next/link";
import { IoIosMenu, IoMdClose } from "react-icons/io";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "My LOL", to: "/" },
    { name: "챔피언", to: "/champions" },
    { name: "아이템", to: "/items" },
  ];

  return (
    <>
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
        </nav>
        {isOpen && (
          <>
            <>
              <div
                className="fixed inset-0 bg-black/30 transition-opacity duration-300 z-10"
                onClick={() => setIsOpen(false)} // 오버레이 클릭 시 메뉴 닫기
              ></div>

              {/* 📌 왼쪽에서 슬라이드 인하는 메뉴 */}
              <div
                className={`fixed top-0 left-0 h-full w-2/3 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    <IoMdClose size={24} />
                  </button>
                </div>

                <ul className="flex flex-col items-start gap-4 px-6 py-4">
                  {menuItems.map((menu) => (
                    <li key={menu.name}>
                      <Link
                        href={menu.to}
                        className="text-gray-600 hover:text-gray-900 text-lg"
                        onClick={() => setIsOpen(false)} // 메뉴 클릭 시 닫기
                      >
                        {menu.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          </>
        )}
      </header>
    </>
  );
}
