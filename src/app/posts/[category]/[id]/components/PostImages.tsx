"use client";

import { getListIcon } from "@/lib/iconMapping";
import Image from "next/image";
import { useState } from "react";

interface PostImagesProps {
  mainImage: string;
  subImage?: string | null;
}

const PostImages = ({ mainImage, subImage }: PostImagesProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentImage, setCurrentImage] = useState(mainImage);

  const toggleFullScreen = (image: string) => {
    setCurrentImage(image);
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="mb-6 space-y-4">
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
        onClick={() => toggleFullScreen(mainImage)}
      >
        <Image
          src={mainImage}
          alt="게시글 이미지"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      {subImage && (
        <div
          className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
          onClick={() => toggleFullScreen(subImage)}
        >
          <Image
            src={subImage}
            alt="게시글 서브 이미지"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setIsFullScreen(false)}
        >
          <div className="relative h-screen w-screen">
            <Image src={currentImage} alt="전체화면 이미지" fill className="object-contain" sizes="100vw" />
            <button
              className="absolute top-4 right-4 cursor-pointer rounded-full bg-white/20 p-2 text-white"
              onClick={() => setIsFullScreen(false)}
            >
              {getListIcon("x", "size-6")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostImages;
