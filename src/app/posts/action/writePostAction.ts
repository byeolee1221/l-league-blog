"use server";

import { cookies } from "next/headers";
import { WritePostSchema } from "../schema/writePostSchema";
import { uploadImage } from "./uploadImage";

export const writePostAction = async (prevState: unknown, formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { error: "로그인이 필요한 서비스입니다." };
    }

    // 클라이언트에서 넘어온 데이터 처리
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;
    const content = formData.get("content") as string;
    const mainImageBase64 = formData.get("mainImageBase64") as string;
    const subImageBase64 = formData.get("subImageBase64") as string | null;
    const agreedToTermsString = formData.get("agreedToTerms") as string;

    // 문자열을 불리언으로 변환
    const agreedToTerms = agreedToTermsString === "true";

    // 기본 데이터 Zod로 검증
    const validationResult = WritePostSchema.safeParse({
      title,
      categoryId,
      content,
      agreedToTerms,
    });

    if (!validationResult.success) {
      return { error: validationResult.error.flatten().fieldErrors };
    }

    // 이미지 검증
    if (!mainImageBase64) {
      return { error: { mainImage: "대표사진을 등록해주세요." } };
    }

    // 1. 메인 이미지 업로드
    const mainImageResult = await uploadImage(mainImageBase64);

    // 업로드 결과가 에러인지 확인
    if ("error" in mainImageResult) {
      return { error: { mainImage: mainImageResult.error } };
    }

    // 2. 서브 이미지 업로드 (있는 경우에만)
    let subImageURL = null;
    if (subImageBase64) {
      const subImageResult = await uploadImage(subImageBase64);

      // 업로드 결과가 에러인지 확인
      if ("error" in subImageResult) {
        return { error: { subImage: subImageResult.error } };
      }

      subImageURL = subImageResult.imageURL;
    }

    // 3. API에 전송할 데이터 준비 (검증된 데이터 사용)
    const postData = {
      title: validationResult.data.title,
      category: parseInt(validationResult.data.categoryId),
      content: validationResult.data.content,
      main_image: mainImageResult.imageURL,
      sub_image: subImageURL,
    };

    // 4. 게시글 등록 API 요청
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return {
          error: errorData?.message || errorData?.error || "게시글 등록 중 오류가 발생했습니다.",
        };
      } catch {
        return { error: "게시글 등록 중 오류가 발생했습니다." };
      }
    }

    const result = await response.json();
    return { success: true, postId: result.id, categoryId: result.category_id };
  } catch (error) {
    console.error("게시글 등록 중 오류 발생:", error);
    return { error: "게시글 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
};
