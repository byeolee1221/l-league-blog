import Link from "next/link";
import { cn } from "@/lib/tailwindMerge";
import { getListIcon } from "@/lib/iconMapping";

interface AgreeToTermsProps {
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
}

const AgreeToTerms = ({ value, onChange, error }: AgreeToTermsProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div
          onClick={() => onChange(!value)}
          className={cn(
            "mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-colors",
            value ? "border-orange-500 bg-orange-500" : "border-gray-300",
            error && "border-red-500",
          )}
        >
          {value && getListIcon("check", "size-3.5 text-white")}
        </div>
        <input type="hidden" name="agreedToTerms" value={value ? "true" : "false"} />
        <span className="text-sm text-gray-600">
          Blog 이용 정책 약관 시 글 작성에 동의합니다.
          <Link href="#" className="ml-1 text-orange-500">
            (보기)
          </Link>
        </span>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AgreeToTerms;
