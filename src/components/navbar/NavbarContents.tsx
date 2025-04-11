"use client";

import Link from "next/link";
import NavbarMenu from "./NavbarMenu";
import { useState } from "react";
import Image from "next/image";

const NavbarContents = () => {
  const [isMobileTipOpen, setIsMobileTipOpen] = useState(false);

  const handleMobileTipOpen = () => {
    setIsMobileTipOpen(!isMobileTipOpen);
  };

  return (
    <div className="flex h-16 w-full max-w-7xl mx-auto items-center justify-between px-4 transition-all md:h-[70px] md:px-6 lg:h-[76px] lg:px-8">
      <div className="relative flex items-center space-x-6 md:space-x-10 lg:space-x-20">
        <Link
          href="/"
          className="group flex items-center space-x-1.5 text-orange-500 font-bold text-xl md:text-2xl lg:text-3xl"
        >
          BLOG
        </Link>
        <NavbarMenu />
      </div>
      <Link
        href="/signin"
        className="hidden rounded-full px-5 py-2 text-base font-semibold transition-all lg:block hover:shadow-sm"
      >
        로그인
      </Link>
      <button
        onClick={handleMobileTipOpen}
        className="rounded-full p-2 transition-all hover:bg-gray-100/20 active:bg-gray-100/30 lg:hidden"
        aria-label="모바일 탭 열기"
      >
        <Image src="/icons/icon_bell.svg" alt="모바일 탭 열기" width={24} height={24} />
      </button>
    </div>
  );
};

export default NavbarContents;
