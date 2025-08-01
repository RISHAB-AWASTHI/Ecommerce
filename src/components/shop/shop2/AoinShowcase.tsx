import React from 'react';
import { ArrowLeft } from 'lucide-react';

const AoinShowcase = () => {
  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] xl:min-h-[1024px] bg-[url('https://res.cloudinary.com/do3vxz4gw/image/upload/v1752059234/public_assets_shop2/public_assets_shop2_bg-image.png')] bg-cover bg-center text-white font-sans flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      
      {/* Carousel Section */}
      <div className="w-full max-w-[1364px] relative flex items-center justify-end overflow-hidden px-2 xl:ml-48  sm:px-4 md:px-6 mb-6 sm:mb-8">
        
        {/* Left Arrow */}
        <button className="absolute left-1 sm:left-2 md:left-0 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 sm:p-3 border border-[#9747FF] transition-colors duration-200 z-10">
          <ArrowLeft size={16} className="text-[#9747FF] sm:w-12 sm:h-12" />
        </button>

        {/* Right Arrow */}
        <button className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 sm:p-3 border border-purple-400 transition-colors duration-200 z-10">
          <ArrowLeft size={16} className="text-purple-400 sm:w-5 sm:h-5 rotate-180" />
        </button>

        {/* Image Slides */}
        <div className="flex gap-4 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth w-full justify-center sm:px-12 md:px-16 lg:px-20 xl:px-2 ">
          <img
            src="https://res.cloudinary.com/do3vxz4gw/image/upload/v1752059248/public_assets_shop2/public_assets_shop2_model1.svg"
            alt="Model 1"
            className="rounded-xl object-cover object-top w-[907px] h-[473px] max-w-[85vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[907px] flex-shrink-0"
          />
          <img
            src="https://res.cloudinary.com/do3vxz4gw/image/upload/v1752059251/public_assets_shop2/public_assets_shop2_model2.svg"
            alt="Model 2"
            className="rounded-xl object-cover w-[425px] h-[473px] max-w-[60vw] sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[35vw] xl:max-w-[425px] flex-shrink-0"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-[1100px] h-1.5 sm:h-2  bg-gray-700 rounded-full mb-6 sm:mb-8 lg:mb-10 mt-4 sm:mt-6">
        <div className="h-full w-[30%] bg-purple-500 rounded-full transition-all duration-500"></div>
      </div>

      {/* Brand & Social Section */}
      <div className="w-full max-w-[1240px] flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 sm:gap-10 lg:gap-12 mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6">
        
        {/* Left: Logo and Tagline */}
        <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-8 text-center lg:text-left">
          <div className="flex items-center gap-3 sm:gap-4">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M40 0H80V40L40 80H0V40L40 0Z" fill="#E15E3D"/>
            </svg>
            <h1 className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[73px] font-extrabold font-archivio tracking-tight">AOIN</h1>
          </div>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-archivo leading-snug font-light max-w-[500px]">
            Elevate Your Style with Strite
            Where Fashion Meets Distinction
          </p>
        </div>

        {/* Right: Social Links */}
        <div className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-archivio font-semibold space-y-3 sm:space-y-4 text-center lg:text-right">
          <a href="#" className="block hover:underline transition-all duration-200 hover:text-purple-300">MARKETPLACE ↗</a>
          <a href="#" className="block hover:underline transition-all duration-200 hover:text-purple-300">INSTAGRAM ↗</a>
          <a href="#" className="block hover:underline transition-all duration-200 hover:text-purple-300">YOUTUBE ↗</a>
          <a href="#" className="block hover:underline transition-all duration-200 hover:text-purple-300">FACEBOOK ↗</a>
        </div>
      </div>
    </section>
  );
};

export default AoinShowcase;
