import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProductDetails from './pages/productDetails/ProductDetails'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyOTP from './pages/auth/VerifyOTP'
import ChangePassword from './pages/auth/ChangePassword'
import Favourites from './pages/favorites/UserFavorite'
import Cart from './pages/cart/Cart'
import CheckOut from './pages/checkout/CheckOut'
import MyOrders from './pages/orders/MyOrders'
import MyOrdersDetails from './pages/orders/MyOrdersDetails'
import NotFound from './globals/components/NotFound.js'
import EditMyOrders from './pages/orders/EditMyOrders.js'
import { useAppDispatch } from './hooks/hooks.js'
import { useEffect } from 'react'
import { handleGoogleLogin } from './store/authSlice.js'

function App() {

   const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(handleGoogleLogin());
  }, [dispatch]);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verifyotp" element={<VerifyOTP />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/productdetails/:id" element={<ProductDetails />} />
      <Route path="/favorites" element={<Favourites />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/myorders" element={<MyOrders />} />
      <Route path="/myorders/orderdetails/:id" element={<MyOrdersDetails />} />
      <Route path="/myorders/orderdetails/editorders/:id" element={<EditMyOrders />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
