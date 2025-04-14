"use client";

import { PostData } from "@/types/post";
import { useEffect, useState } from "react";
import { getPostDetail } from "../action/getPostDetail";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import PostHeader from "./PostHeader";
import PostImages from "./PostImages";
import PostContent from "./PostContent";
import PostActionsMenu from "@/components/post/postActionsMenu";

interface PostDetailClientProps {
  postId: number;
}

const PostDetailClient = ({ postId }: PostDetailClientProps) => {
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsOwner(localStorage.getItem("isOwner") === "true");
  }, []);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getPostDetail(postId);

        if (data.success) {
          setPost(data.data);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        console.error("게시글 상세 조회 실패", error);
        toast.error("게시글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (!post) return null;

  const hasImage = post.main_image && post.main_image !== "";

  const handleDeleteSuccess = () => {
    router.push("/");
  };

  return (
    <article className="relative flex flex-col space-y-6">
      {isOwner && (
        <div className="absolute top-0 right-0">
          <PostActionsMenu postId={postId} hasImage={false} onSuccess={handleDeleteSuccess} />
        </div>
      )}

      <PostHeader
        title={post.title}
        createdAt={post.created_at}
        userName={post.user.name || "익명"}
        userImage={post.user.profile_image}
      />
      {!hasImage ? (
        <PostContent content={post.content || ""} categoryName={post.category.name} />
      ) : (
        <>
          <PostImages mainImage={post.main_image || ""} subImage={post.sub_image} />
          <PostContent content={post.content || ""} categoryName={post.category.name} />
        </>
      )}
    </article>
  );
};

export default PostDetailClient;

const PostDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200" />
      <div className="mb-6 flex items-center space-x-3">
        <div className="size-10 rounded-full bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
      <div className="mb-8 h-64 w-full rounded-lg bg-gray-200" />
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>
    </div>
  );
};
