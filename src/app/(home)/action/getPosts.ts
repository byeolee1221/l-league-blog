"use server";

import { cookies } from "next/headers";

interface GetPostsParams {
  category_id?: number;
  category_name?: string;
  title?: string;
  page?: number;
  page_size?: number;
}

export const getPosts = async ({ category_id = 1, category_name, title, page = 1, page_size = 10 }: GetPostsParams) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const url = new URL(`${process.env.BASE_API_URL}/api/v1/blog`);

    if (category_id) url.searchParams.append("category_id", category_id.toString());
    if (category_name) url.searchParams.append("category_name", category_name);
    if (title) url.searchParams.append("title", title);
    if (page) url.searchParams.append("page", page.toString());
    if (page_size) url.searchParams.append("page_size", page_size.toString());

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      switch (response.status) {
        case 400:
          return { error: "잘못된 요청입니다." };
        case 401:
          return { error: "로그인이 필요한 서비스입니다." };
        case 403:
          return { error: "접근 권한이 없습니다." };
        case 404:
          return { error: "게시글을 찾을 수 없습니다." };
        case 500:
          return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
        default:
          return {
            error: errorData?.message || errorData?.error || "게시글을 불러오는 중 오류가 발생했습니다.",
          };
      }
    }

    const result = await response.json();

    return { success: true, data: result };
  } catch (error) {
    console.error("게시글 불러오기 중 오류 발생:", error);
    return { error: "게시글 불러오기 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
};
