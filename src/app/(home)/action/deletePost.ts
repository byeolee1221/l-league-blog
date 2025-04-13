"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deletePost = async (postId: number) => { 
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) { 
    return { error: "로그인이 필요한 서비스입니다." };
  }

  if (!postId) { 
    return { error: "존재하지 않는 게시글입니다." };
  }

  try {
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/blog/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) { 
      const errorData = await response.json().catch(() => null);

      switch (response.status) {
        case 400:
          return { error: "잘못된 요청입니다." };
        case 401:
          return { error: "로그인이 필요한 서비스입니다." };
        case 403:
          return { error: "해당 게시글을 삭제할 권한이 없습니다." };
        case 404:
          return { error: "게시글을 찾을 수 없습니다." };
        case 500:
          return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
        default:
          return { 
            error: errorData?.message || errorData?.error || "게시글 삭제 중 오류가 발생했습니다." 
          };
      }
    }

    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생", error);
    return { error: "게시글 삭제 중 오류가 발생했습니다." };
  }
}
