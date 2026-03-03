import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch } from '../../../../hooks/hooks';
import { addReview } from '../../../../store/reviewSlice';
import ReviewFormModal from './components/ReviewFormModal';


interface AddReviewProps {
  productId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddReview = ({ productId, onClose }: AddReviewProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    rating: "",
    message: "",
  });
  const [errors, setErrors] = useState({
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
      setErrors((prev) => ({ ...prev, reviewImage: "", general: "" }));
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

const validateForm = () => {
    const newErrors = { rating: "", message: "", reviewImage: "", general: "" };

    if (!formData.rating) {
      newErrors.rating = "Rating is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    if(!file){
      newErrors.reviewImage = "Review image is required";
    }


    // Early exit only for required fields (keep other backend checks)
    if (Object.values(newErrors).some(error => error !== "")) {
      setErrors(newErrors);
      return;
    }
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

    if (!validateForm()) {
      const Errormsg = Object.values(errors).find((error) => error);
      if (Errormsg) {
        toast.error(Errormsg);
        return;
    }
  }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("message", formData.message.trim());
    if(file){
      formDataToSend.append("reviewImage", file);
    }

    try {
      await dispatch(addReview({data: formDataToSend, productId: productId}));
      toast.success("Review added successfully!");
      // onSuccess(); //
      onClose();
    } catch (error: any) {
            const errData = error?.response?.data || error?.data;

        if (
          errData &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errData.field;
          const msg = errData.message || "Failed to update product. Please check your input.";

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    onClose();
  };

    const handleRating = (rating: string) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <ReviewFormModal
      type="add"
      formData={formData}
      onRatingChange={handleRating}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onDiscard={handleDiscard}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      isSubmitting={isSubmitting}
      file={file}
      onClose={onClose}
    />
  );
};

export default AddReview;