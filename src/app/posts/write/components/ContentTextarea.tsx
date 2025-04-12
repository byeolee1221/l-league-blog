import { cn } from "@/lib/tailwindMerge";

interface ContentTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const ContentTextarea = ({ value, onChange, error }: ContentTextareaProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="content" className="flex items-center text-sm font-semibold sm:text-base">
        내용(10자 이상)
        <span className="ml-1 text-orange-500">*</span>
      </label>
      <textarea
        id="content"
        name="content"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="블로그 글을 작성해주세요."
        className={cn(
          "h-[200px] resize-none rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none",
          error && "border-red-500",
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ContentTextarea;
