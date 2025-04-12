import { z } from "zod";

export const WritePostSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").max(30, "제목은 30자 이내로 입력해주세요."),
  categoryId: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "카테고리를 선택해주세요.",
  }),
  content: z.string().min(10, "내용은 10자 이상 입력해주세요."),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "이용 정책에 동의해주세요.",
  }),
});
