"use client";

import { getListIcon } from "@/lib/iconMapping";
import { cn } from "@/lib/tailwindMerge";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NavbarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const items = [
    {
      label: "블로그 카테고리",
      href: "#",
      hasSubmenu: true,
      onMouseEnter: () => setIsMenuOpen(true),
    },
  ];

  // 카테고리탭 서브메뉴 아이템
  const categoryItems = [
    {
      title: "일상생활",
      href: "/?category=1",
    },
    {
      title: "맛집소개",
      href: "/?category=2",
    },
    {
      title: "제품후기",
      href: "/?category=3",
    },
    {
      title: "IT정보",
      href: "/?category=4",
    },
    {
      title: "기타",
      href: "/?category=5",
    },
  ];

  // 메뉴 영역 밖으로 마우스가 이동하면 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // 마우스 이동 감지를 위한 전역 이벤트 리스너
    document.addEventListener("mousemove", handleClickOutside);

    return () => {
      document.removeEventListener("mousemove", handleClickOutside);
    };
  }, []);

  return (
    <div className="hidden space-x-10 md:flex">
      {items.map((item) => (
        <div
          key={item.label}
          ref={item.hasSubmenu ? menuRef : undefined}
          className="relative"
          onMouseEnter={item.onMouseEnter}
        >
          {item.hasSubmenu && (
            <button
              className={cn(
                "flex items-center rounded-full px-3 py-2 text-base font-semibold transition-all hover:shadow-sm",
                pathname.includes("/posts") && "text-orange-500",
              )}
            >
              {item.label}
              {getListIcon("arrowDown", `ml-1 size-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`)}
            </button>
          )}
          {item.hasSubmenu && (
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 z-50 mt-1 w-56 flex-col space-y-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
                >
                  {categoryItems.map((submenuItem) => (
                    <Link
                      href={submenuItem.href}
                      key={submenuItem.title}
                      className="block px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-orange-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {submenuItem.title}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavbarMenu;
