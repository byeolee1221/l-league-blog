"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { writePostAction } from "@/app/posts/action/writePostAction";
import TitleInput from "./TitleInput";
import CategorySelector from "./CategorySelector";
import ContentTextarea from "./ContentTextarea";
import ImageUploaderSection from "./ImageUploaderSection";
import AgreeToTerms from "./AgreeToTerms";
import SubmitButton from "./SubmitButton";
import { getPostDetail } from "../../[category]/[id]/action/getPostDetail";
import { updatePostAction } from "../../action/updatePostAction";
import { usePreventLeave } from "@/hooks/usePreventLeave";
import { usePostImages } from "@/hooks/usePostImages";
import { usePostForm, FormValues } from "@/hooks/usePostForm";
import { PostData } from "@/types/post";

const categories = [
  { id: 1, name: "일상생활" },
  { id: 2, name: "맛집소개" },
  { id: 3, name: "제품후기" },
  { id: 4, name: "IT정보" },
  { id: 5, name: "기타" },
];

interface WritePostProps {
  postId?: number;
}

const WritePost = ({ postId }: WritePostProps = {}) => {
  const isEditMode = !!postId;
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [postData, setPostData] = useState<PostData | undefined>(undefined);

  // 커스텀 훅 사용
  const { setDirty, resetDirty } = usePreventLeave();
  const { images, handleImageChange, handleImageClear, resetImages, appendImagesToFormData, hasMainImage } =
    usePostImages({
      main: postData?.main_image || null,
      sub: postData?.sub_image || null,
    });

  const { form, title, content, agreedToTerms, categoryId, resetForm } = usePostForm({
    isEditMode,
    postData,
    onFormChange: () => setDirty(true),
  });

  // images 변경 감지하여 isDirty 설정
  useEffect(() => {
    if (images.main.file || images.sub.file) {
      setDirty(true);
    }
  }, [images, setDirty]);

  // 초기 데이터 불러오기
  useEffect(() => {
    if (isEditMode && postId) {
      const fetchPostData = async () => {
        try {
          const data = await getPostDetail(postId);

          if (data.success) {
            setPostData(data.data);
            resetDirty(); // 초기 데이터 로드 후 상태 리셋
          } else {
            toast.error(data.error);
          }
        } catch (error) {
          console.error("게시글 불러오기 실패:", error);
          toast.error("게시글 데이터를 불러오는데 실패했습니다.");
          router.push("/");
        } finally {
          setIsEditing(false);
        }
      };

      fetchPostData();
    } else {
      setIsEditing(false);
    }
  }, [isEditMode, postId, router, resetDirty]);

  // 폼 제출 핸들러
  const onSubmit = async (data: FormValues) => {
    if (!hasMainImage()) {
      toast.error("대표사진을 등록해주세요");
      return;
    }

    try {
      const formData = new FormData();

      // 기본 데이터 추가
      Object.entries(data).forEach(([key, value]) => {
        // 타입 안전성을 위해 값의 타입에 따라 처리
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      // 이미지 추가
      appendImagesToFormData(formData, isEditMode);

      // 포스트 ID 추가 (수정 모드)
      if (isEditMode && postId) {
        formData.append("postId", postId.toString());
      }

      const result = isEditMode ? await updatePostAction(null, formData) : await writePostAction(null, formData);

      if (result.success) {
        resetDirty(); 
        toast.success(isEditMode ? "게시글이 수정되었습니다" : "게시글이 등록되었습니다");

        if (!isEditMode) {
          resetForm();
          resetImages();
        }

        router.replace(`/posts/${result.categoryId}/${result.postId}`);
      } else if (result.error) {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else {
          const firstError = Object.values(result.error).find((e) => e);
          if (firstError) toast.error(firstError as string);
        }
      }
    } catch (error) {
      console.error("게시글 등록 중 오류가 발생했습니다:", error);
      toast.error("게시글 등록 중 오류가 발생했습니다");
    }
  };

  // 로딩 상태 UI
  if (isEditing) {
    return <PostLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        {/* 제목 입력 */}
        <TitleInput
          value={title}
          onChange={(value) => form.setValue("title", value)}
          error={form.formState.errors.title?.message}
        />

        {/* 이미지 업로드 */}
        <ImageUploaderSection
          mainImagePreview={images.main.preview}
          subImagePreview={images.sub.preview}
          onMainImageChange={handleImageChange("main")}
          onSubImageChange={handleImageChange("sub")}
          onMainImageClear={handleImageClear("main")}
          onSubImageClear={handleImageClear("sub")}
          mainImageError={form.formState.submitCount > 0 && !hasMainImage() ? "대표사진을 등록해주세요" : undefined}
        />

        {/* 카테고리 선택 */}
        <CategorySelector
          categories={categories}
          selectedId={categoryId ? parseInt(categoryId) : null}
          onChange={(id) => form.setValue("categoryId", id.toString())}
          error={form.formState.errors.categoryId?.message}
        />

        {/* 내용 입력 */}
        <ContentTextarea
          value={content}
          onChange={(value) => form.setValue("content", value)}
          error={form.formState.errors.content?.message}
        />

        {/* 이용 약관 동의 */}
        <AgreeToTerms
          value={agreedToTerms}
          onChange={(value) => form.setValue("agreedToTerms", value)}
          error={form.formState.errors.agreedToTerms?.message}
        />

        {/* 제출 버튼 */}
        <SubmitButton isSubmitting={form.formState.isSubmitting} label={isEditMode ? "수정하기" : "등록하기"} />
      </form>
    </div>
  );
};

// 로딩 스켈레톤 컴포넌트 분리
const PostLoadingSkeleton = () => (
  <div className="flex flex-col space-y-4">
    <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
    <div className="h-64 w-full animate-pulse rounded bg-gray-200" />
    <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200" />
    <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
  </div>
);

export default WritePost;
