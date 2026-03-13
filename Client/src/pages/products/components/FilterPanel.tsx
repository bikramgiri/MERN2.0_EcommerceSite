import { useEffect, useState } from "react";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { FilterOptions } from "../../../globals/types/productTypes";
import { fetchCategories } from "../../../store/categorySlice";

interface FilterPanelProps {
  filters: FilterOptions;
  categoryFilter: string;
  onFilterChange: (filters: FilterOptions) => void;
  onCategoryChange: (categoryId: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterPanel({
  filters,
  categoryFilter,
  onFilterChange,
  onCategoryChange,
  onClose,
  isMobile = false,
}: FilterPanelProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [localCategory, setLocalCategory] = useState(categoryFilter);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setLocalFilters(filters);
    }, 100); // Add a small delay to ensure state updates correctly
    setTimeout(() => {
      setLocalCategory(categoryFilter);
    }, 100);
  }, [filters, categoryFilter]);

  const handleReset = () => {
    setLocalFilters({});
    setLocalCategory("all");
    onFilterChange({});
    onCategoryChange("all");
  };

  // const handleApply = () => {
  //   onFilterChange(localFilters);
  //   onCategoryChange(localCategory);
  //   onClose?.();
  // };

  return (
    <div
      className={`bg-white ${
        isMobile ? "h-full overflow-y-auto" : "rounded-xl border border-gray-200 shadow-sm"
      } p-5 space-y-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="cursor-pointer flex items-center gap-1 text-md text-gray-500 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset all
          </button>
          {isMobile && (
            <button onClick={onClose} className="cursor-pointer p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => { setLocalCategory("all"); onCategoryChange("all"); }}
            className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              localCategory === "all"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setLocalCategory(cat.id ?? "all"); onCategoryChange(cat.id ?? "all"); }}
              className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                localCategory === cat.id
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (NPR)</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Min</label>
            <input
              type="number"
              placeholder="0"
              min={0}
              value={localFilters.minPrice ?? ""}
              onChange={(e) => {
  const updated = {
    ...localFilters,
    minPrice: e.target.value ? Number(e.target.value) : undefined,
  };
  setLocalFilters(updated);
  onFilterChange(updated);
}}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Max</label>
            <input
              type="number"
              placeholder="Any"
              min={0}
              value={localFilters.maxPrice ?? ""}
              onChange={(e) => {
  const updated = {
    ...localFilters,
    maxPrice: e.target.value ? Number(e.target.value) : undefined,
  };
  setLocalFilters(updated);
  onFilterChange(updated);
}}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Minimum Rating */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Minimum Rating</h3>
        <div className="space-y-1.5">
          {[
            { label: "Any rating", value: 0 },
            { label: "2+ Stars", value: 2 },
            { label: "3+ Stars", value: 3 },
            { label: "4+ Stars", value: 4 },
            { label: "5 Stars only", value: 5 },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                value={opt.value}
                checked={
                  opt.value === 0 ? !localFilters.minRating : localFilters.minRating === opt.value
                }
               onChange={() => {
  const updated = {
    ...localFilters,
    minRating: opt.value === 0 ? undefined : opt.value,
  };
  setLocalFilters(updated);
  onFilterChange(updated);
}}
                className="w-4 h-4 text-indigo-600 cursor-pointer"
              />
              <span className="flex items-center gap-1.5 text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                {opt.value > 0 && (
                  <span className="flex">
                    {[...Array(opt.value)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </span>
                )}
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}