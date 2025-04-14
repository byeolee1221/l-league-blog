"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import toast from "react-hot-toast";
import { Category } from "@/types/category";
import { Post } from "@/types/post";
import { getPosts } from "../action/getPosts";
import BlogCategoryList from "./BlogCategoryList";
import BlogPostList from "./BlogPostList";
import BlogPagination from "./BlogPagination";
import BlogSearchBar from "./BlogSearchBar";

interface BlogSectionProps {
  isLoggedIn: boolean;
}

// 기본 카테고리 데이터 (API 실패 시 사용)
const defaultCategoryData: Category = {
  count: 5,
  totalCnt: 5,
  pageCnt: 1,
  curPage: 1,
  nextPage: null,
  previousPage: null,
  data: [
    { id: 1, name: "일상생활" },
    { id: 2, name: "맛집소개" },
    { id: 3, name: "제품후기" },
    { id: 4, name: "IT정보" },
    { id: 5, name: "기타" },
  ],
};

const getCategories = async (): Promise<Category> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/category`);

    if (!response.ok) {
      toast.error("카테고리 목록을 불러오는데 실패했습니다.");
      return defaultCategoryData;
    }

    const data: Category = await response.json();
    return data;
  } catch (error) {
    console.error("카테고리 목록을 불러오는데 실패했습니다.", error);
    toast.error("카테고리 목록을 불러오는데 실패했습니다.");
    return defaultCategoryData;
  }
};

const BlogSection = ({ isLoggedIn }: BlogSectionProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ownerStatus = localStorage.getItem("isOwner") === "true";
      setIsOwner(ownerStatus);
    }
  }, []);

  // 카테고리 데이터 가져오기
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category>({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: defaultCategoryData,
  });

  // 게시글 데이터 가져오기 (로그인 된 경우에만 요청)
  const {
    data: postsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useQuery<Post>({
    queryKey: ["posts", activeCategory, currentPage, searchQuery],
    queryFn: async () => {
      const result = await getPosts({
        // 카테고리가 0(전체)인 경우 category_id를 전달하지 않음
        category_id: activeCategory === 0 ? undefined : activeCategory,
        page: currentPage,
        page_size: 10,
        title: searchQuery || undefined,
      });

      if (result.error) {
        // 로그인 관련 에러는 표시하지 않음
        if (result.error !== "로그인이 필요한 서비스입니다.") {
          toast.error(result.error);
        }
        throw new Error(result.error);
      }

      return result.data;
    },
    // 로그인된 경우에만 요청 실행
    enabled: isLoggedIn,
    // 에러 재시도 제한
    retry: (failureCount, error) => {
      // 로그인 관련 에러는 재시도하지 않음
      if (error.message === "로그인이 필요한 서비스입니다.") {
        return false;
      }
      // 다른 에러는 최대 1번만 재시도
      return failureCount < 1;
    },
  });

  // URL의 category 파라미터로 활성 카테고리 설정
  useEffect(() => {
    const query = searchParams.get("query") || "";

    // 검색어가 있으면 전체 카테고리(0)로 설정
    if (query) {
      setActiveCategory(0);
      setSearchQuery(query);
    } else {
      // 검색어가 없으면 URL의 카테고리 파라미터 사용 (기본값은 전체(0))
      const category = searchParams.get("category") || "0";
      setActiveCategory(Number(category));
    }

    setCurrentPage(1);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    const params = new URLSearchParams();

    // 검색어가 있는 경우 카테고리 파라미터를 제거하여 전체 카테고리에서 검색
    if (query) {
      params.set("query", query);
      setActiveCategory(0);
    } else {
      // 검색어가 없으면 현재 활성화된 카테고리 유지
      params.set("category", activeCategory.toString());
    }

    router.push(`/?${params.toString()}`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 로그인 안내 컴포넌트
  const LoginPrompt = () => (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-12 text-center">
      <p className="mb-4 text-lg text-gray-600">로그인 후 게시글을 확인하실 수 있습니다.</p>
      <Link
        href="/signin"
        className="rounded-lg bg-orange-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-orange-600"
      >
        로그인하기
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="hidden text-2xl font-semibold md:block">블로그</h2>
        <BlogSearchBar onSearch={handleSearch} initialQuery={searchQuery} className="w-full md:w-auto" />
      </div>

      {/* 카테고리 목록 */}
      <BlogCategoryList categories={categories} activeCategory={activeCategory} isLoading={isCategoriesLoading} />

      {/* 게시글 목록 또는 로그인 안내 */}
      {!isLoggedIn ? (
        <LoginPrompt />
      ) : (
        <>
          <BlogPostList
            postsData={postsData || null}
            isPostsLoading={isPostsLoading}
            isPostsError={isPostsError}
            activeCategory={activeCategory}
            categories={categories}
            isOwner={isOwner}
          />

          {/* 페이지네이션 */}
          {!isPostsLoading && postsData && postsData.data.length > 0 && (
            <BlogPagination
              currentPage={currentPage}
              totalPages={postsData.pageCnt || 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BlogSection;
