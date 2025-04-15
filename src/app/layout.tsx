import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "react-hot-toast";
import QueryProvider from "./QueryProvider";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | 엘리그 블로그",
    default: "메인",
  },
  description: "엘리그 블로그입니다.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "엘리그 블로그",
    description: "엘리그 블로그입니다.",
    url: "http://localhost:3000",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.className} text-gray-900 antialiased`}
      >
        <QueryProvider>
          <Navbar />
          {children}
          <Toaster
            toastOptions={{
              success: { style: { fontSize: "14px" } },
              error: { style: { fontSize: "14px" } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
