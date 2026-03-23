import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  ChevronDown,
  ShoppingCart,
  Heart,
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  Loader2,
  PackageSearch,
} from "lucide-react";
import { FilterPanel } from "./components/FilterPanel";
import { FilterOptions, Product } from "../../globals/types/productTypes";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  filterProducts,
  sortProducts,
  getProductAverageRating,
  getProductReviewCount,
} from "../../utils/helpers";
import { fetchProducts } from "../../store/productSlice";
import { AddToFavorite, removeFavorite } from "../../store/userFavouriteSlice";
import { addToCart } from "../../store/cartSlice";
import { Status } from "../../globals/statuses";
import { fetchAllReviews } from "../../store/reviewSlice";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_high", label: "Highest Rated" },
  { value: "rating_low", label: "Lowest Rated" },
];

const ITEMS_PER_PAGE = 8;

const Stars = ({ rating, count }: { rating: string; count?: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(parseFloat(rating)) ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95１-.69l１.０７-３．２９２z" />
        </svg>
      ))}
    </div>
    {count !== undefined && (
      <>
      <span className="text-xs text-black">{parseFloat(rating).toFixed(1)}</span>
      <span className="text-xs text-gray-500">({count})</span>
      </>
    )}
  </div>
);

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { product: allProducts = [], status } = useAppSelector(
    (state) => state.product
  );
  const { review: reviews } = useAppSelector((state) => state.review);
  const { userFavorite: favorites } = useAppSelector(
    (state) => state.favorite
  );

  const [filters, setFilters] = useState<FilterOptions>({});
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
      dispatch(fetchAllReviews());
  }, [dispatch]); 

  useEffect(() => {
  const cat = searchParams.get("category");
  if (cat) {
    setTimeout(() => {
      setCategoryFilter(cat);
    }, 100); 
  }
}, [searchParams]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 100);
  }, [filters, categoryFilter, sortBy, searchQuery]);

  const processedProducts = useMemo(() => {
    let result = allProducts.filter((p) =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    result = filterProducts(result, filters, reviews, categoryFilter);
    result = sortProducts(result, sortBy, reviews);
    return result;
  }, [allProducts, filters, categoryFilter, sortBy, searchQuery, reviews]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const currentItems = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount = [
    categoryFilter !== "all",
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
    filters.minRating !== undefined,
  ].filter(Boolean).length;

  const handleFavoriteToggle = (product: Product) => {
    const isFav = favorites.some((f) => f.id === product.id);
    if (isFav) dispatch(removeFavorite(product.id));
    else dispatch(AddToFavorite({ id: product.id }));
  };

  const handleAddToCart = (product: Product) => {
    if (!localStorage.getItem("token")) navigate("/login");
    else dispatch(addToCart(product.id));
  };

  const handleResetAll = () => {
    setFilters({});
    setCategoryFilter("all");
    setSortBy("relevance");
    setSearchQuery("");
  };

  if (status === Status.LOADING && allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading products…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Products
          </h1>
          <p className="text-md text-gray-600 mt-1">
            {processedProducts.length} product
            {processedProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="cursor-pointer lg:hidden relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer w-full sm:w-52 pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Main layout */}
        <div className="flex gap-6">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-6">
              <FilterPanel
                filters={filters}
                categoryFilter={categoryFilter}
                onFilterChange={setFilters}
                onCategoryChange={setCategoryFilter}
              />
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryFilter !== "all" && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    Category
                    <button onClick={() => setCategoryFilter("all")} className="cursor-pointer hover:text-red-500 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.minPrice !== undefined && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    Min Rs.{filters.minPrice}
                    <button onClick={() => setFilters({ ...filters, minPrice: undefined })} className="cursor-pointer hover:text-red-500 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.maxPrice !== undefined && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    Max Rs.{filters.maxPrice}
                    <button onClick={() => setFilters({ ...filters, maxPrice: undefined })} className="cursor-pointer hover:text-red-500 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.minRating !== undefined && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    {filters.minRating}+ Stars
                    <button onClick={() => setFilters({ ...filters, minRating: undefined })} className="cursor-pointer hover:text-red-500 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetAll}
                  className="cursor-pointer px-2.5 py-1 text-red-500 hover:text-red-700 text-xs font-medium underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Grid */}
            {currentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5">
                  {currentItems.map((product) => {
                    const isFavorited = favorites.some((f) => f.id === product.id);
                    const avgRating = getProductAverageRating(product.id, reviews);
                    const reviewCount = getProductReviewCount(product.id, reviews);

                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200"
                      >
                        <Link to={`/productdetails/${product.id}`}>
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={product.productImage}
                              alt={product.productName}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Info */}
                          <div className="p-4 flex-1">
                            <h3 className="mb-1.5 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition-colors leading-tight">
                              {product.productName}
                            </h3>

                            <div className="mb-2">
                              {reviewCount > 0 ? (
                                <Stars rating={avgRating.toString()} count={reviewCount} />
                              ) : (
                                <span className="text-[11px] text-gray-400 italic">No reviews yet</span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base font-bold text-indigo-700">
                                Rs {product.productPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Actions */}
                        <div className="px-4 pb-4 flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.productTotalStockQty === 0}
                            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">Add to Cart</span>
                            <span className="sm:hidden">Add</span>
                          </button>
                          <button
                            onClick={() => handleFavoriteToggle(product)}
                            className={`cursor-pointer w-10 flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all ${
                              isFavorited
                                ? "border-red-400 bg-red-50 text-red-500"
                                : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50"
                            }`}
                          >
                            <Heart
                              className="w-4 h-4"
                              fill={isFavorited ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap justify-center items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`cursor-pointer h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <PackageSearch className="w-9 h-9 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Try adjusting your filters or search term to find what you're looking for.
                </p>
                <button
                  onClick={handleResetAll}
                  className="cursor-pointer px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <FilterPanel
              filters={filters}
              categoryFilter={categoryFilter}
              onFilterChange={setFilters}
              onCategoryChange={setCategoryFilter}
              onClose={() => setShowMobileFilters(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </div>
  );
}