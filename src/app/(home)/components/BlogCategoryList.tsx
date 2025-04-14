import Link from "next/link";
import { cn } from "@/lib/tailwindMerge";
import { Category } from "@/types/category";

interface BlogCategoryListProps {
  categories: Category;
  activeCategory: number;
  isLoading: boolean;
}

const BlogCategoryList = ({ categories, activeCategory, isLoading }: BlogCategoryListProps) => {
  return (
    <div className="scrollbar-hide -mx-4 flex overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
      <div className="flex space-x-2 md:space-x-4">
        {isLoading ? (
          // 로딩 중일 때 스켈레톤 UI
          Array(5)
            .fill(0)
            .map((_, index) => <div key={index} className="h-10 w-16 animate-pulse rounded-full bg-gray-200 sm:w-20" />)
        ) : (
          <>
            {/* 전체 카테고리 추가 */}
            <Link
              href={`/?category=0`}
              scroll={false}
              className={cn(
                "group relative flex min-w-fit flex-col items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2",
                activeCategory === 0 ? "text-orange-500" : "text-gray-600 hover:text-orange-500",
              )}
            >
              <span>전체</span>
              <span
                className={cn(
                  "absolute -bottom-0.5 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full",
                  activeCategory === 0 ? "w-full" : "",
                )}
              />
            </Link>

            {/* 기존 카테고리 목록 */}
            {categories.data.map((category) => (
              <Link
                key={category.id}
                href={`/?category=${category.id}`}
                scroll={false}
                className={cn(
                  "group relative flex min-w-fit flex-col items-center px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2",
                  activeCategory === category.id ? "text-orange-500" : "text-gray-600 hover:text-orange-500",
                )}
              >
                <span>{category.name}</span>
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full",
                    activeCategory === category.id ? "w-full" : "",
                  )}
                />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogCategoryList;
