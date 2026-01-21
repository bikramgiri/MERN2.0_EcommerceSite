// import { useParams } from 'react-router-dom';
// import SingleProduct from './components/product/SingleProduct';

// const ProductDetails = () => {
//   // const {id } = useParams<{id: string}>();
//   return (
//     <>
//     <SingleProduct />
//     </>
//   )
// }

// export default ProductDetails





import { useParams } from 'react-router-dom';
import SingleProduct from './components/product/SingleProduct'; // adjust path

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  if (!id || id === 'undefined') {
    return (
      <div className="text-center py-20 text-xl text-red-600">
        Invalid or missing product ID in URL
      </div>
    );
  }

  return <SingleProduct productId={id} />;
};

export default ProductDetails;