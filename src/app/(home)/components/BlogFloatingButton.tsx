import Image from "next/image";
import Link from "next/link";

const BlogFloatingButton = () => {
  return (
    <Link
      href="/posts/write"
      className="fixed right-6 bottom-20 z-30 rounded-full bg-orange-500 p-3 shadow-lg sm:right-8 sm:bottom-8"
      aria-label="글쓰기"
    >
      <Image src="/icons/icon_create.svg" alt="글쓰기" width={36} height={36} />
    </Link>
  );
};

export default BlogFloatingButton;
