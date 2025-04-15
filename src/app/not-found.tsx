"use client";

import Link from "next/link";
import { getListIcon } from "@/lib/iconMapping";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex flex-col items-center">
        <h1 className="text-6xl font-bold text-orange-500">404</h1>
      </div>
      <h2 className="mb-2 text-2xl font-bold sm:text-3xl">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8 max-w-md break-keep text-gray-600">
        요청하신 페이지가 존재하지 않거나, 삭제되었거나, 주소가 변경되었을 수 있습니다.
      </p>
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center rounded-lg border border-orange-500 bg-white px-5 py-2.5 font-medium text-orange-500 transition-colors hover:bg-orange-50"
        >
          {getListIcon("arrowBack", "size-5 mr-2")}
          이전 페이지
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
};

export default NotFound;
