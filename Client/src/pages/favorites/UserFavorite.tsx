import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Status } from "../../globals/statuses";
import {
  fetchUserFavorites,
  removeFavorite,
} from "../../store/userFavouriteSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

const Favourites = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userFavorite: favorites, status } = useAppSelector(
    (state) => state.favorite,
  );

  useEffect(() => {
    dispatch(fetchUserFavorites());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeFavorite(productId));
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const currentItems = favorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (status === Status.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50 pb-16 mt-9 md:pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-1 mb-1 ">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer group inline-flex items-center px-2 py-2 bg-white border border-indigo-200 rounded-xl text-indigo-700 font-medium text-lg shadow-sm hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-700" />
            <span>Back to Products</span>
          </button>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-3xl font-bold text-indigo-800">
            My Favorites
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 mx-auto text-indigo-700 mb-6" />
            <h2 className="text-2xl font-medium text-gray-700 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Start adding products you love!
            </p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentItems.map((product) => (
              // <div
              //   key={product.id}
              //   className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 overflow-hidden hover:shadow-md transition-all"

              // >
              //   <Link to={`/productdetails/${product.id}`}>
              //     <div className="relative overflow-hidden h-56 bg-gray-100">
              //       <img
              //         src={product.productImage}
              //         alt={product.productName}
              //         className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              //       />
              //     </div>
              //   </Link>

              //   <div className="p-5">
              //     <Link to={`/productdetails/${product.id}`}>
              //       <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
              //         {product.productName}
              //       </h3>
              //     </Link>

              //     <div className="flex items-center justify-between mb-4">
              //       <span className="text-xl font-bold text-indigo-700">
              //         Rs {product.productPrice}
              //       </span>
              //       <button
              //         onClick={() => handleRemove(product.id)}
              //         className="text-red-500 hover:text-red-600 transition"
              //         title="Remove from favorites"
              //       >
              //         <Heart className="w-6 h-6 fill-current" />
              //       </button>
              //     </div>

              //     <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              //       <ShoppingCart className="w-5 h-5" />
              //       Add to Cart
              //     </button>
              //   </div>
              // </div>

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

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-amber-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-600">(5.0)</p>
                    </div>

                    <div className="flex items-center gap-2">
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
                <div className="p-5 border-t gap-2 border-gray-300 flex justify-between">
                  <button
                    type="button"
                    disabled={product.productTotalStockQty === 0}
                    className="cursor-pointer gap-2 flex items-center justify-center rounded-xl px-9 py-3 text-base font-semibold text-white bg-indigo-700 hover:bg-indigo-800 transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="cursor-pointer flex items-center justify-center rounded-xl px-9 py-3 text-base font-semibold border-2 border-indigo-700 text-red-500 hover:text-red-600 transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-6 h-6 fill-current" />
                  </button>
                  {/* <button
              onClick={() => handleRemove(product.id)}
              className="text-red-500 hover:text-red-600 transition"
              title="Remove from favorites"
            >
              <Heart className="w-6 h-6 fill-current" />
            </button> */}
                </div>
              </div>
            ))}
          </div>
        )}

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
    </section>
  );
};

export default Favourites;
