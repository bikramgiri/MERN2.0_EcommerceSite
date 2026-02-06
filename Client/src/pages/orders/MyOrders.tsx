import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { deleteMyOrders, fetchMyOrder } from "../../store/checkoutSlice";
import { Status } from "../../globals/statuses";
import { OrderStatus } from '../../globals/types/checkoutTypes';
import { Search, Trash } from "lucide-react";
import Navbar from "../../globals/components/Navbar";
import Footer from "../../globals/components/Footer";

const MyOrders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myOrder: orders, status } = useAppSelector((state) => state.checkout);
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
  const totalPages = Math.ceil((orders ? orders.length : 0) / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders ? orders.slice(indexOfFirstItem, indexOfLastItem) : [];

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
      order.totalAmount.toString().includes(searchTerm) ||
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
        setMessage("Order deleted successfully!");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }, 0);
    }
  };

  if (orders === null) {
    return (
      <>
      </>
    );
  }

  return (
   <>
   <Navbar />
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-12 antialiased">
      <div className="mt-8 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
             {message && (
          <div className="mb-8 text-center">
            <p className="inline-block px-6 py-3 bg-green-100 text-green-800 font-medium rounded-full shadow-md">
              {message}
            </p>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
              My Orders
            </h2>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="cursor-pointer px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all-orders">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="In Transit">In Transit</option>
                <option value="Preparation">Preparation</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="cursor-pointer px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
                className="cursor-pointer px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200 border-b border-gray-200">
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
                            order.orderStatus === OrderStatus.Pending
                              ? "bg-yellow-100 text-yellow-800"
                              : order.orderStatus === OrderStatus.Preparation
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus === OrderStatus.Cancelled
                              ? "bg-red-100 text-red-800"
                              : order.orderStatus === OrderStatus.InTransit
                              ? "bg-blue-100 text-blue-800"
                              : order.orderStatus === OrderStatus.Delivered
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                              
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
                          <Trash className="inline-block w-4 h-4 mr-1 mb-1" />
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
   <Footer />
   </>
  );
};

export default MyOrders;
