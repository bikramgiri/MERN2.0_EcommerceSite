import { useEffect, useState } from "react";
import {
  deleteReview,
  fetchProductReviews,
} from "../../../../store/reviewSlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import toast from "react-hot-toast";
import { Edit, PencilIcon, Trash2 } from "lucide-react";
import type { Review } from "../../../../globals/types/reviewTypes";
import AddReview from "./AddReview";
import EditReview from "./EditReview";
// import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";

interface SingleProductProps {
  productId: string;
}

const Review = ({ productId }: SingleProductProps) => {
  const dispatch = useAppDispatch();
  const { review } = useAppSelector((state) => state.review);
  const { user } = useAppSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const openAddModal = () => {
    setSelectedReview(productId ? null : selectedReview); 
    setShowModal(true);
  };

  const openEditModal = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReview(null);
  };

  const handleSuccess = () => {
      // dispatch(fetchProductReviews(productId));
    toast.success(
      selectedReview
        ? "Review updated successfully!"
        : "Review added successfully!",
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("allstar");
  const [sort, setSort] = useState("default");

  const itemsPerPage = 2;

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 500);
  }, [filter, sort]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Safe average rating calculation
  const averageRating =
    review && review.length > 0
      ? (
          review.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
          review.length
        ).toFixed(1)
      : "0.0";

  const hasRating = (rating: number) =>
    review?.some((r) => Number(r.rating) === rating) ?? false;

  // Filter reviews
  const filteredReviews =
    filter === "allstar"
      ? review || []
      : (review || []).filter(
          (r) => Number(r.rating) === Number(filter.replace("star", "")),
        );

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sort) {
      case "recent":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "highest":
        return Number(b.rating || 0) - Number(a.rating || 0);
      case "lowest":
        return Number(a.rating || 0) - Number(b.rating || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const productName = review?.[0]?.Product?.productName || "This Product";

  // const isLoggedIn = localStorage.getItem("token") && localStorage.getItem("user");

  // *OR

  // // Get token from localStorage or cookie
  // const getEffectiveToken = () => {
  //   // LocalStorage first (higher priority if exists)
  //   let token = localStorage.getItem("token")

  //   // Fallback to cookie
  //   if (!token) {
  //     const tokenCookie = document.cookie
  //       .split('; ')
  //       .find(row => row.startsWith('token='));
  //     if (tokenCookie) {
  //       token = tokenCookie.split('=')[1];
  //     }
  //   }
  //   return token;
  // };

  // const userExist = localStorage.getItem("user")
  // const isLoggedIn = token || getEffectiveToken() && userExist;

  const handleDelete = (reviewId: string) => {
    dispatch(deleteReview(reviewId));
    toast.success("Review deleted successfully.");
  };

  // if (status === Status.LOADING) {
  //   return (
  //     <div className="py-10 px-4 max-w-7xl mx-auto">
  //       <div className="animate-pulse space-y-6">
  //         <div className="h-8 w-64 bg-gray-300 rounded"></div>
  //         <div className="space-y-4">
  //           {[...Array(3)].map((_, i) => (
  //             <div key={i} className="flex flex-col sm:flex-row gap-4">
  //               <div className="h-20 w-20 bg-gray-300 rounded"></div>
  //               <div className="flex-1 space-y-3">
  //                 <div className="h-6 w-48 bg-gray-300 rounded"></div>
  //                 <div className="h-4 w-32 bg-gray-300 rounded"></div>
  //                 <div className="h-20 w-full bg-gray-300 rounded"></div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  //     if (status === Status.LOADING) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-white">
  //       <div className="text-center">
  //         <Loader2 className="w-16 h-16 animate-spin text-blue-700 mx-auto mb-4" />
  //         <p className="text-xl text-gray-800">Loading reviews...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <section className="bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {review && review.length > 0
              ? `Ratings & Reviews of ${productName}`
              : "Ratings & Reviews"}
          </h1>

          {/* If no reviews */}
          {!review || review.length === 0 ? (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                No reviews for {productName} yet.
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to share your thoughts on this product!
              </p>
              <button
                onClick={openAddModal}
                className="cursor-pointer inline-block px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <>
              {/* Rating Summary */}
              <div className="py-6 md:py-10 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12">
                  <div className="text-center sm:text-left">
                    <div className="text-5xl md:text-6xl font-bold text-gray-900">
                      {averageRating}
                    </div>
                    <div className="font-medium text-2xl text-gray-500">
                      out of 5
                    </div>
                    <div className="mt-2 flex justify-center sm:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(Number(averageRating))
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-2 text-lg text-gray-600">
                      Based on {review.length} review
                      {review.length !== 1 ? "s" : ""}
                    </p>
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="cursor-pointer inline-flex gap-1 mt-2 items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors w-full sm:w-auto"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Write a Review
                    </button>
                  </div>

                  <div className="flex-1 space-y-4 sm:space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        review?.filter((r) => Number(r.rating) === rating)
                          .length || 0;
                      const percentage =
                        review?.length > 0 ? (count / review.length) * 100 : 0;

                      return (
                        <div key={rating} className="flex items-center">
                          <span className="w-6 sm:w-8 text-start text-md sm:text-base font-medium text-gray-900">
                            {rating}
                          </span>

                          <div className="flex items-center gap-2 flex-1">
                            {/* Stars */}
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-6 h-6 ${
                                    i < rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2.5 flex-1 bg-gray-300 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>

                          <span className="w-10 sm:w-12 text-right text-md sm:text-base font-medium text-gray-900">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Product Reviews
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                    {/* Filter */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Filter by:
                      </span>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="cursor-pointer flex-1 px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                      >
                        <option value="allstar">All Stars</option>
                        <option value="5star" disabled={!hasRating(5)}>
                          5 Stars
                        </option>
                        <option value="4star" disabled={!hasRating(4)}>
                          4 Stars
                        </option>
                        <option value="3star" disabled={!hasRating(3)}>
                          3 Stars
                        </option>
                        <option value="2star" disabled={!hasRating(2)}>
                          2 Stars
                        </option>
                        <option value="1star" disabled={!hasRating(1)}>
                          1 Star
                        </option>
                      </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Sort by:
                      </span>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="cursor-pointer flex-1 px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                      >
                        <option value="default">Default</option>
                        <option value="recent">Most Recent</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-1 border-t border-gray-300">
                {currentItems.map((review) => {
                  const renderAvatar = (size: "small" | "large") => {
                    const avatarSize =
                      size === "small" ? "w-10 h-10" : "w-12 h-12";
                    const textSize = size === "small" ? "text-xl" : "text-2xl";

                    if (review.User?.avatar) {
                      return (
                        <img
                          className={`${avatarSize} rounded-full object-cover border-2 border-blue-200`}
                          src={review.User?.avatar}
                          alt={`${review.User?.username}'s avatar`}
                        />
                      );
                    }

                    const initials =
                      review.User?.username?.charAt(0).toUpperCase() || "U";

                    return (
                      <div
                        className={`${avatarSize} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-blue-200 ${textSize}`}
                      >
                        {initials}
                      </div>
                    );
                  };
                  return (
                      <div
                        key={review.id}
                        className="bg-white rounded border-b border-gray-300 p-5 md:p-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* User & Rating */}
                          <div className="flex-shrink-0 w-full sm:w-48">
                            <div className="flex items-center gap-3 mb-2">
                              {renderAvatar("large")}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {review.User?.username || "Anonymous"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(review.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < Number(review.rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>

                            <div className="mt-2 inline-flex items-center gap-1">
                              <svg
                                className="h-5 w-5 text-green-400 dark:text-green-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-sm font-medium text-gray-900">
                                Verified purchase
                              </p>
                            </div>

                            {review.userId === user?.id && (
                              <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(review)}
                                  className="inline-flex cursor-pointer items-center justify-center py-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-md"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(review.id as string)
                                  }
                                  className="inline-flex cursor-pointer items-center justify-center py-2 w-full bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-md"
                                >
                                  <Trash2 className="w-4 h-4 mr-1 " />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Review Content */}
                          <div className="flex-1">
                            <p className="text-gray-800 leading-relaxed">
                              {review.message}
                            </p>

                            {review.reviewImage && (
                              <img
                                src={review.reviewImage || ""}
                                alt=""
                                className="mt-4 rounded-lg max-h-50 object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 mb-4 flex justify-center">
                  <nav
                    className="inline-flex rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="cursor-pointer relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === page
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {showModal && !selectedReview && (
        <AddReview
          productId={productId}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {showModal && selectedReview && (
        <EditReview
          review={selectedReview}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default Review;
