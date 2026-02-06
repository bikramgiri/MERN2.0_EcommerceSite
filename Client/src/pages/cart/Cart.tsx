// Cart.tsx - Safe rendering with proper keys and fallbacks

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { removeFromCart, updateCartItems } from "../../store/cartSlice";
import { ArrowLeft, Loader2, Minus, Plus, Trash } from "lucide-react";
import { Status } from "../../globals/statuses";
import Footer from "../../globals/components/Footer";
import Navbar from "../../globals/components/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems = [], status } = useAppSelector((state) => state.cart);

  const handleDeleteItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity);
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;
    if (quantity > item.product.productTotalStockQty) return;
    dispatch(updateCartItems({ ...item, quantity }));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce( 
    (sum, item) => sum + item.product.productPrice * item.quantity,
    0
  );
  const shipping = 70;
  const total = subtotal + shipping;

  if (status === Status.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-700 mx-auto mb-4" />
          <p className="text-xl text-gray-800">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="py-20 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-indigo-700 mb-6">Your Cart is Empty</h1>
          <p className="text-lg text-gray-700 mb-10">Looks like you haven't added anything yet.</p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-indigo-700 text-white font-semibold rounded-xl hover:bg-indigo-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
    <Navbar />
    <section className=" py-8 md:py-12 bg-gray-50 pb-16 mt-9 md:pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mt-2 mb-6 flex flex-col sm:flex-row items-center gap-1 sm:gap-6 md:gap-40 lg:gap-80">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer group inline-flex items-center justify-center px-2 py-2 bg-white border border-indigo-200 rounded-xl text-indigo-700 font-medium text-base sm:text-lg hover:shadow-sm hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-1 text-indigo-700" />
            Back to Products
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 text-center sm:text-left flex-1">
            Cart Products
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.productId} // Unique cart item key bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row gap-6
                className="bg-white rounded-xl p-6 flex flex-col sm:flex-row gap-6

              shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
  
              hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
              dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
  
              transition-shadow duration-500
                "
              >
                <Link
                  to={`/productdetails/${item.product.id}`}
                  className="overflow-hidden flex-shrink-0 rounded-sm"
                >
                  <img
                    src={item.product.productImage || "/placeholder.jpg"}
                    alt={item.product.productName}
                    className="w-full sm:w-50 h-40 object-cover rounded-md"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <span className="mb-2">
                    <Link
                      to={`/productdetails/${item.product.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-indigo-700 transition"
                    >
                      {item.product.productName}
                    </Link>
                    <p className="text-2xl font-bold text-indigo-700 mt-2">
                      Rs. {item.product.productPrice}
                    </p>
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
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
                    <p className="text-sm font-medium text-gray-600">(5.0)</p>
                    <p className="cursor-pointer text-sm font-medium leading-none text-gray-900 underline hover:underline">
                      12 Reviews
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1,
                          )
                        }
                        disabled={item.quantity === 1}
                        className="cursor-pointer p-1 rounded-xl border border-gray-400 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-5 h-5" />
                      </button>

                      {/* <input
                        type="number"
                        min="1"
                        max={item.product.productTotalStockQty}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") return; // allow clearing
                          const num = parseInt(val, 10);
                          if (isNaN(num) || num < 1) return;
                          handleQuantityChange(item.productId, num);
                        }}
                        className="text-center text-md font-semibold text-gray-900 outline-none border border-gray-300 rounded-md p-2"
                      /> */}
                      <span className="text-lg font-medium text-gray-900">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1,
                          )
                        }
                        disabled={
                          item.quantity >= item.product.productTotalStockQty
                        }
                        className="cursor-pointer p-1 rounded-xl border border-gray-400 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.productId)}
                      // className="text-red-600 hover:text-red-700 font-medium transition flex items-center gap-2"
                      className="px-3 py-3 cursor-pointer border border-gray-400 text-red-600 hover:text-red-700 font-medium flex items-center gap-2 bg-gray-100 text-lg rounded-xl hover:bg-gray-300 transition shadow-sm"
                    >
                      {/* <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg> */}
                      <Trash className="w-5 h-5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-8 
              shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
  
              hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
              dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
  
              transition-shadow duration-500
              ">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-gray-900">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    Rs. {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">
                    Rs. {shipping}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-indigo-700">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="cursor-pointer w-full mt-8 py-4 bg-indigo-700 text-white text-lg font-semibold rounded-xl hover:bg-indigo-800 transition shadow-md"
              >
                Proceed to Checkout
              </button>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Promo Code or Gift Card
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-2 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700"
                  />
                  <button className="cursor-pointer px-4 py-3 bg-indigo-700 text-white font-medium rounded-xl hover:bg-indigo-800 transition shadow-md">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Cart;