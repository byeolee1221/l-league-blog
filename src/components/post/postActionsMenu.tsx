"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { deletePost } from "@/app/(home)/action/deletePost";

interface PostActionsMenuProps {
  postId: number;
  hasImage?: boolean;
  className?: string;
  onSuccess?: () => void;
}

const PostActionsMenu = ({ postId, hasImage = false, className = "", onSuccess }: PostActionsMenuProps) => {
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
    router.push(`/posts/edit/${postId}`);
  };

  // 게시글 삭제 처리
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // 카드 링크 클릭 방지
    e.stopPropagation();

    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        if (!postId) {
          toast.error("게시글을 찾을 수 없습니다.");
          return;
        }

        const response = await deletePost(postId);

        if (response.success) {
          toast.success("게시글이 삭제되었습니다.");
          queryClient.invalidateQueries({ queryKey: ["posts"] });

          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/");
            router.refresh();
          }
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
    <div className={`relative z-10 ${className}`}>
      <button
        onClick={toggleMenu}
        className={`flex size-8 cursor-pointer items-center justify-center rounded-full p-1.5 transition-colors ${
          hasImage ? "bg-white/70 hover:bg-white" : "bg-gray-100 hover:bg-gray-200"
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
  );
};

export default PostActionsMenu;
