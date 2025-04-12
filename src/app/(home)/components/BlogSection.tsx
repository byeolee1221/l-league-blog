"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/tailwindMerge";

const BlogSection = () => {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");

  // URL의 category 파라미터로 활성 카테고리 설정
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setActiveCategory(category);
  }, [searchParams]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="hidden text-2xl font-semibold md:block">블로그</h2>
      </div>

      <div className="scrollbar-hide -mx-4 flex overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <div className="flex space-x-2 md:space-x-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?category=${category.id}`}
              scroll={false}
              className={cn(
                "group relative flex min-w-fit flex-col items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2",
                activeCategory === category.id ? "text-orange-500" : "text-gray-600 hover:text-orange-500",
              )}
            >
              <span>{category.title}</span>
              <span
                className={cn(
                  "absolute -bottom-0.5 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full",
                  activeCategory === category.id ? "w-full" : "",
                )}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* 선택된 카테고리에 따른 블로그 포스트 목록 */}
      <div className="mt-4 grid gap-4 sm:gap-6 md:grid-cols-4 md:gap-8 lg:grid-cols-8">
        {/* 여기에 블로그 포스트 카드 컴포넌트들이 들어갑니다 */}
        <p className="col-span-full text-center text-sm text-gray-500 md:text-left">
          선택된 카테고리: {categories.find((c) => c.id === activeCategory)?.title}
        </p>
      </div>
    </div>
  );
};

export default BlogSection;

const categories = [
  { id: "all", title: "전체", href: "/posts" },
  { id: "daily-life", title: "일상생활", href: "/posts/daily-life" },
  { id: "restaurant", title: "맛집소개", href: "/posts/restaurant-introduction" },
  { id: "product", title: "제품후기", href: "/posts/product-review" },
  { id: "it", title: "IT정보", href: "/posts/it-information" },
];
