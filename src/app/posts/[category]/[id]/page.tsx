import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PostDetailClient from "./components/PostDetailClient";

interface PostDetailParams {
  params: Promise<{ id: string }>;
}

const PostDetail = async ({ params }: PostDetailParams) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access_token")?.value;

  if (!isLoggedIn) {
    redirect("/signin");
  }

  const postId = parseInt(id);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-20 pb-24 md:pt-24 lg:pt-28">
      <PostDetailClient postId={postId} />
    </div>
  );
};

export default PostDetail;
