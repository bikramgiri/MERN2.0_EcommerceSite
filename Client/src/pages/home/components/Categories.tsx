import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useEffect } from "react";
import { fetchCategories } from "../../../store/categorySlice";
import { Loader2 } from "lucide-react";
import { Status } from "../../../globals/statuses";

// const categories: Category[] = [
//   {
//     id: "1",
//     categoryName: "Stationery",
//     image:
//       // "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=220&fit=crop&auto=format",
//        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop",
//   },
//   {
//     id: "2",
//     categoryName: "Clothes",
//     image:
//       // "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=220&fit=crop&auto=format",
//         "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
//   },
//   {
//     id: "3",
//     categoryName: "Electronics",
//     image:
//       // "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=220&fit=crop&auto=format",
//        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
//   },
//   {
//     id: "4",
//     categoryName: "Home & Kitchen",
//     image:
//       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=220&fit=crop&auto=format",
//       //    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
//   },
//   {
//     id: "5",
//     categoryName: "Food & Beverages",
//     image:
//       // "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&h=220&fit=crop&auto=format",
//         "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",

//   },
// ];

const Categories = () => {
  const dispatch = useAppDispatch();
  const { categories, status } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (status === Status.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading category.....</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white py-4 md:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-indigo-900 md:text-3xl mb-4">
          Categories
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              to={`/products?category=${category.id}`}
              key={category.id}
              className="group flex flex-col items-center rounded-sm bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-1
                shadow-[0_-4px_25px_-8px_rgba(0,0,0,0.6),0_3px_20px_-8px_rgba(0,0,0,0.04)]
                dark:shadow-[0_-2px_34px_-14px_rgba(0,0,0,0.2),0_2px_14px_-8px_rgba(0,0,0,0.20)]
                hover:shadow-[0_-6px_26px_-6px_rgba(0,0,0,0.6),0_8px_16px_-6px_rgba(0,0,0,0.1)]
                dark:hover:shadow-[0_-8px_36px_-6px_rgba(0,0,0,0.12),0_6px_12px_-2px_rgba(0,0,0,0.14)]
                transition-shadow duration-500
                "
            >
              {/* Image */}
              <div className="w-full h-36 flex items-center justify-center overflow-hidden mb-3">
                <img
                  src={category.image}
                  alt={category.categoryName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Name */}
              <p className="text-md text-center text-gray-700 font-medium leading-tight group-hover:text-indigo-700 transition-colors">
                {category.categoryName}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
