"use server";

import { cookies } from "next/headers";
import { WritePostSchema } from "../schema/writePostSchema";
import { uploadImage } from "./uploadImage";
import { revalidatePath } from "next/cache";

export const updatePostAction = async (prevState: unknown, formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { error: "로그인이 필요한 서비스입니다." };
    }

    // 게시글 ID 확인
    const postIdString = formData.get("postId") as string;
    if (!postIdString || isNaN(parseInt(postIdString))) {
      return { error: "게시글 ID가 유효하지 않습니다." };
    }

    const postId = parseInt(postIdString);

    // 클라이언트에서 넘어온 데이터 처리
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;
    const content = formData.get("content") as string;
    const mainImageBase64 = formData.get("mainImageBase64") as string | null;
    const subImageBase64 = formData.get("subImageBase64") as string | null;
    const mainImageUrl = formData.get("mainImageUrl") as string | null;
    const subImageUrl = formData.get("subImageUrl") as string | null;
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
    if (!mainImageBase64 && !mainImageUrl) {
      return { error: { mainImage: "대표사진을 등록해주세요." } };
    }

    // 메인 이미지 처리 (새 이미지가 있는 경우에만 업로드)
    let mainImageUploadURL = mainImageUrl; // 기존 이미지 URL
    if (mainImageBase64) {
      // 새 이미지가 업로드된 경우에만 실행
      const mainImageResult = await uploadImage(mainImageBase64);

      if ("error" in mainImageResult) {
        return { error: { mainImage: mainImageResult.error } };
      }

      mainImageUploadURL = mainImageResult.imageURL;
    }

    // 서브 이미지 처리 (있는 경우에만)
    let subImageUploadURL = subImageUrl;
    if (subImageBase64) {
      // 새 서브 이미지가 업로드된 경우
      const subImageResult = await uploadImage(subImageBase64);

      if ("error" in subImageResult) {
        return { error: { subImage: subImageResult.error } };
      }

      subImageUploadURL = subImageResult.imageURL;
    }

    // API에 전송할 데이터 준비
    const postData = {
      title: validationResult.data.title,
      category: parseInt(validationResult.data.categoryId),
      content: validationResult.data.content,
      main_image: mainImageUploadURL,
      sub_image: subImageUploadURL,
    };

    // 게시글 수정 API 요청
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/blog/${postId}`, {
      method: "PATCH",
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
          error: errorData?.message || errorData?.error || "게시글 수정 중 오류가 발생했습니다.",
        };
      } catch {
        return { error: "게시글 수정 중 오류가 발생했습니다." };
      }
    }

    // 캐시 무효화
    revalidatePath("/");
    revalidatePath(`/posts/category-${validationResult.data.categoryId}/${postId}`);

    return {
      success: true,
      postId,
      categoryId: validationResult.data.categoryId,
    };
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    return { error: "게시글 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
};
