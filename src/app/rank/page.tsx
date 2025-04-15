import { Metadata } from "next";

export const metadata: Metadata = {
  title: "랭킹",
  openGraph: {
    title: "랭킹",
  }
};

const RankPage = () => {
  return <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-28 md:px-6 lg:px-8">RankPage</div>;
};

export default RankPage;


