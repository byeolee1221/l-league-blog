"use client";

import { PostData } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostActionsMenu from "@/components/post/postActionsMenu";

interface BlogPostCardProps {
  post: PostData;
  categoryName: string;
  isOwner?: boolean; // 게시글 작성자인지 확인
}

const BlogPostCard = ({ post, categoryName, isOwner = false }: BlogPostCardProps) => {
  const router = useRouter();

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
        <div className={`absolute top-2 right-2 ${!post.main_image ? "mt-2" : ""}`}>
          <PostActionsMenu postId={post.id || 0} hasImage={!!post.main_image} onSuccess={() => router.refresh()} />
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
