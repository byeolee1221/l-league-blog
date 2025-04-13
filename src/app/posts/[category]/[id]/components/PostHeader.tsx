import Image from "next/image";

interface PostHeaderProps {
  title: string;
  createdAt: string;
  userName: string;
  userImage?: string | null;
}

const PostHeader = ({ title, createdAt, userName, userImage }: PostHeaderProps) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mb-6">
      <h1 className="mb-4 text-2xl font-bold md:text-3xl">{title}</h1>
      <div className="flex items-center space-x-3">
        <div className="relative size-10 overflow-hidden rounded-full bg-gray-100">
          {userImage ? (
            <Image src={userImage} alt={userName || "사용자 이름"} fill className="object-cover" sizes="40px" />
          ) : (
            <div className="flex size-full items-center justify-center bg-gray-200 text-gray-500">
              {userName?.charAt(0) || "사용자"}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{userName || "익명"}</span>
          <time className="text-xs text-gray-500">{formattedDate}</time>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
