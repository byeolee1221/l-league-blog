import { getListIcon } from "@/lib/iconMapping";
import Image from "next/image";

const ViewRanking = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <Image src="/icons/icon_rank.svg" alt="조회수 랭킹" width={28} height={28} />
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-medium">조회수 TOP 10</p>
          {getListIcon("arrowForward", "text-2xl")}
        </div>
      </div>
    </div>
  );
};

export default ViewRanking;
