import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WritePostSchema } from "@/app/posts/schema/writePostSchema";
import { z } from "zod";
import { useEffect } from "react";
import { PostData } from "@/types/post";

export type FormValues = z.infer<typeof WritePostSchema>;

interface UsePostFormProps {
  isEditMode: boolean;
  postData?: PostData;
  onFormChange?: () => void;
}

export const usePostForm = ({ isEditMode, postData, onFormChange }: UsePostFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(WritePostSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      agreedToTerms: isEditMode ? true : false,
    },
  });

  const { setValue, watch, reset } = form;

  // 폼 값들
  const title = watch("title");
  const content = watch("content");
  const agreedToTerms = watch("agreedToTerms");
  const categoryId = watch("categoryId");

  // 폼 변경 감지
  useEffect(() => {
    if (title || content || categoryId) {
      onFormChange?.();
    }
  }, [title, content, categoryId, onFormChange]);

  // 편집 모드일 때 데이터 설정
  useEffect(() => {
    if (isEditMode && postData) {
      setValue("title", postData.title);
      setValue("content", postData.content || "");
      setValue("categoryId", postData.category.id.toString());
      setValue("agreedToTerms", true);
    }
  }, [isEditMode, postData, setValue]);

  return {
    form,
    title,
    content,
    agreedToTerms,
    categoryId,
    resetForm: reset,
  };
};
