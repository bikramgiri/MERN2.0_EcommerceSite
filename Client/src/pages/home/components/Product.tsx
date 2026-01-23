import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { fetchProducts } from "../../../store/productSlice";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Status } from "../../../globals/statuses";
import { AddToFavorite } from "../../../store/userFavouriteSlice";

const Product = () => {
  const dispatch = useAppDispatch();
  const { product: products = [], status } = useAppSelector(
    (state) => state.product,
  );
  const { userFavorite: favorites } = useAppSelector((state) => state.favorite);

  const filterModalRef = useRef<HTMLDialogElement>(null);

  // Filter & Sort states
  const [searchBrand, setSearchBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get unique brands from products (dynamic)
  const allBrands = [
    ...new Set(products.map((p) => p.brand || "Unknown")),
  ].sort();

  // Filtered brands based on search
  const filteredBrands = allBrands.filter((brand) =>
    brand.toLowerCase().includes(searchBrand.toLowerCase()),
  );

  // Filtered & Sorted products
  const filteredProducts = products
    .filter((p) => {
      const matchBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(p.brand || "Unknown");
      const matchCategory =
        categoryFilter === "all" || p.Category?.categoryName === categoryFilter;
      const matchPrice =
        p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1];
      const matchRating =
        ratingFilter === 0 || (p.Ratings || 0) >= ratingFilter;
      return matchBrand && matchCategory && matchPrice && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === "price-low-high") return a.productPrice - b.productPrice;
      if (sortBy === "price-high-low") return b.productPrice - a.productPrice;
      if (sortBy === "name-a-z")
        return a.productName.localeCompare(b.productName);
      if (sortBy === "name-z-a")
        return b.productName.localeCompare(a.productName);
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1); // Reset to first page on filter/sort change
    }, 0);
  }, [
    selectedBrands,
    categoryFilter,
    priceRange,
    ratingFilter,
    sortBy,
    searchBrand,
  ]);

  // Loading State
  if (status === Status.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading product.....</p>
        </div>
      </div>
    );
  }

  // ERROR State
  if (status === Status.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Error loading product.....</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Sort */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-indigo-900 md:text-4xl">
            Products
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => filterModalRef.current?.showModal()}
              className="cursor-pointer flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"
                />
              </svg>
              Filters
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentItems.length > 0 ? (
            currentItems.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-indigo-300"
              >
                <Link to={`/productdetails/${product.id}`} key={product.id}>
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.discount && (
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700">
                      {product.productName}
                    </h3>

                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-amber-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        //     <Star key={i} className="h-4 w-4 text-amber-500" />
                      ))}
                      <span className="text-sm font-medium text-gray-700">
                        4.8
                      </span>
                      <span className="text-sm text-gray-500">(124)</span>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xl font-bold text-indigo-700">
                        Rs {product.productPrice}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-600 line-through">
                          Rs {product.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="p-5 border-t gap-4 border-gray-300 flex justify-between">
                  <button
                    type="button"
                    disabled={product.productTotalStockQty === 0}
                    className="cursor-pointer gap-2 flex items-center justify-center rounded-xl px-9 py-3 text-base font-semibold text-white bg-indigo-700 hover:bg-indigo-800 transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add
                  </button>
                  {/* <button
              type="button"
              className="cursor-pointer flex items-center justify-center rounded-xl px-8 py-2 text-base font-semibold text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              <Heart className="w-6 h-6" />
            </button> */}
                  <button
                    onClick={() => dispatch(AddToFavorite({ id: product.id }))}
                    className={`cursor-pointer flex items-center justify-center rounded-xl px-8 py-2 text-base font-semibold border-2 border-indigo-700 transition-colors ${
                      favorites.some((fav) => fav.id === product.id)
                        ? "text-red-500 border-indigo-700  "
                        : "text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-700 "
                    }`}
                  >
                    <Heart
                      className="w-6 h-6"
                      fill={
                        favorites.some((fav) => fav.id === product.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products match the selected filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white p-2 shadow-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-6 w-6 text-gray-800" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`cursor-pointer h-10 w-10 rounded-md text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight className="h-6 w-6 text-gray-800" />
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Filter Modal – centered on all screens */}
      <dialog
        id="filter-modal"
        ref={filterModalRef}
        className="modal modal-open mt-60 sm:mt-17 ml-6 sm:ml-8"
      >
        <div className="modal-box w-11/12 ml-8 max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl p-6 sm:p-8">
          <h3 className="mb-5 text-2xl font-bold text-indigo-900">Filters</h3>

          {/* Brand Search & Multi-select */}
          <div className="mb-4">
            <h4 className="mb-3 font-medium text-gray-800">Brand</h4>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {filteredBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(
                          selectedBrands.filter((b) => b !== brand),
                        );
                      }
                    }}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-base text-gray-700">{brand}</span>
                </label>
              ))}
              {filteredBrands.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">
                  No brands match your search
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <h4 className="mb-3 font-medium text-gray-800">Category</h4>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="burger">Burger</option>
              <option value="pizza">Pizza</option>
              <option value="pasta">Pasta</option>
              <option value="drink">Drink</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <h4 className="mb-3 font-medium text-gray-800">Price Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="mb-8">
            <h4 className="mb-3 font-medium text-gray-800">Minimum Rating</h4>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={3}>3+ Stars</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="modal-action flex justify-between gap-4">
            <button
              onClick={() => filterModalRef.current?.close()}
              className="cursor-pointer btn px-5 py-1 rounded-sm bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Apply Filters
            </button>

            <button
              onClick={() => {
                setSelectedBrands([]);
                setSearchBrand("");
                setCategoryFilter("all");
                setPriceRange([0, 10000]);
                setRatingFilter(0);
                filterModalRef.current?.close();
              }}
              className="cursor-pointer btn px-5 py-1 rounded-sm border-2 border-indigo-600 dark:bg-white text-gray-700 hover:text-white hover:bg-indigo-700"
            >
              Reset
            </button>

            <form method="dialog" className="modal-backdrop">
              <button className="cursor-pointer btn px-5 py-1 rounded-sm border-2 border-indigo-600 dark:bg-white text-gray-700 hover:text-white hover:bg-indigo-700">
                close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default Product;
