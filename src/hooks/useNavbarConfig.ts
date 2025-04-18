"use client";

import { usePathname } from "next/navigation";

export type NavbarType = "default" | "auth" | "editor" | "detail" | "hidden";

interface NavbarConfig {
  type: NavbarType;
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showMenu?: boolean;
  showAuthButtons?: boolean;
  showMobileNav?: boolean;
}
export const useNavbarConfig = (): NavbarConfig => {
  const pathname = usePathname();

  const isEditPage = pathname.includes("/posts/edit/");
  const isWritePage = pathname === "/posts/write";
  const isAuthPage = pathname === "/signin";
  const isPostDetailPage = /\/posts\/[^/]+\/\d+$/.test(pathname);

  if (isWritePage || isEditPage) {
    return {
      type: "editor",
      title: isEditPage ? "글 수정" : "글 등록",
      showBackButton: true,
      showLogo: true,
      showMenu: false,
      showAuthButtons: true,
      showMobileNav: false,
    };
  }

  if (isPostDetailPage) { 
    return {
      type: "detail",
      showBackButton: true,
      showLogo: false,
      showMenu: true,
      showAuthButtons: true,
      showMobileNav: true,
    }
  }

  if (isAuthPage) {
    return {
      type: "auth",
      showLogo: true,
      showMenu: false,
      showAuthButtons: false,
      showMobileNav: false,
    };
  }

  return {
    type: "default",
    showLogo: true,
    showMenu: true,
    showAuthButtons: true,
    showMobileNav: true,
  };
};
