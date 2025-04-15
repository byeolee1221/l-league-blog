import WriteNoticeBar from "./components/WriteNoticeBar";
import WritePost from "./components/WritePost";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시글 작성",
};

const WritePage = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-28 md:px-6 lg:px-8">
      <WriteNoticeBar />
      <WritePost />
    </div>
  );
};

export default WritePage;

