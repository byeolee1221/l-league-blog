import { cn } from "@/lib/tailwindMerge";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const TitleInput = ({ value, onChange, error }: TitleInputProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="title" className="flex items-center text-sm font-semibold sm:text-base">
        타이틀(30자 이내)
        <span className="ml-1 text-orange-500">*</span>
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 30))}
        placeholder="타이틀을 입력해주세요."
        className={cn(
          "rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none",
          error && "border-red-500",
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TitleInput;
