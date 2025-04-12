"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { writePostAction } from "@/app/posts/action/writePostAction";
import TitleInput from "./TitleInput";
import CategorySelector from "./CategorySelector";
import ContentTextarea from "./ContentTextarea";
import ImageUploaderSection from "./ImageUploaderSection";
import AgreeToTerms from "./AgreeToTerms";
import SubmitButton from "./SubmitButton";

const categories = [
  { id: 1, name: "일상생활" },
  { id: 2, name: "맛집소개" },
  { id: 3, name: "제품후기" },
  { id: 4, name: "IT정보" },
  { id: 5, name: "기타" },
];

const WritePost = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(writePostAction, null);

  // 상태 관리
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [subImagePreview, setSubImagePreview] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 서버 액션 결과 처리
  useEffect(() => {
    if (state?.success) {
      toast.success("게시글이 성공적으로 등록되었습니다.");
      router.push(`/posts/${categoryId}/${state.postId}`);
    } else if (state?.error && typeof state.error === "string") {
      toast.error(state.error);
    }
  }, [state, router, categoryId]);

  // 이미지 처리 핸들러
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMainImagePreview(imageUrl);
    }
  };

  const handleSubImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSubImagePreview(imageUrl);
    }
  };

  // 이미지 취소 핸들러 함수 추가
  const handleMainImageClear = () => {
    setMainImagePreview(null);
    // input의 value를 리셋
    if (formRef.current) {
      const input = formRef.current.querySelector("#mainImage") as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  const handleSubImageClear = () => {
    setSubImagePreview(null);
    // input의 value를 리셋
    if (formRef.current) {
      const input = formRef.current.querySelector("#subImage") as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  // 카테고리 변경 핸들러
  const handleCategorySelect = (id: number) => {
    setCategoryId(id);
  };

  // form 제출 전 유효성 검사
  const validateForm = () => {
    // 필수 필드만 간단히 확인하고, 자세한 검증은 Zod로 진행
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return false;
    }

    if (!categoryId) {
      toast.error("카테고리를 선택해주세요.");
      return false;
    }

    if (!agreedToTerms) {
      toast.error("이용 정책에 동의해주세요.");
      return false;
    }

    return true;
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* 글 작성 폼 */}
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col space-y-6"
        onSubmit={(e) => {
          if (!validateForm()) {
            e.preventDefault();
          }
        }}
      >
        {/* 제목 입력 */}
        <TitleInput value={title} onChange={setTitle} error={state?.error?.title} />

        {/* 이미지 업로드 */}
        <ImageUploaderSection
          mainImagePreview={mainImagePreview}
          subImagePreview={subImagePreview}
          onMainImageChange={handleMainImageChange}
          onSubImageChange={handleSubImageChange}
          onMainImageClear={handleMainImageClear}
          onSubImageClear={handleSubImageClear}
          mainImageError={state?.error?.mainImage}
        />

        {/* 카테고리 선택 */}
        <CategorySelector
          categories={categories}
          selectedId={categoryId}
          onChange={handleCategorySelect}
          error={state?.error?.categoryId}
        />

        {/* 내용 입력 */}
        <ContentTextarea value={content} onChange={setContent} error={state?.error?.content} />

        {/* 이용 약관 동의 */}
        <AgreeToTerms value={agreedToTerms} onChange={setAgreedToTerms} error={state?.error?.agreedToTerms} />

        {/* 제출 버튼 */}
        <SubmitButton isPending={isPending} />
      </form>
    </div>
  );
};

export default WritePost;
