"use client";

import { useEffect } from "react";
import Link from "next/link";
import { getListIcon } from "@/lib/iconMapping";

const PostDetailError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // 에러 로깅 또는 분석 서비스로 전송
    console.error('게시글 수정 오류:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-orange-500">
        {getListIcon("error", "size-16")}
      </div>      
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
        게시글을 수정할 수 없습니다
      </h1>     
      <p className="mb-8 max-w-md text-gray-600">
        요청하신 게시글을 수정하는 중 문제가 발생했습니다. 
        {error?.message && <span className="block mt-2 text-sm text-gray-500">오류: {error.message}</span>}
      </p>     
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center rounded-lg border border-orange-500 bg-white px-5 py-2.5 font-medium text-orange-500 transition-colors hover:bg-orange-50"
        >
          {getListIcon("refresh", "size-5 mr-2")}
          다시 시도
        </button>      
        <Link
          href="/"
          className="flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-orange-600"
        >
          {getListIcon("home", "size-5 mr-2")}
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default PostDetailError;