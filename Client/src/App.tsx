import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import Navbar from './globals/components/navbar/Navbar'
import Footer from './globals/components/footer/Footer'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProductDetails from './pages/productDetails/ProductDetails'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyOTP from './pages/auth/VerifyOTP'
import ChangePassword from './pages/auth/ChangePassword'

function App() {
  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verifyotp" element={<VerifyOTP />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/productdetails/:id" element={<ProductDetails />} />
    </Routes>
    <Footer />
    </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
