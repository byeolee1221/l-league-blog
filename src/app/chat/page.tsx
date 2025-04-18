import { Metadata } from "next";

export const metadata: Metadata = {
  title: "채팅",
  openGraph: {
    title: "채팅",
  }
};

const ChatPage = () => {
  return <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-28 md:px-6 lg:px-8">ChatPage</div>;
};

export default ChatPage;

