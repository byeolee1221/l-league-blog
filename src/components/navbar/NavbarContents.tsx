"use client";

import Link from "next/link";
import NavbarMenu from "./NavbarMenu";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/tailwindMerge";
import { getListIcon } from "@/lib/iconMapping";
import { useNavbarConfig } from "@/hooks/useNavbarConfig";

const NavbarContents = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isMobileTipOpen, setIsMobileTipOpen] = useState(false);
  const config = useNavbarConfig();

  const handleMobileTipOpen = () => {
    setIsMobileTipOpen(!isMobileTipOpen);
  };


  return (
    <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 transition-all md:h-[70px] md:px-6 lg:h-[76px] lg:px-8">
      {/* 에디터 모드 헤더 (모바일) */}
      {config.type === "editor" && (
        <div className="flex w-full items-center lg:hidden">
          <Link href="/" className="mr-3">
            {getListIcon("arrowBack", "size-6 text-gray-700")}
          </Link>
          <h1 className="text-xl font-bold">{config.title}</h1>
        </div>
      )}

      {/* 로고 및 메뉴 */}
      <div
        className={cn(
          "flex items-center lg:space-x-20",
          !config.showMenu ? "absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0" : "",
          config.type === "editor" ? "hidden lg:flex" : "flex",
        )}
      >
        {config.showLogo && (
          <Link
            href="/"
            className="group flex items-center space-x-1.5 text-xl font-bold text-orange-500 md:text-2xl lg:text-3xl"
          >
            BLOG
          </Link>
        )}
        
        {config.showMenu && (
          <div className="hidden lg:block">
            <NavbarMenu />
          </div>
        )}
      </div>

      {/* 로그인/로그아웃 버튼 */}
      {config.showAuthButtons && (
        <div className={cn("hidden lg:block", config.type === "editor" ? "lg:block" : "")}>
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
      )}

      {/* 모바일 알림 버튼 */}
      {config.type === "default" && (
        <button
          onClick={handleMobileTipOpen}
          className="absolute right-4 rounded-full p-2 transition-all hover:bg-gray-100/20 active:bg-gray-100/30 lg:hidden"
          aria-label="모바일 탭 열기"
        >
          <Image 
            src="/icons/icon_bell.svg" 
            alt="모바일 탭 열기" 
            width={24} 
            height={24} 
            className="size-6"
          />
        </button>
      )}
    </div>
  );
};

export default NavbarContents;
