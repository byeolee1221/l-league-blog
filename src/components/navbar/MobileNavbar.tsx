"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/tailwindMerge";

const MobileNavbar = () => {
  const pathname = usePathname();

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
      href: "/profile",
    },
  ];

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
              className={cn(pathname === item.href ? "text-orange-500 opacity-100" : "opacity-70")}
            />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
