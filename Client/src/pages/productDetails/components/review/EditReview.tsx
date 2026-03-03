import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch } from '../../../../hooks/hooks';
import ReviewFormModal from './components/ReviewFormModal';
import { updateReview } from '../../../../store/reviewSlice';

interface EditReviewProps {
  review: any;   
  onClose: () => void;
  onSuccess: () => void;
}

const EditReview =  ({ review, onClose }: EditReviewProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    rating: review?.rating || "",
    message: review?.message || "",
    // productId: review?.productId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({
      rating: "",
      message: "",
      reviewImage: "",
      general: ""
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleRating = (rating: string) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic required field check
    if (!formData.rating) {
      newErrors.rating = "Rating is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      rating: "",
      message: "",
      reviewImage: "",
      general: ""
    });

    const isValid = validateForm();
    if (!isValid) {
      const Errormsg = Object.values(errors).find(err => err);
      if (Errormsg) {
        toast.error(Errormsg);
      }
      return;
    }
    setIsSubmitting(true);
   
    const formDataToSend = new FormData();
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("message", formData.message.trim());
    // formDataToSend.append("productId", formData.productId);
    if(file){
      formDataToSend.append("reviewImage", file);
    } 

    try {
      dispatch(updateReview({reviewId: review.id, data: formDataToSend}));
      toast.success("Review updated successfully!");
      // onSuccess?.(); //
      onClose();
    } catch (error: any) {
      const errData = error?.response?.data || error?.data;

        if (
          errData &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errData.field;
          const msg = errData.message || "Failed to update review. Please check your input.";

          if (field && ["rating", "message", "reviewImage"].includes(field)) {
              setErrors((prev) => ({ ...prev, [field]: msg }));
              toast.error(msg);
          } else {
              setErrors((prev) => ({ ...prev, general: msg }));
              toast.error(msg);
          }
        } else {
            setErrors((prev) => ({
            ...prev,
            general: "Something went wrong. Please try again.",
          }));
         toast.error("Something went wrong. Please try again.");
        }

       // *Or
      // const errorMessage = error?.response?.data?.message || "Failed to update review";
      // toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    onClose();
  };

  return (
    <ReviewFormModal
      type="edit"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onDiscard={handleDiscard}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      isSubmitting={isSubmitting}
      file={file}
      review={review}
      onRatingChange={handleRating}
      onClose={onClose}
    />
  );
};

export default EditReview;