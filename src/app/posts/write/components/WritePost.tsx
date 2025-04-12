"use client";

import { ChangeEvent, useState } from "react";
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
  preview: string | null;
}

type FormValues = z.infer<typeof WritePostSchema>;

const WritePost = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(WritePostSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      agreedToTerms: false,
    },
  });

  const [images, setImages] = useState<{
    main: ImageInfo;
    sub: ImageInfo;
  }>({
    main: { file: null, preview: null },
    sub: { file: null, preview: null },
  });

  const title = watch("title");
  const content = watch("content");
  const agreedToTerms = watch("agreedToTerms");
  const categoryId = watch("categoryId");

  // 이미지 핸들러
  const handleImageChange = (type: "main" | "sub") => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImages((prev) => ({
        ...prev,
        [type]: {
          file,
          preview: URL.createObjectURL(file),
        },
      }));
    }
  };

  // 이미지 취소 핸들러
  const handleImageClear = (type: "main" | "sub") => () => {
    setImages((prev) => ({
      ...prev,
      [type]: { file: null, preview: null },
    }));
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: FormValues) => {
    if (!images.main.file) {
      toast.error("대표사진을 등록해주세요");
      return;
    }

    setIsPending(true);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, typeof value === "boolean" ? value.toString() : value);
      });

      // 이미지 파일 추가
      if (images.main.file) formData.append("mainImage", images.main.file);
      if (images.sub.file) formData.append("subImage", images.sub.file);

      const result = await writePostAction(null, formData);

      if (result.success) {
        toast.success("게시글이 성공적으로 등록되었습니다");
        reset();
        setImages({
          main: { file: null, preview: null },
          sub: { file: null, preview: null },
        });
        router.push(`/posts/${result.categoryId}/${result.postId}`);
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
    } finally {
      setIsPending(false);
    }
  };

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
          mainImageError={!images.main.file ? "대표사진을 등록해주세요" : undefined}
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
        <SubmitButton isPending={isPending} />
      </form>
    </div>
  );
};

export default WritePost;
