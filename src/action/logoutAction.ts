"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const logoutAction = async () => { 
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) { 
    return { error: "장시간 활동이 없어 로그아웃되었습니다." };
  }

  try {
    if (refreshToken) {
      await fetch(`${process.env.BASE_API_URL}/api/v1/auth/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
    }

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("로그아웃 실패", error);
    return { error: "로그아웃 처리 중 오류가 발생했습니다." };
  }
}
