import { useEffect, useState, useRef } from "react";

// 이미지 정보를 관리하는 타입
export interface ImageInfo {
  file: File | null;
  base64: string | null;
  preview: string | null;
}

export interface PostImages {
  main: ImageInfo;
  sub: ImageInfo;
}

interface UsePostImagesProps {
  main: string | null;
  sub: string | null;
}

export const usePostImages = (initialImages?: UsePostImagesProps) => {
  // 이전 값을 저장할 ref 추가
  const prevMainImageRef = useRef<string | null>(null);
  const prevSubImageRef = useRef<string | null>(null);

  const [images, setImages] = useState<PostImages>({
    main: {
      file: null,
      base64: null,
      preview: initialImages?.main || null,
    },
    sub: {
      file: null,
      base64: null,
      preview: initialImages?.sub || null,
    },
  });

  // 수정모드에서의 initialImages 정상 표출
  useEffect(() => {
    const mainChanged = initialImages?.main !== prevMainImageRef.current;
    const subChanged = initialImages?.sub !== prevSubImageRef.current;

    if ((initialImages?.main && mainChanged) || (initialImages?.sub && subChanged)) {
      prevMainImageRef.current = initialImages.main;
      prevSubImageRef.current = initialImages.sub;

      setImages((prev) => ({
        main: {
          file: null,
          base64: null,
          preview: initialImages.main || prev.main.preview,
        },
        sub: {
          file: null,
          base64: null,
          preview: initialImages.sub || prev.sub.preview,
        },
      }));
    }
  }, [initialImages]);

  // 이미지 핸들러
  const handleImageChange = (type: "main" | "sub") => (file: File, base64: string, preview: string) => {
    setImages((prev) => ({
      ...prev,
      [type]: {
        file,
        base64,
        preview,
      },
    }));
  };

  // 이미지 취소 핸들러
  const handleImageClear = (type: "main" | "sub") => () => {
    setImages((prev) => ({
      ...prev,
      [type]: { file: null, base64: null, preview: null },
    }));
  };

  // 이미지 리셋
  const resetImages = () => {
    setImages({
      main: { file: null, base64: null, preview: null },
      sub: { file: null, base64: null, preview: null },
    });
  };

  // FormData에 이미지 추가
  const appendImagesToFormData = (formData: FormData, isEditMode: boolean) => {
    if (images.main.base64) {
      // 새로 업로드한 이미지가 있는 경우
      formData.append("mainImageBase64", images.main.base64);
    } else if (isEditMode && images.main.preview) {
      // 수정 모드에서 기존 이미지 URL이 있는 경우
      formData.append("mainImageUrl", images.main.preview);
    }

    if (images.sub.base64) {
      // 새로 업로드한 서브 이미지가 있는 경우
      formData.append("subImageBase64", images.sub.base64);
    } else if (isEditMode && images.sub.preview) {
      // 수정 모드에서 기존 서브 이미지 URL이 있는 경우
      formData.append("subImageUrl", images.sub.preview);
    }
  };

  // 메인 이미지 존재 여부 확인
  const hasMainImage = () => !!images.main.file || !!images.main.base64 || !!images.main.preview;

  return {
    images,
    handleImageChange,
    handleImageClear,
    resetImages,
    appendImagesToFormData,
    hasMainImage,
  };
};
