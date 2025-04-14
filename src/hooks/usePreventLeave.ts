"use client";

import { useEffect, useState } from "react";

export const usePreventLeave = () => {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) return;

    // 브라우저 뒤로가기 처리
    const handlePopState = () => {
      const confirmMessage = "작성중인 내용이 삭제됩니다. 정말 나가시겠습니까?";

      if (!window.confirm(confirmMessage)) {
        // 취소한 경우 현재 URL 유지
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    // 새로고침/탭 닫기 처리
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return "";
    };

    // 이벤트 리스너 등록
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 클린업
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return {
    setDirty: (dirty = true) => setIsDirty(dirty),
    resetDirty: () => setIsDirty(false),
  };
};
