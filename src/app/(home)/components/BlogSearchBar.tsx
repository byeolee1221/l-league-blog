"use client";

import { useState } from "react";
import { getListIcon } from "@/lib/iconMapping";
import { cn } from "@/lib/tailwindMerge";

interface BlogSearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  initialQuery?: string;
}

const BlogSearchBar = ({ onSearch, className, initialQuery = "" }: BlogSearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex w-full max-w-md items-center rounded-full border border-gray-200 bg-white transition-all focus-within:border-orange-500 focus-within:shadow-sm",
        className,
      )}
    >
      <input
        type="text"
        placeholder="게시글 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-gray-400"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-12 rounded-full p-1 text-gray-400 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          {getListIcon("x", "size-5")}
        </button>
      )}
      <button
        type="submit"
        className="flex h-10 items-center justify-center overflow-hidden rounded-r-full bg-orange-500 px-4 text-white"
        aria-label="검색"
      >
        {getListIcon("search", "size-5")}
      </button>
    </form>
  );
};

export default BlogSearchBar;
