import React from "react";
import { X, Loader2, Plus, Edit } from "lucide-react";
import type { Review } from "../../../../../globals/types/reviewTypes";

interface ReviewFormModalProps {
  type: "add" | "edit";
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDiscard: () => void;
  onRatingChange?: (rating: string) => void; // Optional, only for AddReview
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isSubmitting: boolean;
  file: File | null;
  review?: Review;
  onClose: () => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  type,
  review,
  file,
  onClose,
  onSubmit,
  onChange,
  onDiscard,
  getRootProps,
  getInputProps,
  isDragActive,
  isSubmitting,
  formData,
  onRatingChange
}) => {
  const isEdit = type === "edit";

const isFormInvalid = () => {
  // Common required fields check
  const requiredMissing =
    !(formData.rating || "") ||
    !(formData.message || "").trim();
    // !Number(formData.productId || 0) ||
    // !Number(formData.userId || 0);

  if (requiredMissing) return true;

  // Edit mode: disable if NOTHING changed
  if (isEdit) {
    const noChange =
      formData.rating === review?.rating &&
      formData.message.trim() === review?.message &&
      // formData.productId === review?.productId &&
      // formData.userId === review?.userId &&
      !file; // no new image uploaded

    return noChange;
  }  

  return false;
};

// *OR

// Returns TRUE → button DISABLED
  // const isFormInvalid = () => {
  //   const name = String(formData.productName || "").trim();
  //   const desc = String(formData.productDescription || "").trim();
  //   const price = Number(formData.productPrice) || NaN;
  //   const stock = Number(formData.productTotalStockQty) || NaN;
  //   const catId = String(formData.categoryId || "").trim();

  //   // Required fields missing
  //   if (!name || !desc || isNaN(price) || isNaN(stock) || !catId) return true;

  //   // Basic validation
  //   if (name.length < 2) return true;
  //   if (desc.length < 5) return true;
  //   if (price <= 0) return true;
  //   if (stock < 0) return true;

  //   if (isEdit) {
  //     // Compare with original values
  //     const origName  = String(product?.productName || "").trim();
  //     const origDesc  = String(product?.productDescription || "").trim();
  //     const origPrice = Number(product?.productPrice) || 0;
  //     const origStock = Number(product?.productTotalStockQty) || 0;
  //     const origCat   = String(product?.category?.id || product?.categoryId || "").trim();

  //     const noChange =
  //       name === origName &&
  //       desc === origDesc &&
  //       price === origPrice &&
  //       stock === origStock &&
  //       catId === origCat &&
  //       !file;

  //     return noChange;
  //   }

  //   // Add mode: require image
  //   return !file;
  // };
  // const isDisabled = isSubmitting || isFormInvalid();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto">
      {/* Modal container with max height and scrollable */}
      <div className="w-full max-w-xl my-8 bg-gray-100 rounded-2xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Fixed Header - Blue */}
        <div className="flex items-center justify-between px-8 py-4 bg-blue-600 rounded-t-xl">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Edit Review" : "Add New Review"}
          </h2>
          <button onClick={onClose} 
          className="cursor-pointer p-2 rounded-full hover:bg-blue-800 transition">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto bg-white">
          <form onSubmit={onSubmit} className="p-8 space-y-4">

               <div>
                <label className="block text-sm font-semibold text-black mb-2">Rating</label>
                <span className="ms-2 flex justify-center text-lg font-bold text-gray-900">
                  {formData.rating || "0"} out of 5
                </span>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`cursor-pointer h-6 w-6 ${
                        star <= (formData.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                      onClick={() => onRatingChange && onRatingChange(star.toString())}
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
                </div>
              </div>

             {/* message */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Review Description</label>
              <textarea
                name="message"
                placeholder="Enter review message"
                value={formData.message}
                onChange={onChange}
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-black focus:ring-0.5 focus:ring-gray-400 focus:border-gray-400 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                {isEdit? (
                  <>
                    Add real photos of the product to help other customers{" "}
                    <span className="text-gray-500">
                      (Optional - upload new to replace)
                    </span>
                    </>
                    ) : (
                      <>
                      Add real photos of the product to help other customers{" "}
                      <span className="text-gray-500">
                        (Optional)
                      </span>
                      </>
                    )}
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                  isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-400 hover:border-gray-500"
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="space-y-2">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="mx-auto max-h-60 rounded-lg object-cover" />
                    <p className="text-sm text-gray-700">{file.name}</p>
                  </div>
                ) : review?.reviewImage && review?.reviewImage?.length > 0 ? (  
                  <div className="space-y-2">
                    <img src={review.reviewImage} alt="Current" className="mx-auto max-h-60 rounded-lg object-cover" />
                    <p className="text-sm text-gray-700">Current image (upload new to replace)</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 1MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons - Fixed at bottom */}
            <div className="flex gap-4 pt-6 pb-6 sticky bottom-0 bg-white border-t border-gray-300">
  <button
    type="submit"
    disabled={isSubmitting || isFormInvalid()}
    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition ${
      isSubmitting || isFormInvalid()
        ? 'bg-blue-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
    }`}
  >
    {isSubmitting && <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />}
    {isEdit ? <Edit className="inline-block w-4 h-4" />: <Plus className="inline-block w-4 h-4" />}
    {isEdit ? "Update Review" : "Add Review"}
  </button>

  {/* <button
                type="submit"
                disabled={isDisabled}
                title={
                  isSubmitting
                    ? "Updating..."
                    : isFormInvalid()
                    ? isEdit
                      ? "No changes made or invalid input"
                      : "Fill all required fields + upload image"
                    : "Ready to submit"
                }
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-3 
                  text-white font-semibold rounded-xl transition-all duration-200
                  ${isDisabled
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]"
                  }
                `}
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {isEdit ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isEdit ? "Update Review" : "Add Review"}
  </button> */}

  <button
    type="button"
    onClick={onDiscard}
    className="cursor-pointer flex-1 px-6 py-3 bg-gray-300 text-black font-semibold rounded-lg hover:bg-gray-400 transition"
  >
    <X className="inline-block w-5 h-5 mr-2" />
    Discard
  </button>
</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewFormModal;