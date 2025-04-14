"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/tailwindMerge";
import { useEffect, useState } from "react";
import { logoutAction } from "@/action/logoutAction";
import toast from "react-hot-toast";

const MobileNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showMobileNavbar, setShowMobileNavbar] = useState(false);

  useEffect(() => {
    if (pathname === "/signin" || pathname === "/posts/write") {
      setShowMobileNavbar(false);
    } else {
      setShowMobileNavbar(true);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const result = await logoutAction();

      if (result.success) { 
        toast.success("로그아웃되었습니다.");
        router.push("/");
        router.refresh();
      } else {
        if (result.error) {
          toast.error(result.error);
        }
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
      toast.error("로그아웃에 실패했습니다.");
    }
  }

  const navItems = [
    {
      icon: "/icons/page_home.svg",
      label: "홈",
      href: "/",
    },
    {
      icon: "/icons/page_chat.svg",
      label: "채팅",
      href: "/chat",
    },
    {
      icon: "/icons/page_rank.svg",
      label: "랭킹",
      href: "/rank",
    },
    {
      icon: "/icons/page_user.svg",
      label: "프로필",
      href: null,
      action: handleLogout,
    },
  ];

  return (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white lg:hidden",
        showMobileNavbar ? "block" : "hidden",
      )}
    >
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          item.action ? (
            // 액션이 있는 경우 (로그아웃 버튼)
            <button
              key={item.label}
              onClick={item.action}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 text-gray-500",
              )}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className="size-6 opacity-70"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ) : (
            // 일반 네비게이션 링크
            <Link
              key={item.href}
              href={item.href || "#"}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2",
                pathname === item.href ? "text-orange-500" : "text-gray-500",
              )}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={cn("size-6", pathname === item.href ? "text-orange-500 opacity-100" : "opacity-70")}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
