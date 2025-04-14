import { useEffect, useState } from "react";

export const usePreventLeave = () => {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      const handlePopState = () => {
        const shouldLeave = window.confirm("작성중인 내용이 삭제됩니다.");

        if (shouldLeave) {
          setIsDirty(false);

          // 히스토리 문제로 인해 이벤트 리스너 먼저 제거
          window.removeEventListener("popstate", handlePopState);
          window.history.go(-1);
        } else {
          window.history.pushState(null, "", window.location.href);
        }
      };

      // 현재 상태를 히스토리에 추가
      window.history.pushState(null, "", window.location.href);

      // 이벤트 리스너 등록
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isDirty]);

  return {
    setDirty: setIsDirty,
    resetDirty: () => setIsDirty(false),
  };
};
