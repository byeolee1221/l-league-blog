"use client";

import { useEffect, useRef, useState } from "react";
import { getListIcon } from "@/lib/iconMapping";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "../action/getPosts";
import { PostData } from "@/types/post";

const ViewRanking = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTopPosts = async () => {
      setLoading(true);
      try {
        const result = await getPosts({ page: 1, page_size: 10 });
        
        if (result.success) {
          setPosts(result.data.data || []);
        }
      } catch (error) {
        console.error("조회수 TOP 10 게시글 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <RankingSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image src="/icons/icon_rank.svg" alt="조회수 랭킹" width={28} height={28} />
          <div className="flex items-center space-x-1">
            <p className="text-2xl font-medium">조회수 TOP 10</p>
            {getListIcon("arrowForward", "text-2xl")}
          </div>
        </div>

        {/* 모바일에서만 보이는 네비게이션 버튼 */}
        <div className="flex space-x-2 md:hidden">
          <button onClick={() => handleScroll("left")} className="rounded-full p-2 hover:bg-gray-100" aria-label="이전">
            {getListIcon("arrowBack", "text-xl")}
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="다음"
          >
            {getListIcon("arrowForward", "text-xl")}
          </button>
        </div>
      </div>

      {/* 모바일: 슬라이드 / 데스크톱: 그리드 */}
      <div className="block md:hidden">
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
        >
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.category.id}/${post.id}`}
              className="min-w-[280px] flex-shrink-0 snap-start"
            >
              <RankingCard post={post} index={index} />
            </Link>
          ))}
        </div>
      </div>

      {/* 데스크톱: 그리드 레이아웃 */}
      <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4 xl:grid-cols-5">
        {posts.map((post, index) => (
          <Link key={post.id} href={`/posts/${post.category.id}/${post.id}`}>
            <RankingCard post={post} index={index} />
          </Link>
        ))}
      </div>
    </div>
  );
};

const RankingCard = ({ post, index }: { post: PostData; index: number }) => (
  <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200">
    <div className="relative aspect-[4/3] w-full">
      {post.main_image ? (
        <Image
          src={post.main_image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 240px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          {getListIcon("imageOff", "text-4xl text-gray-400")}
        </div>
      )}
      <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sm font-semibold backdrop-blur-sm">
        {index + 1}
      </div>
    </div>
    <div className="flex flex-1 flex-col p-3">
      <h3 className="mb-1 line-clamp-2 text-sm font-medium">{post.title}</h3>
      <p className="mt-auto text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
    </div>
  </div>
);

const RankingSkeleton = () => (
  <div className="flex flex-col space-y-4">
    <div className="flex items-center space-x-3">
      <div className="size-7 rounded-full bg-gray-200" />
      <div className="h-8 w-36 rounded bg-gray-200" />
    </div>

    {/* 모바일 스켈레톤 */}
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:hidden">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="min-w-[280px] flex-shrink-0">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
            <div className="p-3">
              <div className="mb-2 h-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* 데스크톱 스켈레톤 */}
    <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4 xl:grid-cols-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-gray-200">
          <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
          <div className="p-3">
            <div className="mb-2 h-4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ViewRanking;
