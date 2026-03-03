import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { removeFromCart, updateCartItems } from "../../store/cartSlice";
import { ArrowLeft, Minus, Plus, Trash } from "lucide-react";
import { PaymentMethod, type ItemsDetails, type OrderData } from "../../globals/types/checkoutTypes";
import { createOrder } from "../../store/checkoutSlice";
import { Status } from "../../globals/statuses";

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems = [] } = useAppSelector((state => state.cart));
  const {khaltiUrl, status} = useAppSelector((state) => state.checkout);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [message, setMessage] = useState<string>("");

  const [data, setData] = useState<OrderData>({
    phoneNumber: "",
    totalAmount: 0,
    paymentDetails: {
      paymentMethod: PaymentMethod.COD,
    },
    shippingAddress: "",
    items: [],
    username: "",
    email: "",
    city: "",
    state: "",
    postalCode: 0,
    country: "Nepal",
    saveData: false,
  });


  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const paymentMethods = [
    {
      id: "cod",
      name: "COD",
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
    },
    {
      id: "esewa",
      name: "eSewa",
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
    },
  ];

const handlePaymentMethod = (e: ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value as PaymentMethod;
    setPaymentMethod(method);
    setData((prev) => ({
      ...prev,
      paymentDetails: {
        paymentMethod: method,
      },
    }));
  };

  const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage(""); 
    const itemsDetails:ItemsDetails[] = cartItems.map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity
        }
      });
      const orderData: OrderData = {
      phoneNumber: data.phoneNumber,
      shippingAddress: data.shippingAddress,
      totalAmount: total,
      paymentDetails: {
        paymentMethod: paymentMethod,
      },
      items: itemsDetails,
    };
    await dispatch(createOrder(orderData))
  }

  useEffect(() => {
    if (status === Status.SUCCESS) {
      if (paymentMethod !== PaymentMethod.Khalti) {
        setTimeout(() => {
          setMessage("Order placed successfully!");
          navigate("/");
          setMessage("");
        }, 2000);
      }
    } else if (status === Status.ERROR) {
      setTimeout(() => {
        setMessage("Failed to place the order");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }, 0);
    }
  }, [paymentMethod, navigate]);

  useEffect(() => {
    if (paymentMethod === PaymentMethod.Khalti && khaltiUrl) {
      setTimeout(() => {
        window.location.href = khaltiUrl;
      }, 1000);
    }
  }, [khaltiUrl, paymentMethod]);


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
    <section className="py-8 md:py-12 bg-gray-50 pb-16 mt-9 md:pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-2 mb-6 flex flex-col sm:flex-row items-center gap-1 sm:gap-6 md:gap-40 lg:gap-80">
          <button
            onClick={() => navigate("/cart")}
            className="cursor-pointer group inline-flex items-center justify-center px-2 py-2 bg-white border border-indigo-200 rounded-xl text-indigo-700 font-medium text-base sm:text-lg hover:shadow-sm hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-1 text-indigo-700" />
            Back to Cart
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 text-center sm:text-left flex-1">
            Checkout
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* <form onSubmit={handleSubmit}> */}
          <div className="space-y-8">
            <div
              className="bg-white rounded-xl p-6 md:p-8
            
            shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
  
              hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
              dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
  
              transition-shadow duration-500
            "
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Billing Details
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={data.username}
                      onChange={handleDataChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleDataChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    />
                  </div>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={billing.email}
                    onChange={handleBillingChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                  />
                </div> */}

                {/* <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={billing.phone}
                    onChange={handleBillingChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                  />
                </div> */}

                {/* <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={billing.address}
                    onChange={handleBillingChange}
                    placeholder="Enter your shipping address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                  />
                </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      required
                      value={data.phoneNumber}
                      onChange={handleDataChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      required
                      value={data.shippingAddress}
                      onChange={handleDataChange}
                      placeholder="Enter your shipping address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={data.city}
                      onChange={handleDataChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={data.state}
                      onChange={handleDataChange}
                      placeholder="Enter your state/province"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={data.country}
                      onChange={handleDataChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    >
                      <option value="">Select your country</option>
                      <option value="Nepal">Nepal</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={data.postalCode}
                      onChange={handleDataChange}
                      placeholder="Enter your postal code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-700 transition"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="saveData"
                    checked={data.saveData}
                    onChange={handleDataChange}
                    required
                    className="cursor-pointer w-5 h-5 text-indigo-700 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    Save this information for next time
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className="bg-white rounded-xl p-6 md:p-8

              shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
  
              hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
              dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
  
              transition-shadow duration-500
            "
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Payment Method
              </h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-3 border rounded-2xl cursor-pointer transition-all
                      ${
                        paymentMethod === method.name
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.name}
                      onChange={handlePaymentMethod}
                      checked={paymentMethod === method.name}
                      className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-4 flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        {method.icon}
                        <span className="text-lg font-medium text-gray-900">
                          {method.name}
                        </span>
                      </div>
                      {paymentMethod === method.name && (
                        <span className="text-indigo-600 font-semibold">
                          Selected
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Cart Items Review + Order Summary (matches Cart style) */}
          <div className="space-y-8">
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-6

                            shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
                            dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
  
                            hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
                            dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
                        "
                >
                  <Link
                    to={`/productdetails/${item.product.id}`}
                    className="overflow-hidden flex-shrink-0 rounded-md"
                  >
                    <img
                      src={item.product.productImage || "/placeholder.jpg"}
                      alt={item.product.productName}
                      className="w-full sm:w-40 h-30 object-cover rounded-sm"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <Link
                      to={`/productdetails/${item.product.id}`}
                      className="mb-2 text-2xl font-semibold text-gray-900 hover:text-indigo-700 transition"
                    >
                      {item.product.productName}
                    </Link>

                    <div className="mb-2 justify-between flex items-center ">
                      <div className="flex items-center gap-1">
                        <span className="flex items-center">
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
                        </span>
                        <p className="text-sm font-medium text-gray-600">
                          (5.0)
                        </p>
                        <p className="cursor-pointer text-sm font-medium leading-none text-gray-900 underline hover:underline">
                          12 Reviews
                        </p>
                      </div>
                      <p className="text-xl font-bold text-indigo-700">
                        Rs. {item.product.productPrice}
                      </p>
                    </div>

                      <div className="flex items-center justify-between ">
                        <div className="flex items-center justify-center sm:order-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity === 1}
                            className="cursor-pointer p-2 rounded-xl border border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            <Minus className="w-5 h-5" />
                          </button>

                          <span className="text-lg font-medium text-gray-900 min-w-12 text-center">
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
                            className="cursor-pointer p-2 rounded-xl border border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteItem(item.productId)}
                          className="order-1 sm:order-2 self-center sm:self-center cursor-pointer px-5 py-3 border border-gray-400 text-red-600 hover:text-red-700 font-medium flex items-center gap-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Sticky on desktop */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 top-24">
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
                <div className="border-t border-gray-400 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-indigo-700">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
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
                  <button className="px-5 py-3 bg-indigo-700 text-white font-medium rounded-xl hover:bg-indigo-800 transition shadow-md">
                    Apply
                  </button>
                </div>
              </div>

              {/* Place Order Button - Color based on payment method */}
              {paymentMethod === "COD" ? (
                <button type="button" 
                onClick={handlePlaceOrder}
                className="cursor-pointer w-full mt-8 py-4 bg-yellow-600 text-white text-lg font-semibold rounded-xl hover:bg-yellow-700 transition shadow-md">
                  Place Order
                </button>
              ) : paymentMethod === "Khalti" ? (
                <button type="button"
                onClick={handlePlaceOrder} 
                className="cursor-pointer w-full mt-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition shadow-md">
                  Pay with Khalti
                </button>
              ) : (
                <button type="button" 
                onClick={handlePlaceOrder}
                className="cursor-pointer w-full mt-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition shadow-md">
                  Pay with eSewa
                </button>
              )}
              {message && (
                <div className={`mt-4 p-4 rounded-lg text-center font-medium ${
                  status === Status.SUCCESS ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;