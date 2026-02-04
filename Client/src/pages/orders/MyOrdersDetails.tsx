import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMySingleOrder } from "../../store/checkoutSlice";
import { Status } from "../../globals/statuses";
import { ArrowLeft, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import { APIAuthenticated } from "../../http";

const MyOrdersDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { singleOrder, status } = useAppSelector((state) => state.checkout);

  useEffect(() => {
    if (id) {
      dispatch(fetchMySingleOrder(id));
    }
  }, [dispatch, id]);

  const orderInfo = singleOrder?.[0]?.Order;
  const items = singleOrder || [];

  const totalProductAmount = items.reduce((sum, item) => {
    return sum + (item.Product?.productPrice || 0) * item.quantity;
  }, 0);

  const shipping = 200;
  const grandTotal = totalProductAmount + shipping;

  const adminOrderPageUrl = `http://localhost:5174/admin/orders/${id}`;

  const handleCancelOrder = async () => {
    try {
      const response = await APIAuthenticated.patch(`/users/orders/cancel/${id}`);
      if (response.status === 200) {
        navigate("/myorders");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await APIAuthenticated.delete(`/users/orders/${id}`);
      if (response.status === 200) {
        navigate("/myorders");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Loading State
  if (status !== Status.SUCCESS) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading order details...</p>
        </div>
      </section>
    );
  }

  // Not Found / Empty
  if (!singleOrder || singleOrder.length === 0 || !orderInfo) {
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
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-12 antialiased">
      <div className="mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <button
                    onClick={() => navigate("/myorders")} 
                     className="cursor-pointer mb-3 gap-2 text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center px-2 py-2 bg-white border border-indigo-200 rounded-xl text-lg shadow-sm hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"                  >
                    <ArrowLeft className="w-5 h-5 text-indigo-700" />
                    <span>Back to My Orders</span>
                  </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
              Order Details
            </h2>
            <p className="text-center text-white/90 mt-2 text-lg">
              Order ID: <span className="font-semibold">{id}</span>
            </p>
            <p className="text-center text-white/80 mt-1">
              Placed on{" "}
              {new Date(orderInfo.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Main Content - Two Columns on Large Screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Ordered Products - Left Column */}
            <div
              className="bg-white rounded-xl p-6 md:p-8
                shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
                dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
                hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
                dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
                transition-shadow duration-500
              "
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Ordered Products</h3>
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start gap-6 bg-gray-50 rounded-xl p-6 shadow-sm"
                  >
                    <img
                      src={item.Product.productImage}
                      alt={item.Product.productName}
                      className="w-full sm:w-32 sm:h-32 object-cover rounded-lg shadow-md"
                    />

                    <div className="flex-1 w-full">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {item.Product.productName}
                      </h4>
                      {item.Product.Category && (
                        <p className="text-sm text-gray-500 mt-1">
                          Category: {item.Product.Category.categoryName}
                        </p>
                      )}
                      <p className="text-gray-600 mt-2 line-clamp-3">
                        {item.Product.productDescription}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-lg">
                        <p className="font-medium">
                          Quantity: <span className="font-bold">{item.quantity}</span>
                        </p>
                        <p className="font-bold text-indigo-600 text-right">
                          NPR {item.Product.productPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div
              className="bg-white rounded-xl p-6 md:p-8
                shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
                dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
                hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
                dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
                transition-shadow duration-500
              "
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">NPR {totalProductAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">NPR {shipping}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-300">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">NPR {grandTotal.toFixed(2)}</span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Status</span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        orderInfo.orderStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : orderInfo.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : orderInfo.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : orderInfo.orderStatus === "Preparation"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {orderInfo.orderStatus}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{orderInfo.Payment?.paymentMethod || "N/A"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span
                      className={`font-medium ${
                        orderInfo.Payment?.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {orderInfo.Payment?.paymentStatus || "Pending"}
                    </span>
                  </div>

                  <h4 className="border-t border-gray-300 pt-4 text-xl font-bold">Customer Details</h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer</span>
                    <span className="font-medium">{orderInfo.User?.username}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{orderInfo.User?.email}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">{orderInfo.phoneNumber}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Address</span>
                    <span className="font-medium text-right max-w-xs">
                      {orderInfo.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div
            className="mx-4 mb-4 rounded-xl p-6 md:p-8 text-center bg-white
              shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
              hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
              dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
              transition-shadow duration-500
            "
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Scan QR for Admin View
            </h3>
            <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
              <QRCode value={adminOrderPageUrl} size={180} />
            </div>
          </div>

          {/* Actions Section */}
          <div
            className="mx-4 mb-4 rounded-xl p-6 md:p-8 bg-white border-t border-gray-200
              shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
              dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
              hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
              dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
              transition-shadow duration-500
            "
          >
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
              {orderInfo.orderStatus === "Pending" && (
                <>
                  <button
                    onClick={handleCancelOrder}
                    className="cursor-pointer px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                  >
                    Cancel Order
                  </button>

                  <button
                    onClick={() => navigate(`/myorders/orderdetails/editorders/${id}`)}
                    className="cursor-pointer px-8 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition font-medium"
                  >
                    Edit Order
                  </button>
                </>
              )}

              <button
                onClick={handleDeleteOrder}
                className="cursor-pointer px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-medium"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyOrdersDetails;