const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/ditfnlowl/image/upload/v1769440422/Mern2_Ecommerce_Website/";

// Helper to get full URL from stored filename
function getFullImageUrl(fileName: string | undefined): string {
  if (!fileName) {
    return "/placeholder.jpg";
  }
   return `${CLOUDINARY_BASE_URL}${fileName}`;
}

export default getFullImageUrl;
