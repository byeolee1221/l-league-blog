"use client";

import Link from "next/link";
import NavbarMenu from "./NavbarMenu";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/tailwindMerge";
import { getListIcon } from "@/lib/iconMapping";

const NavbarContents = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isMobileTipOpen, setIsMobileTipOpen] = useState(false);
  const [isSignin, setIsSignin] = useState(false);
  const [isWritePage, setIsWritePage] = useState(false);
  const pathname = usePathname();

  const handleMobileTipOpen = () => {
    setIsMobileTipOpen(!isMobileTipOpen);
  };

  useEffect(() => {
    if (pathname === "/signin") {
      setIsSignin(false);
      setIsWritePage(false);
    } else if (pathname === "/posts/write") {
      setIsSignin(true);
      setIsWritePage(true);
    } else {
      setIsSignin(true);
      setIsWritePage(false);
    }
  }, [pathname]);

  return (
    <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 transition-all md:h-[70px] md:px-6 lg:h-[76px] lg:px-8">
      {/* 모바일 전용 글 작성 페이지 헤더 */}
      {isWritePage && (
        <div className="flex w-full items-center lg:hidden">
          <Link href="/" className="mr-3">
            {getListIcon("arrowBack", "size-6 text-gray-700")}
          </Link>
          <h1 className="text-xl font-bold">글 등록</h1>
        </div>
      )}

      {/* 일반 헤더 (데스크톱 전체 + 모바일 일반 페이지) */}
      <div
        className={cn(
          "flex items-center lg:space-x-20",
          isSignin ? "" : "absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0",
          isWritePage ? "hidden lg:flex" : "flex",
        )}
      >
        <Link
          href="/"
          className="group flex items-center space-x-1.5 text-xl font-bold text-orange-500 md:text-2xl lg:text-3xl"
        >
          BLOG
        </Link>
        <div className="hidden lg:block">
          <NavbarMenu />
        </div>
      </div>

      {/* 로그인/로그아웃 버튼 */}
      <div className={cn("hidden lg:block", isWritePage ? "lg:block" : "")}>
        {isLoggedIn ? (
          <button className="cursor-pointer rounded-full px-5 py-2 text-base font-semibold transition-all hover:shadow-sm">
            로그아웃
          </button>
        ) : (
          <Link
            href="/signin"
            className="cursor-pointer rounded-full px-5 py-2 text-base font-semibold transition-all hover:shadow-sm"
          >
            로그인
          </Link>
        )}
      </div>

      {/* 모바일 알림 버튼 (글 작성 페이지 외) */}
      {isSignin && !isWritePage && (
        <button
          onClick={handleMobileTipOpen}
          className="absolute right-4 rounded-full p-2 transition-all hover:bg-gray-100/20 active:bg-gray-100/30 lg:hidden"
          aria-label="모바일 탭 열기"
        >
          <Image src="/icons/icon_bell.svg" alt="모바일 탭 열기" width={24} height={24} />
        </button>
      )}
    </div>
  );
};

export default NavbarContents;
