"use server";

import { signinSchema } from "../schema/signinSchema";

export const signinAction = async (prevState: unknown, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!data.email || !data.password) {
    return { error: "이메일과 비밀번호를 입력해주세요." };
  }

  const validatedFields = signinSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      // 응답 코드에 따른 에러 메시지
      switch (response.status) {
        case 400:
          return { error: "요청 형식이 올바르지 않습니다." };
        case 401:
          return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
        case 403:
          return { error: "계정이 차단되었거나 접근 권한이 없습니다." };
        case 404:
          return { error: "요청한 서비스를 찾을 수 없습니다." };
        case 422:
          return { error: "입력하신 정보가 유효하지 않습니다." };
        case 429:
          return { error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." };
        case 500:
          return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
        case 503:
          return { error: "서비스가 일시적으로 이용 불가합니다. 잠시 후 다시 시도해주세요." };
        default:
          // 서버에서 에러 메시지를 전송한 경우 해당 메시지 사용
          return {
            error: errorData?.message || errorData?.error || "로그인 중 오류가 발생했습니다.",
          };
      }
    }

    const result = await response.json();
    return { success: true, access: result.access, refresh: result.refresh };
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
    return { error: "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
};
