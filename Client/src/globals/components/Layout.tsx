import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  )
}

export default Layout