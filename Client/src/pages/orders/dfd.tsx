import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { deleteMyOrders, fetchMyOrder } from "../../store/checkoutSlice";
import { Status } from "../../globals/statuses";

const MyOrders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: orders, status } = useAppSelector((state) => state.checkout);
  const [message, setMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState("all-orders");
  const [selectedTime, setSelectedTime] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    dispatch(fetchMyOrder());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

    // Calculate total pages
  const totalPages = Math.ceil((orders?.length || 0) / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Filter orders based on selected item
  const filteredOrders =
    selectedItem === "all-orders"
      ? currentOrders
      : currentOrders.filter((order) => order.orderStatus === selectedItem);

  // Filter orders based on selected time
  const timeFilteredOrders = filteredOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    switch (selectedTime) {
      case "today":
        return orderDate >= new Date(now.setHours(0, 0, 0, 0));
      case "this-week":
        return orderDate >= new Date(now.setDate(now.getDate() - now.getDay()));
      case "this-month":
        return orderDate >= new Date(now.getFullYear(), now.getMonth(), 1);
      case "last-3-months":
        return orderDate >= new Date(now.setMonth(now.getMonth() - 3));
      case "last-6-months":
        return orderDate >= new Date(now.setMonth(now.getMonth() - 6));
      case "this-year":
        return orderDate >= new Date(now.getFullYear(), 0, 1);
      default:
        return true;
    }
  });

  // Search functionality
const searchedOrders = timeFilteredOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.Payment?.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (order.Payment?.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(order.createdAt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Date filter functionality but show all if date is not selected
  const dateFilteredOrders = searchedOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const selectedDate = new Date(date);
    return date
      ? orderDate.toDateString() === selectedDate.toDateString()
      : true;
  });

  const handleDeleteOrder = (id: string) => {
    dispatch(deleteMyOrders(id));
    if (status === Status.SUCCESS) {
      setTimeout(() => {
        setMessage("Order deleted successfully");
      }, 2000); 
    }
  };

  if (orders.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-6">
            You have no orders yet
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Looks like you haven't placed any orders yet.
          </p>
          <Link
            to="/"
            className="inline-block px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-12 antialiased">
      <div className="mt-24 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
             {message && (
          <div className="mb-8 text-center">
            <p className="inline-block px-6 py-3 bg-green-100 text-green-800 font-medium rounded-full shadow-md">
              {message}
            </p>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-blue-500 mb-4 sm:mb-0">
              My Orders
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  onChange={(e) => setSelectedItem(e.target.value)}
                  id="order-type"
                  className="w-full sm:w-40 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all-orders">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="pre-order">Pre-order</option>
                  <option value="transit">In Transit</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <span className="hidden font-medium sm:inline text-gray-400 mt-2">
                from
              </span>
              <div className="relative mr-8">
                <select
                  onChange={(e) => setSelectedTime(e.target.value)}
                  id="duration"
                  className="w-full sm:w-40 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
              <div className="relative">
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-gray-700"
                  placeholder="Search..."
                />
              </div>
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  className="p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-gray-700"
                  placeholder="Search..."
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
            </div>
          </div> */}

           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
              My Orders
            </h2>
          </div>

           {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all-orders">All Orders</option>
                <option value="pending">Pending</option>
                <option value="pre-order">Pre-order</option>
                <option value="transit">In Transit</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
                <option value="this-year">This Year</option>
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className=" text-gray-600 uppercase tracking-wider text-xs font-semibold">
                  <th className="py-4 px-4 text-center">Order ID</th>
                  <th className="py-4 px-4 text-center">Date</th>
                  <th className="py-4 px-4 text-center">Total Amount</th>
                  <th className="py-4 px-4 text-center">Order Status</th>
                  <th className="py-4 px-4 text-center">Payment Method</th>
                  <th className="py-4 px-4 text-center">Payment Status</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  dateFilteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="bg-gray-50 border-b border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                      <td className="py-4 px-4 text-center font-medium text-gray-700">
                        {order.id}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-700">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 font-medium text-center text-gray-700">
                        NPR {order.totalAmount}
                      </td>
                      <td className="py-4 px-4 text-center">
                           <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            order.orderStatus.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.orderStatus.toLowerCase() === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus.toLowerCase() === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.orderStatus.toLowerCase() === "transit"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-700">
                        {order.Payment?.paymentMethod || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-gray-700">
                        {order.Payment?.paymentStatus || "Pending"}
                      </td>
                      <td className="py-4 px-4 flex justify-center space-x-2">
                        {/* <button
                          type="button"
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Order
                        </button> */}
                        <button
                          onClick={() => {
                            navigate(`/myorders/orderdetails/${order.id}`);
                          }}
                          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          // onClick={handleDeleteOrder}
                          className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

              {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default MyOrders;
