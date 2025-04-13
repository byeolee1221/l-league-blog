"use server";

import { cookies } from "next/headers";
import { nanoid } from "nanoid";

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

    // MIME 타입 추출 (예: 'data:image/jpeg;base64,...' -> 'image/jpeg')
    const mimeMatch = base64Image.match(/data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    // 파일 확장자 추출
    const extension = mimeType.split("/")[1] || "jpg";

    // nanoid로 랜덤 파일명 생성 (확장자 포함)
    const fileName = `${nanoid(10)}.${extension}`;

    // API 서버에 파일 업로드 요청
    const response = await fetch(`${process.env.BASE_API_URL}/api/v1/aws/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        file_name: fileName,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("이미지 업로드 URL 요청 실패:", errorText);
      return { error: "이미지 업로드를 위한 URL을 가져오는데 실패했습니다." };
    }

    const { uploadURL, imageURL } = await response.json();

    // base64 이미지 데이터를 Blob으로 변환
    const base64Data = base64Image.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 1024) {
      const slice = byteCharacters.slice(i, i + 1024);
      const byteNumbers = new Array(slice.length);

      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: mimeType });

    // S3에 직접 업로드
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      body: blob,
    });

    if (!uploadResponse.ok) {
      console.error("S3 업로드 실패");
      return { error: "이미지 업로드에 실패했습니다." };
    }

    return { uploadURL, imageURL };
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error);
    return { error: "이미지 업로드에 실패했습니다." };
  }
};
