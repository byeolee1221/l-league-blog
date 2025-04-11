import { NoticeBar } from "@/lib/noticeBar";

const MainNoticeBar = () => {
  return (
    <NoticeBar
      description="앱 출시 기념 각종 이벤트 진행 예정(공지사항 참고)"
      isNoticeString={true}
    />
  );
};

export default MainNoticeBar;
