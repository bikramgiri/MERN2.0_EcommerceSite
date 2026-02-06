import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Menu, X, Search, Heart, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logOut } from "../../store/authSlice";
import { CgProfile } from "react-icons/cg";
import { GrDashboard } from "react-icons/gr";
import { fetchUserFavorites } from "../../store/userFavouriteSlice";
import { fetchCartItems } from "../../store/cartSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);           // mobile menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // user dropdown
  // const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // notifications dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const notificationsRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const { userFavorite: favorites } = useAppSelector(state => state.favorite);
  const { items } = useAppSelector(state => state.cart);

  const cartCount = items?.length;
 // *OR
  // const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // const unreadNotifications = 2;   
  const favouritesCount = favorites?.length;       
 
  // Check token in localStorage for persistent login state on refresh
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const effectiveToken = token || storedToken;
  const isLoggedIn = !!effectiveToken;


  useEffect(() => {
    if (effectiveToken) {
      dispatch(fetchUserFavorites());
    }
  }, [effectiveToken, dispatch]);

    useEffect(() => {
    if (effectiveToken) {
      dispatch(fetchCartItems());
    }
  }, [effectiveToken, dispatch]);

  // mark all notifications as read (example function)
  // const markAllAsRead = () => {
  //   // Implement marking notifications as read
  //   alert("All notifications marked as read!");
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
      //   setIsNotificationsOpen(false);
      // }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate("/login?logout=true");
  };


  // Helper to render avatar or initials
  const renderAvatar = (size: "small" | "large") => {
    const avatarSize = size === "small" ? "w-10 h-10" : "w-12 h-12";
    const textSize = size === "small" ? "text-xl" : "text-2xl";

    if (user?.avatar) {
      return (
        <img
          className={`${avatarSize} rounded-full object-cover border-2 border-indigo-200`}
          src={user.avatar}
          alt="User avatar"
        />
      );
    }

    const initials = user?.username?.charAt(0).toUpperCase() || "U";

    return (
      <div
        className={`${avatarSize} rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold border-2 border-indigo-200 ${textSize}`}
      >
        {initials}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <span className="text-2xl font-bold text-indigo-700 tracking-tight">
              Ecommerce Hub
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Explore Products
            </Link>
          </div>

          {/* Center - Search bar (desktop only) */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Right side icons + auth */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Notifications Button & Dropdown */}
            {/* {isLoggedIn && (
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  className="cursor-pointer relative text-indigo-700 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                      <h3 className="font-semibold">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="cursor-pointer text-xs underline hover:text-purple-200 transition-colors"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      <div className="cursor-pointer p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 text-xl">✓</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Your booking has been <span className="text-green-600 font-semibold">confirmed</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                      </div>

                      <div className="cursor-pointer p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 text-xl">%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Special offer! Get <span className="text-purple-600 font-semibold">20% off</span> your next booking
                          </p>
                          <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                        </div>
                      </div>

                      <div className="cursor-pointer p-4 hover:bg-purple-50 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 text-xl">$</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Payment of <span className="font-semibold">$150</span> was successful
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-gray-50 text-center border-t border-gray-200">
                      <Link
                        to="/notifications"
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setIsOpen(false);
                        }}
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )} */}

            {isLoggedIn && (
              <>
              <Link
                to="/favorites"
                className="relative text-indigo-700 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
              >
                <Heart className="h-6 w-6" />
                { favouritesCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {favouritesCount}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    0
                  </span>
                ) }

              </Link>

            <div {...(items?.length > 0 ? { onClick: () => navigate("/cart") } : {})}
              className="cursor-pointer relative text-indigo-700 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    0
                  </span>
              )}
            </div>
            </>
            )}

            {/* Desktop - Auth / User Dropdown */}
            <div className="hidden md:flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                   className="cursor-pointer flex rounded-lg px-5 py-2 text-base font-medium text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                     className="bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-800 transition-colors shadow-sm"
                   
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer focus:outline-none"
                  >
                    {renderAvatar("small")}
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-66 bg-white rounded-md shadow-xl border border-gray-300 py-2 z-50">
                      <div className="px-5 py-4 border-b border-gray-300">
                        <div className="flex items-center gap-3">
                          {renderAvatar("large")}
                          <div>
                            <p className="font-medium text-gray-900">{user?.username || "My Account"}</p>
                            <p className="text-sm text-gray-600 truncate">{user?.email || "user@example.com"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex gap-3 font-medium items-center px-5 py-2 text-gray-900 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <GrDashboard className="h-7 w-7" />
                          Dashboard
                        </Link>
                        {/* <Link 
                        to="/dashboard" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="cursor-pointer px-5 py-2 hover:bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                            <GrDashboard className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Dashboard
                          </p>
                          <p className="text-xs text-gray-500 mt-1">View your dashboard</p>
                        </div>
                      </Link> */}
                        <Link
                          to="/profile"
                          className="flex gap-3 font-medium items-center px-5 py-2 text-gray-900 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <CgProfile className="h-7 w-7" />
                          Profile
                        </Link>
                         {/* <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="cursor-pointer px-5 py-2 hover:bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                            <CgProfile className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Profile
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Edit your profile</p>
                        </div>
                      </Link> */}
                        <Link
                          to="/myorders"
                          className="flex gap-3 font-medium items-center px-5 py-2 text-gray-900 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <ShoppingCart className="h-7 w-7" />
                          My Orders
                        </Link>
                        {/* <Link 
                        to="/myorders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="cursor-pointer px-5 py-2 hover:bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                            <ShoppingCart className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            My Orders
                          </p>
                          <p className="text-xs text-gray-500 mt-1">View your orders</p>
                        </div>
                      </Link> */}
                        <Link
                          to="/favorites"
                          className="flex gap-3 font-medium items-center px-5 py-2 text-gray-900 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Heart className="h-7 w-7" />
                          Favourites
                        </Link>
                        {/* <Link 
                        to="/favorites" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="cursor-pointer px-5 py-2 hover:bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                            <Heart className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Favourites
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Saved products</p>
                        </div>
                      </Link> */}
                        <Link
                          to="/settings"
                          className="flex gap-3 font-medium items-center px-5 py-2 text-gray-900 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="h-7 w-7" />
                          Settings
                        </Link>
                        {/* <Link 
                        to="/settings" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="cursor-pointer px-5 py-2 hover:bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                            <Settings className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Settings
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Preferences</p>
                        </div>
                      </Link> */}
                      </div>

                      <div className="border-t border-gray-300">
                        <button
                          onClick={handleLogOut}
                          className="flex mt-2 gap-3 cursor-pointer items-center font-medium w-full px-5 py-2 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <LogOut className="h-7 w-7" />
                          Log out
                        </button>
                        {/* <button
                        onClick={handleLogOut}
                        className="cursor-pointer border-t border-gray-300 w-full text-left px-5 py-2 text-red-600 hover:bg-red-100 transition-colors flex gap-3">
                        <div className="flex-shrink-0">
                            <LogOut className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-600 ">
                            Log out
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Sign out of your account</p>
                        </div>
                      </button> */}
                        
                      </div>
                     </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="cursor-pointer md:hidden text-indigo-700 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-5 py-6 space-y-6">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-11 pr-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            {/* Auth / User Section in Mobile Menu */}
            {!isLoggedIn ? (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="text-center py-3 text-indigo-700 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
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
            ) : (
              <div className="pt-4 border-t border-gray-100 space-y-4">
                {/* User Info in Mobile */}
                <div className="flex items-center gap-3 px-2">
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                    src={user?.avatar || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                    alt="User avatar"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user?.username || "Account"}</p>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="block py-2.5 px-2 text-gray-800 hover:text-indigo-700 hover:bg-gray-200 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <CgProfile className="h-5 w-5 inline-block mr-2" />
                  Profile
                </Link>

                <Link
                  to="/myorders"
                  className="block py-2.5 px-2 text-gray-800 hover:text-indigo-700 hover:bg-gray-200 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 inline-block mr-2" />
                  My Orders
                </Link>

                <Link
                  to="/favourites"
                  className="block py-2.5 px-2 text-gray-800 hover:text-indigo-700 hover:bg-gray-200 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5 inline-block mr-2" />
                  Favourites
                </Link>

                <button
                  onClick={handleLogOut}
                  className="cursor-pointer w-full text-left py-2.5 px-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 inline-block mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;