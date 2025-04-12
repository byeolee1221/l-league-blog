import WriteNoticeBar from "./components/WriteNoticeBar";
import WritePost from "./components/WritePost";

const WritePage = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-28 md:px-6 lg:px-8">
      <WriteNoticeBar />
      <WritePost />
    </div>
  );
};

export default WritePage;

