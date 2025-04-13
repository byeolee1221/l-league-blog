import Image from "next/image";

interface NoticeBarProps {
  description: string;
  isNoticeString: boolean;
}

export const NoticeBar = ({ description, isNoticeString }: NoticeBarProps) => {
  return (
    <div className="flex items-center rounded-full bg-orange-100 pr-6">
      <div className="flex items-center justify-center space-x-1 rounded-full border-2 border-orange-500 px-3 py-2 text-sm font-semibold">
        <div className="relative size-5">
          <Image src="/icons/icon_tip.svg" alt="공지" fill className="object-contain" />
        </div>
        {isNoticeString && <span className="whitespace-nowrap">공지</span>}
      </div>
      <p className="ml-4 text-xs font-medium whitespace-nowrap md:text-sm">{description}</p>
    </div>
  );
};
