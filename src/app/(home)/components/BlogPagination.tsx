import { cn } from "@/lib/tailwindMerge";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination = ({ currentPage, totalPages, onPageChange }: BlogPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex size-8 items-center justify-center rounded-full text-sm",
          currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100",
        )}
        aria-label="이전 페이지"
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm",
            currentPage === page ? "bg-orange-500 font-medium text-white" : "text-gray-700 hover:bg-gray-100",
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex size-8 items-center justify-center rounded-full text-sm",
          currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100",
        )}
        aria-label="다음 페이지"
      >
        &gt;
      </button>
    </div>
  );
};

export default BlogPagination;
