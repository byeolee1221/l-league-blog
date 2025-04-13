"use client";

import { PostData } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { deletePost } from "../action/deletePost";
import { useQueryClient } from "@tanstack/react-query";

interface BlogPostCardProps {
  post: PostData;
  categoryName: string;
  isOwner?: boolean; // 게시글 작성자인지 확인
}

const BlogPostCard = ({ post, categoryName, isOwner = false }: BlogPostCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 게시글 수정 페이지로 이동
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); // 카드 링크 클릭 방지
    e.stopPropagation();
    router.push(`/posts/edit/${post.id}`);
  };

  // 게시글 삭제 처리
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // 카드 링크 클릭 방지
    e.stopPropagation();

    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        if (!post.id) {
          toast.error("게시글을 찾을 수 없습니다.");
          return;
        }

        const response = await deletePost(post.id);

        if (response.success) {
          toast.success("게시글이 삭제되었습니다.");
          queryClient.invalidateQueries({ queryKey: ["posts"] });
          router.refresh();
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생", error);
        toast.error("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 더보기 메뉴 토글
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // 카드 링크 클릭 방지
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Link
      href={`/posts/category-${post.category.id}/${post.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md"
    >
      {post.main_image && (
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          <Image
            src={post.main_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            priority
          />
        </div>
      )}

      {isOwner && (
        <div className={`absolute top-2 right-2 z-10 ${!post.main_image ? "mt-2" : ""}`}>
          <button
            onClick={toggleMenu}
            className={`flex size-8 cursor-pointer items-center justify-center rounded-full p-1.5 transition-colors ${
              post.main_image ? "bg-white/70 hover:bg-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
            aria-label="더 보기"
          >
            <Image src="/icons/icon_more.svg" alt="더 보기" width={20} height={20} />
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-10 right-0 z-20 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
            >
              <button
                onClick={handleEdit}
                className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                수정하기
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 text-xs font-medium text-orange-500">{categoryName}</span>
        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-800 group-hover:text-orange-500">
          {post.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{post.content}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          <span>{post.user.name || "익명"}</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
