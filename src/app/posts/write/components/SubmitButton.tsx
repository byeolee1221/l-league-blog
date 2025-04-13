import { getListIcon } from "@/lib/iconMapping";

interface SubmitButtonProps {
  isPending: boolean;
  label: string;
}

const SubmitButton = ({ isPending, label }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="mt-4 cursor-pointer rounded-lg bg-orange-500 px-4 py-3 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={isPending}
    >
      {isPending ? (
        <span className="flex items-center justify-center space-x-2">
          {getListIcon("spinner", "size-5 sm:size-6 animate-spin")}
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;
