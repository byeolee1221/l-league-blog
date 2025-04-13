"use server";

import { cookies } from "next/headers";

interface UploadResponseSuccess {
  uploadURL: string;
  imageURL: string;
}

interface UploadResponseError {
  error: string;
}

type UploadResponse = UploadResponseSuccess | UploadResponseError;

export const uploadImage = async (base64Image: string): Promise<UploadResponse> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { error: "로그인이 필요한 서비스입니다." };
    }

    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/aws/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        file_name: base64Image,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("이미지 업로드 URL 요청 실패:", errorText);
      return { error: "이미지 업로드를 위한 URL을 가져오는데 실패했습니다." };
    }

    const { uploadURL, imageURL } = await response.json();

    console.log("업로드 URL:", uploadURL);
    return { uploadURL, imageURL };
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error);
    return { error: "이미지 업로드에 실패했습니다." };
  }
};
