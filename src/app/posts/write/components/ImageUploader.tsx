import { getListIcon } from "@/lib/iconMapping";
import { cn } from "@/lib/tailwindMerge";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";

interface ImageUploaderProps {
  id: string;
  labelText: string;
  isRequired?: boolean;
  errorMessage?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  imagePreview: string | null;
}

const ImageUploader = ({
  id,
  labelText,
  isRequired,
  errorMessage,
  onChange,
  onClear,
  imagePreview,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // base64 변환 없이 바로 onChange 호출
    onChange(e);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          "group relative flex h-[140px] w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-gray-50 transition-colors",
          errorMessage ? "border-red-500" : "hover:bg-gray-100",
        )}
        onClick={handleClick}
      >
        {imagePreview ? (
          <div className="relative size-full overflow-hidden rounded-lg">
            <Image
              src={imagePreview}
              alt={labelText}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 300px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-medium">변경하기</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white"
              aria-label="이미지 취소"
            >
              {getListIcon("x", "size-4 text-gray-700")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            {getListIcon("plus", "size-8 text-gray-400")}
            <span className="text-sm text-gray-500">클릭하여 이미지 추가</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          id={id}
          name={id}
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700">{labelText}</span>
        {isRequired && <span className="ml-1 text-orange-500">*</span>}
      </div>
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default ImageUploader;
