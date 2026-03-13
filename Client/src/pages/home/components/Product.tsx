import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { fetchProducts } from "../../../store/productSlice";
import {
  Heart,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Status } from "../../../globals/statuses";
import { AddToFavorite, removeFavorite } from "../../../store/userFavouriteSlice";
import { addToCart } from "../../../store/cartSlice";

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product: products = [], status } = useAppSelector((state) => state.product);
  const { userFavorite: favorites } = useAppSelector((state) => state.favorite);


  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

    if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-red-600 min-h-[70vh] flex items-center justify-center">
        Product not found
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-indigo-900 md:text-3xl">
            Just For You
          </h1>

          {/* <div className="flex flex-wrap items-center gap-3">
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
          </div> */}

          <Link to="/products" className="text-xl underline font-medium text-indigo-600 hover:text-indigo-700 md:text-xl">
            All Products
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.filter((p) => ["Cap", "Bulb", "Charger", "Noodle"].includes(p.productName)).map((product) => {
              const isFavorited = favorites.some(
                (fav) => fav.id === product.id,
              );

              // Toggle handler for this product
              const handleFavoriteToggle = () => {
                if (isFavorited) {
                  dispatch(removeFavorite(product.id));
                } else {
                  dispatch(AddToFavorite({ id: product.id }));
                }
              };

                //  const handleAddToCart = () => {
                //    if (
                //      localStorage.getItem("token") == "" ||
                //      localStorage.getItem("token") == null ||
                //      localStorage.getItem("token") == undefined
                //    ) {
                //      navigate("/login");
                //    } else {
                //      if (product.id && product) {
                //        dispatch(addToCart(product.id));
                //      }
                //    }
                //  };

                const handleAddToCart = () => {
                  if (!localStorage.getItem("token")) {
                    navigate("/login");
                  } else {
                    if (product.id && product) {
                      dispatch(addToCart(product.id));
                    }
                  }
                };

                // // *Or
                //     const handleAddToCart = () => {
                //     if (!localStorage.getItem("token")) {
                //       navigate("/login");
                //       return;
                //     }
                
                //     if (!product) return;
                
                //     const existingItem = cartItems.find((i) => i.productId === product.id);
                
                //     if (existingItem) {
                //       // Update existing item to new quantity
                //       dispatch(updateCartItems({ ...existingItem, quantity: localQuantity }));
                //     } else {
                //       // Add new item with selected quantity
                //       // Since addToCart adds 1 each time, call it localQuantity times
                //       for (let i = 0; i < localQuantity; i++) {
                //         dispatch(addToCart(product.id));
                //       }
                //     }
                //   };

              return (
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
                      onClick={handleAddToCart}
                      disabled={product.productTotalStockQty === 0}
                      className="cursor-pointer gap-2 flex items-center justify-center rounded-xl px-9 py-3 text-base font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed text-white bg-indigo-700 hover:bg-indigo-800 transition-colors"
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
                      onClick={handleFavoriteToggle}
                      className={`cursor-pointer flex items-center justify-center rounded-xl px-8 py-2 text-base font-semibold border-2 transition-colors ${
                        isFavorited
                          ? "text-red-500 border-red-700 bg-red-50  "
                          : "text-indigo-600 border-indigo-700 hover:text-red-500 hover:bg-red-50 hover:border-red-600"
                      }`}
                    >
                      <Heart
                        className="w-6 h-6"
                        fill={isFavorited ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products match the selected filters.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Product;
