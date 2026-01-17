import { useState } from "react";
import { ShoppingCart, Menu, X, Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Replace with real cart count from context/redux later
  const cartCount = 3;
  const notificationCount = 1

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo - left side */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <span className="text-2xl font-bold text-indigo-700 tracking-tight">
              Ecommerce Hub
            </span>
          </Link>

          {/* Center - Search bar (visible on md+ screens) */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl mx-8">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-11 pr-5 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm shadow-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-5 md:gap-7">
           {/* Favourite */}
            {/* <Link
              to="/favorites"
              className="relative text-indigo-700 hover:text-indigo-900 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
            >
              <Heart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link> */}

            {/* Notifications */}
            <button
              type="button"
              className="cursor-pointer relative text-indigo-700 hover:text-indigo-900 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
            >
              <span className="sr-only">Notifications</span>
              <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Cart */} 
            <Link
              to="/cart"
              className="relative text-indigo-700 hover:text-indigo-900 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth buttons (desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-indigo-700 font-medium hover:text-indigo-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-800 transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-indigo-700 hover:text-indigo-900 focus:outline-none p-1.5 rounded-full hover:bg-indigo-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-5 space-y-5">
            {/* Mobile search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            {/* Mobile links */}
            <Link
              to="/"
              className="block text-lg font-medium text-gray-800 hover:text-indigo-700 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/products"
              className="block text-lg font-medium text-gray-800 hover:text-indigo-700 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>

            {/* Mobile auth */}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <Link
                to="/login"
                className="text-center py-3 text-indigo-700 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-center py-3 bg-indigo-700 text-white font-medium rounded-lg hover:bg-indigo-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;