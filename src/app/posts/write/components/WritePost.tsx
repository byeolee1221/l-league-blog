"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { writePostAction } from "@/app/posts/action/writePostAction";
import { WritePostSchema } from "@/app/posts/schema/writePostSchema";
import TitleInput from "./TitleInput";
import CategorySelector from "./CategorySelector";
import ContentTextarea from "./ContentTextarea";
import ImageUploaderSection from "./ImageUploaderSection";
import AgreeToTerms from "./AgreeToTerms";
import SubmitButton from "./SubmitButton";
import { z } from "zod";
import { getPostDetail } from "../../[category]/[id]/action/getPostDetail";
import { updatePostAction } from "../../action/updatePostAction";

const categories = [
  { id: 1, name: "일상생활" },
  { id: 2, name: "맛집소개" },
  { id: 3, name: "제품후기" },
  { id: 4, name: "IT정보" },
  { id: 5, name: "기타" },
];

// 이미지 정보를 관리하는 타입
interface ImageInfo {
  file: File | null;
  base64: string | null;
  preview: string | null;
}

type FormValues = z.infer<typeof WritePostSchema>;

interface WritePostProps {
  postId?: number;
}

const WritePost = ({ postId }: WritePostProps = {}) => {
  const isEditMode = !!postId;
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(isEditMode);

  const {
    handleSubmit,
    formState: { errors, isSubmitting, submitCount },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(WritePostSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      agreedToTerms: isEditMode ? true : false,
    },
  });

  const [images, setImages] = useState<{
    main: ImageInfo;
    sub: ImageInfo;
  }>({
    main: { file: null, base64: null, preview: null },
    sub: { file: null, base64: null, preview: null },
  });

  const title = watch("title");
  const content = watch("content");
  const agreedToTerms = watch("agreedToTerms");
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (isEditMode && postId) {
      const fetchPostData = async () => {
        try {
          const data = await getPostDetail(postId);

          if (data.success) {
            const postData = data.data;

            setValue("title", postData.title);
            setValue("content", postData.content);
            setValue("categoryId", postData.category.id.toString());
            setValue("agreedToTerms", true);

            setImages({
              main: {
                file: null,
                base64: null,
                preview: postData.main_image || null,
              },
              sub: {
                file: null,
                base64: null,
                preview: postData.sub_image || null,
              },
            });
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
  }, [isEditMode, postId, setValue, router]);

  // 이미지 핸들러
  const handleImageChange = (type: "main" | "sub") => (file: File, base64: string, preview: string) => {
    setImages((prev) => ({
      ...prev,
      [type]: {
        file,
        base64,
        preview,
      },
    }));
  };

  // 이미지 취소 핸들러
  const handleImageClear = (type: "main" | "sub") => () => {
    setImages((prev) => ({
      ...prev,
      [type]: { file: null, base64: null, preview: null },
    }));
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: FormValues) => {
    const hasNoMainImage = !images.main.file && !images.main.base64 && !images.main.preview;
    if (hasNoMainImage) {
      toast.error("대표사진을 등록해주세요");
      return;
    }

    try {
      const formData = new FormData();

      // 기본 데이터 추가
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, typeof value === "boolean" ? value.toString() : value);
      });

      // 이미지 파일 추가 (변경된 경우만)
      if (images.main.base64) {
        // 새로 업로드한 이미지가 있는 경우
        formData.append("mainImageBase64", images.main.base64);
      } else if (isEditMode && images.main.preview) {
        // 수정 모드에서 기존 이미지 URL이 있는 경우
        formData.append("mainImageUrl", images.main.preview);
      }

      if (images.sub.base64) {
        // 새로 업로드한 서브 이미지가 있는 경우
        formData.append("subImageBase64", images.sub.base64);
      } else if (isEditMode && images.sub.preview) {
        // 수정 모드에서 기존 서브 이미지 URL이 있는 경우
        formData.append("subImageUrl", images.sub.preview);
      }

      if (isEditMode && postId) {
        formData.append("postId", postId.toString());
      }

      const result = isEditMode ? await updatePostAction(null, formData) : await writePostAction(null, formData);

      if (result.success) {
        toast.success(isEditMode ? "게시글이 수정되었습니다" : "게시글이 등록되었습니다");
        if (!isEditMode) {
          reset();
          setImages({
            main: { file: null, base64: null, preview: null },
            sub: { file: null, base64: null, preview: null },
          });
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

  // 로딩 상태 표시
  if (isEditing) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-64 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        {/* 제목 입력 */}
        <TitleInput value={title} onChange={(value) => setValue("title", value)} error={errors.title?.message} />

        {/* 이미지 업로드 */}
        <ImageUploaderSection
          mainImagePreview={images.main.preview}
          subImagePreview={images.sub.preview}
          onMainImageChange={handleImageChange("main")}
          onSubImageChange={handleImageChange("sub")}
          onMainImageClear={handleImageClear("main")}
          onSubImageClear={handleImageClear("sub")}
          mainImageError={
            submitCount > 0 && !images.main.preview && !images.main.file ? "대표사진을 등록해주세요" : undefined
          }
        />

        {/* 카테고리 선택 */}
        <CategorySelector
          categories={categories}
          selectedId={categoryId ? parseInt(categoryId) : null}
          onChange={(id) => setValue("categoryId", id.toString())}
          error={errors.categoryId?.message}
        />

        {/* 내용 입력 */}
        <ContentTextarea
          value={content}
          onChange={(value) => setValue("content", value)}
          error={errors.content?.message}
        />

        {/* 이용 약관 동의 */}
        <AgreeToTerms
          value={agreedToTerms}
          onChange={(value) => setValue("agreedToTerms", value)}
          error={errors.agreedToTerms?.message}
        />

        {/* 제출 버튼 */}
        <SubmitButton isSubmitting={isSubmitting} label={isEditMode ? "수정하기" : "등록하기"} />
      </form>
    </div>
  );
};

export default WritePost;
