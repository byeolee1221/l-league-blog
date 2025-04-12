"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Category } from "@/types/category";
import { Post } from "@/types/post";
import { getPosts } from "../action/getPosts";
import BlogCategoryList from "./BlogCategoryList";
import BlogPostList from "./BlogPostList";
import BlogPagination from "./BlogPagination";
import BlogSearchBar from "./BlogSearchBar";

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

const BlogSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 카테고리 데이터 가져오기
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category>({
    queryKey: ["categories"],
    queryFn: getCategories,
    initialData: defaultCategoryData,
  });

  // 게시글 데이터 가져오기
  const {
    data: postsData,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useQuery<Post>({
    queryKey: ["posts", activeCategory, currentPage, searchQuery],
    queryFn: async () => {
      const result = await getPosts({
        category_id: activeCategory,
        page: currentPage,
        page_size: 10,
        title: searchQuery || undefined,
      });

      if (result.error) {
        toast.error(result.error);
        throw new Error(result.error);
      }

      return result.data;
    },
  });

  // URL의 category 파라미터로 활성 카테고리 설정
  useEffect(() => {
    const category = searchParams.get("category") || "1";
    const query = searchParams.get("query") || "";
    setActiveCategory(Number(category));
    setSearchQuery(query);
    setCurrentPage(1);
  }, [searchParams]);

  const handleSearch = (query: string) => { 
    setSearchQuery(query);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams);
    if (query) { 
      params.set("query", query);
    } else { 
      params.delete("query");
    }

    router.push(`/?${params.toString()}`);
  }

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="hidden text-2xl font-semibold md:block">블로그</h2>
        <BlogSearchBar onSearch={handleSearch} initialQuery={searchQuery} className="w-full md:w-auto" />
      </div>

      {/* 카테고리 목록 */}
      <BlogCategoryList categories={categories} activeCategory={activeCategory} isLoading={isCategoriesLoading} />

      {/* 게시글 목록 */}
      <BlogPostList
        postsData={postsData || null}
        isPostsLoading={isPostsLoading}
        isPostsError={isPostsError}
        activeCategory={activeCategory}
        categories={categories}
      />

      {/* 페이지네이션 */}
      {!isPostsLoading && postsData && postsData.data.length > 0 && (
        <BlogPagination currentPage={currentPage} totalPages={postsData.pageCnt || 1} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default BlogSection;
