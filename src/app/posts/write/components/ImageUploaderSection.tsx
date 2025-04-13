import ImageUploader from "./ImageUploader";

interface ImageUploaderSectionProps {
  mainImagePreview: string | null;
  subImagePreview: string | null;
  onMainImageChange: (file: File, base64: string, preview: string) => void;
  onSubImageChange: (file: File, base64: string, preview: string) => void;
  onMainImageClear: () => void;
  onSubImageClear: () => void;
  mainImageError?: string;
}

const ImageUploaderSection = ({
  mainImagePreview,
  subImagePreview,
  onMainImageChange,
  onSubImageChange,
  onMainImageClear,
  onSubImageClear,
  mainImageError,
}: ImageUploaderSectionProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <label className="flex items-center text-sm font-semibold sm:text-base">
        사진
        <span className="ml-1 text-orange-500">*</span>
      </label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ImageUploader
          labelText="대표사진"
          id="mainImage"
          isRequired
          onChange={onMainImageChange}
          onClear={onMainImageClear}
          imagePreview={mainImagePreview}
          errorMessage={mainImageError}
        />
        <ImageUploader
          labelText="서브"
          id="subImage"
          onChange={onSubImageChange}
          onClear={onSubImageClear}
          imagePreview={subImagePreview}
        />
      </div>
    </div>
  );
};

export default ImageUploaderSection;
