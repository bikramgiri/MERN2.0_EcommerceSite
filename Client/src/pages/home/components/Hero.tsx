import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-16 md:pt-28 md:pb-24">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_60%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Left - Text & CTA */}
            <div className="max-w-2xl text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-indigo-950">
                Discover products you'll{" "}
                <span className="text-indigo-700">love</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-indigo-800/80 max-w-xl mx-auto lg:mx-0">
                Shop the latest trends, unbeatable deals, and everything you need — delivered fast and hassle-free.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-indigo-700 text-white font-medium text-lg rounded-xl hover:bg-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Shop Now
                </Link>

                <Link
                  to="/deals"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-600 text-indigo-700 font-medium text-lg rounded-xl hover:bg-indigo-50 transition-all duration-200"
                >
                  Today's Deals
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 lg:gap-10">
                <div className="flex -space-x-4">
                  {[
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
                    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Happy customer"
                      className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-1 text-sm font-medium text-indigo-700/90">
                    Over 5,000 happy customers
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 blur-3xl rounded-3xl opacity-70" />
              <img
                src="../../../../image.png"
                alt="Happy shopping experience"
                className="relative rounded-3xl shadow-2xl object-cover w-600 h-105 sm:h-125 lg:h-145 border border-indigo-100/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick value proposition bar */}
      <section className="py-12 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-indigo-900">Free Shipping</h3>
            <p className="mt-2 text-gray-600">On orders over $50</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-indigo-900">Easy Returns</h3>
            <p className="mt-2 text-gray-600">30-day hassle-free policy</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-indigo-900">24/7 Support</h3>
            <p className="mt-2 text-gray-600">Always here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;