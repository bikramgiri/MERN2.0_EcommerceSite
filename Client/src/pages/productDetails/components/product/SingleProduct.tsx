import { useEffect, useState } from "react";
import { fetchSingleProduct } from "../../../../store/productSlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { ArrowLeft, Facebook, Heart, Loader2, Minus, Plus } from "lucide-react";
import { BsMessenger, BsWhatsapp } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Status } from "../../../../globals/statuses";
import { AddToFavorite, removeFavorite } from "../../../../store/userFavouriteSlice";

interface SingleProductProps {
  productId: string;
}

const SingleProduct = ({ productId }: SingleProductProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { singleProduct, status } = useAppSelector((state) => state.product);
    const { userFavorite: favorites } = useAppSelector((state) => state.favorite);

  // Local state for quantity
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId && productId !== "undefined") {
      dispatch(fetchSingleProduct(productId));
    } else {
      console.error("Invalid product ID:", productId);
    }
  }, [dispatch, productId]);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // if (status === "loading") {
  //   return (
  //     <div className="flex justify-center items-center min-h-[70vh]">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
  //     </div>
  //   );
  // }

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

  if (!singleProduct) {
    return (
      <div className="text-center py-20 text-xl text-red-600 min-h-[70vh] flex items-center justify-center">
        Product not found
      </div>
    );
  }


  if (!singleProduct) {
    return (
      <div className="text-center py-20 text-xl text-red-600 min-h-[70vh] flex items-center justify-center">
        Product not found
      </div>
    );
  }

  // Now singleProduct is guaranteed to exist → safe to use without ?
  const isFavorited = favorites.some((fav) => fav.id === singleProduct.id);

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      dispatch(removeFavorite(singleProduct.id));
    } else {
      dispatch(AddToFavorite({ id: singleProduct.id }));
    }
  };

  return (
    <section className="py-6 md:py-10 bg-gray-50 min-h-screen">
      <div>
        {/* Back to Products Button - Improved Design */}
        <div className="mt-10 ml-10">
          <button
            onClick={() => navigate("/")} // or navigate("/") if you prefer home
            className="cursor-pointer group inline-flex items-center px-2 py-2 bg-white border border-indigo-200 rounded-xl text-indigo-700 font-medium text-lg shadow-sm hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-700" />
            <span>Back to Products</span>
          </button>
        </div>
        {/* Main Product Container */}
        <div className="flex flex-col lg:flex-row lg:gap-12 bg-white  shadow-sm overflow-hidden">
          {/* Left - Image */}
          <div className="w-full lg:w-1/2 p-4 md:p-8 lg:p-10 bg-gray-50">
            <div className="overflow-hidden rounded-sm shadow-lg">
              <img
                className="w-full h-auto object-cover"
                src={singleProduct.productImage}
                alt={singleProduct.productName}
              />
            </div>
          </div>

          {/* Right - Details */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-10">
            {/* Product Name */}
            <h1 className="text-4xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {singleProduct.productName}
            </h1>
            {/* Price + Discount */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl md:text-2xl font-bold text-indigo-700">
                Rs. {singleProduct.productPrice}
              </span>
              {singleProduct.oldPrice && (
                <span className="text-xl text-gray-500 line-through">
                  Rs. {singleProduct.oldPrice}
                </span>
              )}
              {singleProduct.discount && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  -{singleProduct.discount}%
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="mb-6 flex gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  (5.0) • 1198 Ratings
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-md text-gray-800">Share via:</span>
                <button className="cursor-pointer text-blue-600 hover:text-blue-800">
                  <Facebook className="w-6 h-6" />
                </button>
                <button className="cursor-pointer text-green-600 hover:text-green-800">
                  <BsWhatsapp className="w-6 h-6" />
                </button>
                <button className="cursor-pointer text-blue-600 hover:text-blue-800">
                  <BsMessenger className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="block text-md font-medium text-gray-700 mb-8">
              Quantity: {singleProduct.productTotalStockQty}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className=" text-gray-800 h-4 w-4" />
              </button>
              <span className="w-12 text-center text-lg font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange("increase")}
                disabled={quantity === singleProduct.productTotalStockQty}
                className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className=" text-gray-800 h-4 w-4" />
              </button>
            </div>

            {/* Product Description */}
            <div className="prose max-w-none text-gray-700 leading-relaxed mb-6">
              <p className="text-base">{singleProduct.productDescription}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-8">
              <button
                type="button"
                disabled={singleProduct.productTotalStockQty === 0}
                className="cursor-pointer flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white bg-indigo-700 hover:bg-indigo-800 transition-colors shadow-md"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              {/* <button
                type="button"
                onClick={() =>
                  dispatch(AddToFavorite({ id: singleProduct.id }))
                }
                onClick={() => handleRemove(singleProduct.id)}
                className={`cursor-pointer flex flex-1 gap-3 items-center justify-center rounded-xl px-8 py-2 text-base font-semibold border-2 border-indigo-700 transition-colors ${
                  favorites.some((fav) => fav.id === singleProduct.id)
                    ? "text-red-500 border-indigo-700  "
                    : "text-indigo-700  hover:text-red-500 hover:bg-red-50 hover:border-red-700 "
                }`}
              >
                <Heart
                  className="w-6 h-6"
                  fill={
                    favorites.some((fav) => fav.id === singleProduct.id)
                      ? "currentColor"
                      : "none"
                  }
                />
                Add to Favourite
              </button> */}
              
              <button
                type="button"
                onClick={handleFavoriteToggle}
                className={`cursor-pointer flex flex-1 gap-3 items-center justify-center rounded-xl px-8 py-2 text-base font-semibold border-2 transition-colors ${
                  isFavorited
                    ? "text-red-500 border-red-700 bg-red-50"
                    : "text-indigo-600 border-indigo-700 hover:text-red-500 hover:bg-red-50 hover:border-red-600"
                }`}
              >
                <Heart
                  className="w-6 h-6"
                  fill={isFavorited ? "currentColor" : "none"}
                />
                Add to Favourite
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
