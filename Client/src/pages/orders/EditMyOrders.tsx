import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { editMyOrders, fetchMySingleOrder } from "../../store/checkoutSlice";
import { fetchProducts } from "../../store/productSlice";
import { ArrowLeft, Minus, PenBoxIcon, Plus } from "lucide-react";
import Navbar from "../../globals/components/Navbar";
import Footer from "../../globals/components/Footer";
import { PaymentMethod } from "../../globals/types/checkoutTypes";

const EditMyOrders = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");

  const { singleOrder } = useAppSelector((state) => state.checkout);
  const { product: products } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (id) {
      dispatch(fetchMySingleOrder(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const orderInfo = singleOrder?.[0]?.Order;
  const items = singleOrder || [];

  // Compute initial form data with useMemo (no setState in effect)
  const initialFormData = useMemo(() => {
    if (!orderInfo || items.length === 0) {
      return {
        items: [],
        totalAmount: 0,
        shippingAddress: "",
        paymentDetails: { paymentMethod: PaymentMethod.COD },
        phoneNumber: "",
      };
    }

    return {
      items: items.map((item) => ({
        productId: item.Product.id,
        productImage: item.Product.productImage || "",
        productName: item.Product.productName || "",
        productPrice: item.Product.productPrice || 0,
        quantity: item.quantity,
        categoryName: item.Product.category?.categoryName || "Uncategorized",
      })),
      totalAmount: orderInfo.totalAmount,
      shippingAddress: orderInfo.shippingAddress,
      paymentDetails: {
        paymentMethod:
          orderInfo.Payment?.paymentMethod === "Khalti"
            ? PaymentMethod.Khalti
            : PaymentMethod.COD,
      },
      phoneNumber: orderInfo.phoneNumber,
    };
  }, [orderInfo, items]);

  const [formData, setFormData] = useState(initialFormData);

  // Sync formData when initial data changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "paymentMethod") {
      setFormData((prev) => ({
        ...prev,
        paymentDetails: { paymentMethod: value as PaymentMethod },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateTotalAmount = (updatedItems: typeof formData.items) => {
    const subtotal = updatedItems.reduce(
      (acc, item) => acc + item.productPrice * item.quantity,
      0,
    );
    const shipping = 70;
    const total = subtotal + shipping;
    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
      items: updatedItems,
    }));
  };

  const handleQuantityChange = (index: number, delta: number) => {
    const updatedItems = [...formData.items];
    const item = updatedItems[index];
    const product = products.find((p) => p.id === item.productId);
    const maxStock = product?.productTotalStockQty || Infinity;

    const newQuantity = Math.max(1, Math.min(maxStock, item.quantity + delta));
    if (newQuantity !== item.quantity) {
      updatedItems[index] = { ...item, quantity: newQuantity };
      updateTotalAmount(updatedItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = {
      phoneNumber: formData.phoneNumber,
      shippingAddress: formData.shippingAddress,
      paymentDetails: { paymentMethod: formData.paymentDetails.paymentMethod },
      items: formData.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: formData.totalAmount,
    };

    try {
      await dispatch(editMyOrders(id!, submitData));
      setMessage("Order updated successfully");
      setTimeout(() => {
        setMessage("");
        navigate(`/myorders/orderdetails/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Failed to update order:", err);
      setMessage("Failed to update order");
    }
  };

  // if (checkoutStatus === Status.LOADING) {
  //   return (
  //     <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
  //         <p className="text-xl text-gray-700">Loading order details...</p>
  //       </div>
  //     </section>
  //   );
  // }

  if (!orderInfo || items.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-6">
            Order Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            We couldn't find the order you're looking for.
          </p>
          <button
            onClick={() => navigate("/myorders")}
            className="inline-block px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            Back to My Orders
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-12 antialiased">
        <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/myorders/orderdetails/${id}`)}
            className="cursor-pointer mb-3 gap-2 text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center px-2 py-2 bg-white border border-indigo-200 rounded-xl text-lg shadow-sm hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-700" />
            <span>Back to Order Details</span>
          </button>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 md:p-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
                Order Details
              </h2>
              <p className="text-center text-white/90 mt-2 text-lg">
                Edit Order ID: <span className="font-semibold">{id}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div
                  className="bg-white rounded-xl p-4 md:p-4
                shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
                dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
                hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
                dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
                transition-shadow duration-500"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Products
                  </h3>
                  <div className="space-y-6">
                    {formData.items.map((item, index) => {
                      const product = products.find(
                        (p) => p.id === item.productId,
                      );
                      const maxStock =
                        product?.productTotalStockQty || Infinity;

                      return (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row items-start gap-4 bg-gray-50 rounded-sm p-4
                shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
                dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
                hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
                dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
                transition-shadow duration-500
                "
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full sm:w-32 sm:h-32 object-cover rounded-lg shadow-md"
                          />

                          <div className="flex-1 w-full">
                            <h4 className="text-xl font-semibold text-gray-900">
                              {item.productName}
                            </h4>
                            <p className="font-md text-md mt-2">
                              Category: {item.categoryName}
                            </p>
                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">Quantity:</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(index, -1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="cursor-pointer p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-4 text-center font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, 1)}
                                  disabled={item.quantity >= maxStock}
                                  className="cursor-pointer p-1.5 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-lg font-bold text-indigo-600">
                                  NPR {item.productPrice * item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div
                  className="bg-white rounded-xl p-6 md:p-8
                shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
                dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
                hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
                dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
                transition-shadow duration-500"
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">
                    Order Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        NPR {(formData.totalAmount - 70).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">
                        NPR 70
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-4 border-t border-gray-300">
                      <span>Total Amount</span>
                      <span className="text-indigo-600">
                        NPR {formData.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 p-6 lg:p-4
           rounded-md bg-white border-t border-gray-200
              shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
              hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
              dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
              transition-shadow duration-500
              "
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentDetails.paymentMethod}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    required
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Khalti">Khalti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg bg-gray-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full py-4 bg-yellow-600 text-white text-lg font-semibold rounded-xl hover:bg-yellow-700 transition"
              >
                <PenBoxIcon className="w-5 h-5 inline-block mr-2" />
                Update Order
              </button>
            </form>

            {message && (
              <p
                className={`mb-2 text-center text-lg ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditMyOrders;
