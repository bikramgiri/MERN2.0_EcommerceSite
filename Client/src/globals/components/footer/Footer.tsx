import React from "react";
import { Mail, Send, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-8">
        {/* Main content - 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 - Brand & Description */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-block mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-indigo-700 tracking-tight">
                Ecommerce Hub
              </h3>
            </Link>

            <p className="text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
              Discover quality products with fast delivery and exceptional service.  
              Your one-stop shop for everything you need.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-5 mt-6">
              <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-indigo-900 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-700 hover:text-indigo-700 transition-colors duration-200 text-base block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Support Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-indigo-900 mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { name: "FAQ", path: "/faq" },
                { name: "Shipping Info", path: "/shipping" },
                { name: "Returns & Refunds", path: "/returns" },
                { name: "Privacy Policy", path: "/privacy" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-indigo-700 transition-colors duration-200 text-base block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-indigo-900 mb-6">
              Newsletter
            </h4>

            <p className="text-gray-600 mb-5">
              Subscribe to get latest updates, offers and news.
            </p>

            <form className="flex flex-col gap-4 max-w-md mx-auto md:mx-0">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg hover:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Send className="h-5 w-5" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Ecommerce Hub. All rights reserved.
            </p>

            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-indigo-700 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-indigo-700 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;