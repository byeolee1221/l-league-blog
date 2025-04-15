import { cookies } from "next/headers";
import BlogFloatingButton from "./components/BlogFloatingButton";
import BlogSection from "./components/BlogSection";
import MainNoticeBar from "./components/MainNoticeBar";
import ViewRanking from "./components/ViewRanking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "메인",
};

const Home = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("access_token");

  return (
    <main>
      <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-28 md:px-6 lg:px-8">
        <MainNoticeBar />
        <ViewRanking />
        <BlogSection isLoggedIn={isLoggedIn} />
      </div>
      {isLoggedIn && <BlogFloatingButton />}
    </main>
  );
};

export default Home;
