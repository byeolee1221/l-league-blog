import { Post } from "@/types/post";
import { Category } from "@/types/category";
import BlogPostCard from "./BlogPostCard";
import Image from "next/image";

interface BlogPostListProps {
  postsData: Post | null;
  isPostsLoading: boolean;
  isPostsError: boolean;
  activeCategory: number;
  categories: Category;
  isOwner: boolean;
}

const BlogPostList = ({ postsData, isPostsLoading, isPostsError, activeCategory, categories, isOwner }: BlogPostListProps) => {
  const activeCategoryName = categories.data.find((c) => c.id === activeCategory)?.name || "";

  return (
    <div className="mt-4 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isPostsLoading ? (
        // 로딩 중 스켈레톤 UI
        Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="h-40 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
          ))
      ) : isPostsError || !postsData || postsData.data.length === 0 ? (
        // 에러 또는 데이터 없음
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <Image src="/icons/icon_tip.svg" alt="정보 없음" width={32} height={32} className="opacity-50" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-700">게시글이 없습니다</h3>
          <p className="text-sm text-gray-500">{activeCategoryName} 카테고리에 게시된 글이 없습니다.</p>
        </div>
      ) : (
        // 게시글 목록 표시
        postsData.data.map((post) => (
          <BlogPostCard key={post.id} post={post} categoryName={post.category.name || activeCategoryName} isOwner={isOwner} />
        ))
      )}
    </div>
  );
};

export default BlogPostList;
