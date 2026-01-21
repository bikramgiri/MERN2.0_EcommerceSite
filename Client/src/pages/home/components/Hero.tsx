
import React from "react";
import { Link } from "react-router-dom";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/bundle";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Hero = () => {
  const heroSlides = [
    {
      title: "Travel Anywhere, Anytime",
      subtitle: "Book bus, train, launch & flight tickets with ease",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920",
      gradient: "from-blue-900/80 to-purple-900/80",
    },
    {
      title: "Explore New Destinations",
      subtitle: "Discover amazing places with affordable tickets",
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1920",
      gradient: "from-green-900/80 to-blue-900/80",
    },
    {
      title: "Safe & Comfortable Journey",
      subtitle: "Travel with trusted vendors and premium services",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920",
      gradient: "from-orange-900/80 to-red-900/80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-14 pb-16 md:pt-16">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left - Text Content */}
            <div className="max-w-xl text-center lg:text-left mt-4 ">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-indigo-950">
                Discover products you'll{" "}
                <span className="text-indigo-700">love</span>
              </h1>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-medium rounded-xl hover:bg-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg"
                >
                  Shop Now
                </Link>

                <Link
                  to="/deals"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-600 text-indigo-700 font-medium rounded-xl hover:bg-indigo-50 transition-all duration-200 text-base sm:text-lg"
                >
                  Today's Deals
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
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
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    {[...Array(5)].map((_, i) => ( // 5 stars
                      <svg
                        key={i}
                        className="h-5 w-5 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      // <Star key={i} className="h-5 w-5 text-amber-500" />
                    ))}
                  </div>
                  <p className="mt-1 text-sm font-medium text-indigo-700/90">
                    Over 5,000 happy customers
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image with Hover Arrows */}
            <div className="group relative w-full max-w-full lg:max-w-6xl h-60 sm:h-90 lg:h-100 rounded-sm overflow-hidden shadow-2xl border border-indigo-100">
              <Swiper
                modules={[Autoplay, Pagination, EffectFade, Navigation]}
                effect="fade"
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={{
                  nextEl: ".custom-swiper-next",  
                  prevEl: ".custom-swiper-prev",
                }}
                loop={true}
                className="h-full"
              >
                {heroSlides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="h-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    >
                    </div>
                    {/* <img
                      // src={`${slide.image}`}
                      src={`${slide.image}?auto=format&fit=crop&w=800&q=80`}
                      className="h-full w-full object-cover bg-cover bg-center relative"
                    /> */}
                  </SwiperSlide>
                ))}

                <div className="custom-swiper-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 sm:p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="custom-swiper-next absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 sm:p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Quick value proposition bar */}
      <section className="py-10 md:py-12 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-900">Free Shipping</h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">On orders over $50</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-900">Easy Returns</h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">30-day hassle-free policy</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-900">24/7 Support</h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">Always here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;