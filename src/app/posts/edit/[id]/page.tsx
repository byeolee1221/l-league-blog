import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WriteNoticeBar from "../../write/components/WriteNoticeBar";
import WritePost from "../../write/components/WritePost";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시글 수정",
  openGraph: {
    title: "게시글 수정",
  }
};

interface EditPageParams {
  params: Promise<{ id: string }>;
}

const EditPage = async ({ params }: EditPageParams) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access_token")?.value;

  if (!isLoggedIn) {
    redirect("/signin");
  }

  const postId = parseInt(id);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-28 md:px-6 lg:px-8">
      <WriteNoticeBar />
      <WritePost postId={postId} />
    </div>
  );
};

export default EditPage;
