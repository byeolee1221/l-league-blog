"use server";

import { cookies } from "next/headers";
import { PostSchema } from "../schema/writePostSchema";

export const writePostAction = async (prevState: unknown, formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { error: "로그인이 필요한 서비스입니다." };
    }

    const writePostData = {
      title: formData.get("title") as string,
      categoryId: formData.get("categoryId") as string,
      content: formData.get("content") as string,
      mainImage: formData.get("mainImage") as File,
      subImage: formData.get("subImage") as File,
      agreedToTerms: formData.get("agreedToTerms") as string,
    }

    // Zod를 사용한 입력 검증
    const validationResult = PostSchema.safeParse(writePostData);

    if (!validationResult.success) {
      return { error: validationResult.error.flatten().fieldErrors }
    }

    // 유효성 검증 통과 - API 요청 준비
    const data = new FormData();
    data.append("title", writePostData.title);
    data.append("categoryId", writePostData.categoryId);
    data.append("content", writePostData.content);
    if (writePostData.mainImage && writePostData.mainImage.size > 0) data.append("mainImage", writePostData.mainImage);
    if (writePostData.subImage && writePostData.subImage.size > 0) data.append("subImage", writePostData.subImage);

    // API 요청
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/blog`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      switch (response.status) {
        case 400:
          return { error: "잘못된 요청입니다." };
        case 401:
          return { error: "로그인이 필요한 서비스입니다." };
        case 403:
          return { error: "글 작성 권한이 없습니다." };
        case 500:
          return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
        default:
          return {
            error: errorData?.message || errorData?.error || "게시글 등록 중 오류가 발생했습니다.",
          };
      }
    }

    const result = await response.json();
    return { success: true, postId: result.id };
  } catch (error) {
    console.error("게시글 등록 중 오류 발생:", error);
    return { error: "게시글 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
};
