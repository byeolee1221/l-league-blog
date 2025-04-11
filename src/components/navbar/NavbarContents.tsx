"use client";

import Link from "next/link";
import NavbarMenu from "./NavbarMenu";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NavbarContents = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isMobileTipOpen, setIsMobileTipOpen] = useState(false);
  const [isSignin, setIsSignin] = useState(false);
  const pathname = usePathname();

  const handleMobileTipOpen = () => {
    setIsMobileTipOpen(!isMobileTipOpen);
  };

  useEffect(() => {
    if (pathname === "/signin") {
      setIsSignin(false);
    } else {
      setIsSignin(true);
    }
  }, [pathname]);

  return (
    <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-center px-4 transition-all md:h-[70px] md:px-6 lg:h-[76px] lg:justify-between lg:px-8">
      <div className="flex items-center lg:space-x-20">
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
      {isLoggedIn ? (
        <button className="hidden cursor-pointer rounded-full px-5 py-2 text-base font-semibold transition-all hover:shadow-sm lg:block">
          로그아웃
        </button>
      ) : (
        <Link
          href="/signin"
          className="hidden cursor-pointer rounded-full px-5 py-2 text-base font-semibold transition-all hover:shadow-sm lg:block"
        >
          로그인
        </Link>
      )}
      {isSignin && (
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
