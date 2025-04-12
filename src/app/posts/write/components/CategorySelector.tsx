import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/tailwindMerge";
import { getListIcon } from "@/lib/iconMapping";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedId: number | null;
  onChange: (id: number, name: string) => void;
  error?: string;
}

const CategorySelector = ({ categories, selectedId, onChange, error }: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSelectedName = () => {
    return categories.find((c) => c.id === selectedId)?.name || "카테고리 선택";
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="flex items-center text-sm font-semibold sm:text-base">
        카테고리
        <span className="ml-1 text-orange-500">*</span>
      </label>
      <div ref={ref} className="relative">
        <input type="hidden" name="categoryId" value={selectedId || ""} />
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-4 py-2.5 transition-colors",
            selectedId ? "text-gray-700" : "text-gray-400",
            isOpen ? "border-orange-500 ring-1 ring-orange-500" : "",
            error && "border-red-500",
          )}
        >
          <span>{getSelectedName()}</span>
          {getListIcon("arrowDown", cn("size-5 transition-transform", isOpen ? "rotate-180" : ""))}
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            {categories.map((category) => (
              <div
                key={category.id}
                className={cn(
                  "cursor-pointer px-4 py-2.5 hover:bg-gray-50",
                  selectedId === category.id ? "bg-orange-50 text-orange-500" : "",
                )}
                onClick={() => {
                  onChange(category.id, category.name);
                  setIsOpen(false);
                }}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default CategorySelector;
