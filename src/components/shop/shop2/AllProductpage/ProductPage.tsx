import React, { useState } from "react";

const products = [
  {
    id: 1098,
    name: "CAPE JEWELRY FOR WOMEN",
    price: 120,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    discount: 10,
    overlay: 1098,
  },
  {
    id: 1259,
    name: "CAPE JEWELRY FOR WOMEN",
    price: 120,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
    overlay: 1259,
  },
  {
    id: 142,
    name: "CAPE JEWELRY FOR WOMEN",
    price: 120,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    discount: 10,
    overlay: 142,
  },
  {
    id: 1,
    name: "CAPE JEWELRY FOR WOMEN",
    price: 120,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "CAPE JEWELRY FOR WOMEN",
    price: 120,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "CAPE JEWELRY FOR WOMEN",
    price: 120,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  
  
];

const collections = [
  { name: "Graphic Hoodies", disabled: false },
  { name: "TrackSuits", disabled: false },
  { name: "Denim Jackets", disabled: false },
  { name: "Sunglasses", disabled: true },
  { name: "Printed Co-Ord Sets", disabled: true },
  { name: "Denim Jackets", disabled: false },
];

const ProductPage = () => {
  // Price filter state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const minLimit = 0;
  const maxLimit = 1000000;
  const priceGap = 0;

  // Sort dropdown state
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Sort By List");
  const sortOptions = [
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Oldest First",
    "Name: A-Z",
    "Name: Z-A"
  ];

  return (
    <div className="min-h-screen w-full mx-auto flex flex-col lg:flex-row justify-center py-8 px-2 sm:px-4 md:px-2 2xl:px-20">
      <hr className="border-black border-t-1 " />
      {/* Container */}
      <div className="flex flex-col lg:flex-row w-full 2xl:gap-16 px-0 md:px-4 2xl:px-10">
      
        {/* Sidebar */}
        <aside className="w-full lg:w-[340px] 2xl:w-[455px] h-auto lg:h-[1746px] bg-[#DFD1C6] rounded-xl shadow p-4 md:p-6 mb-6 lg:mb-0 lg:mr-8 flex-shrink-0">
          <div className="flex items-center px-2 justify-between mb-6 pt-2">
            <span className="font-semibold text-[16px] font-bebas tracking-widest text-gray-700">51 RESULTS</span>
            <button className="bg-black text-white font-bebas text-[20px] px-6 py-3 rounded-full font-semibold tracking-[0.2em] " style={{letterSpacing:'0.2em'}}>CLEAR FILTERS</button>
          </div>
          {/* Price Filter */}
          <hr className="border-t mb-8" style={{ background: '#888181', height: '1px', border: 'none' }} />
          <div className="mb-8">
            <div className="font-bold text-[25px] font-bebas mb-6 tracking-tight">FILTER BY PRICE</div>
            <div className="relative w-[85%] mx-auto flex items-center justify-center h-10 mb-2">
              {/* Track */}
              <div className="absolute  left-0 right-0 h-0 bg-[#bfa16a] rounded-full" style={{top: '50%', transform: 'translateY(-50%)'}}></div>
              {/* Selected Range */}
              <div
                className="absolute h-1 bg-[#B19D7F] rounded-full"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: `${((minPrice - minLimit) / (maxLimit - minLimit)) * 100}%`,
                  right: `${100 - ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100}%`,
                }}
              ></div>
              {/* Min Handle */}
              <input
                type="range"
                min={minLimit}
                max={maxPrice - priceGap}
                value={minPrice}
                onChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice - priceGap))}
                className="absolute w-full accent-[#bfa16a] pointer-events-auto z-10"
                style={{ WebkitAppearance: 'none', background: 'transparent', height: '40px' }}
              />
              {/* Max Handle */}
              <input
                type="range"
                min={minPrice + priceGap}
                max={maxLimit}
                value={maxPrice}
                onChange={e => setMaxPrice(Math.max(Number(e.target.value), minPrice + priceGap))}
                className="absolute w-full accent-[#bfa16a] pointer-events-auto z-10"
                style={{ WebkitAppearance: 'none', background: 'transparent', height: '40px' }}
              />
              {/* Custom handles */}
              <div
                className="absolute"
                style={{
                  left: `${((minPrice - minLimit) / (maxLimit - minLimit)) * 100}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                }}
              >
                <div className="w-10 h-10 bg-[#bfa16a] rounded-full border-4 border-white shadow" />
              </div>
              <div
                className="absolute"
                style={{
                  left: `${((maxPrice - minLimit) / (maxLimit - minLimit)) * 100}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                }}
              >
                <div className="w-10 h-10 bg-[#bfa16a] rounded-full border-4 border-white shadow" />
              </div>
            </div>
            <div className="flex justify-start text-xl font-bold text-black mt-4 mb-8">
              <span>Price: ₹{minPrice.toLocaleString()} — ₹{maxPrice.toLocaleString()}</span>
            </div>
            <button className="bg-black text-white text-[14px] font-poppins px-4 py-2 rounded-full font-semibold w-1/2 tracking-[0.2em]" style={{letterSpacing:'0.2em'}}>FILTER</button>
          </div>
          {/* Product Type */}
          <div className="mb-8">
            <div className="font-bold text-2xl mb-6 tracking-tight">PRODUCT TYPE</div>
            <div className="flex flex-col  gap-2 text-[16px]">
              <label className="flex items-center gap-4 font-normal"><input type="checkbox" className="w-6 h-6" /> T-Shirts</label>
              <hr className="border-t" style={{ background: '#D9D9D9', height: '1px', border: 'none' }} />
              <label className="flex items-center gap-4 font-normal"><input type="checkbox" className="w-6 h-6" /> Shirts</label>
              <hr className="border-t" style={{ background: '#D9D9D9', height: '1px', border: 'none' }} />
              <label className="flex items-center gap-4 font-normal"><input type="checkbox" className="w-6 h-6" /> Bottoms</label>
              <hr className="border-t" style={{ background: '#D9D9D9', height: '1px', border: 'none' }} />
              <label className="flex items-center gap-4 font-normal"><input type="checkbox" className="w-6 h-6" /> Women Chain</label>
              <hr className="border-t" style={{ background: '#D9D9D9', height: '1px', border: 'none' }} />
              <label className="flex items-center gap-4 font-normal"><input type="checkbox" className="w-6 h-6" /> Shackets</label>
              <hr className="border-t" style={{ background: '#D9D9D9', height: '1px', border: 'none' }} />
              <label className="flex items-center gap-4 font-normal "><input type="checkbox" className="w-6 h-6"/> Accessories</label>
            </div>
          </div>
          {/* Shop For */}
          <div className="mb-8">
            <div className="font-bold text-[25px] font-bebas mb-6 tracking-tight">SHOP FOR</div>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white border-none rounded-full px-2.5 py-4 text-[14px] font-poppins font-medium tracking-[0.15em] text-black shadow-sm">TOPWEAR</span>
              <span className="bg-white border-none rounded-full px-2.5 py-4 text-[14px] font-poppins font-medium tracking-[0.15em] text-black shadow-sm">BOTTOMWEAR</span>
              <span className="bg-white border-none rounded-full px-2.5 py-4 text-[14px] font-poppins font-medium tracking-[0.15em] text-black shadow-sm">WINTERWEAR</span>
              <span className="bg-white border-none rounded-full px-2.5 py-4 text-[14px] font-poppins font-medium tracking-[0.15em] text-black shadow-sm">TRADITIONAL</span>
            </div>
          </div>
          {/* Collections */}
          <div className="mb-8">
            <div className="font-extrabold text-[25px] mb-6 uppercase font-bebas">COLLECTIONS</div>
            <ul className="text-xl">
              {collections.map((col, i) => (
                <React.Fragment key={i}>
                  <li className="flex items-center py-3">
                    <span className="mr-4 text-2xl" style={{fontWeight: 'bold'}}>&bull;</span>
                    <span>{col.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/\s+/g, ' ').trim()}</span>
                  </li>
                  {i !== collections.length - 1 && (
                    <hr className="border-t" style={{ background: '#D9D9D9', height: '1px', border: 'none' }} />
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
          {/* Conditions */}
          <div className="mb-2">
            <div className="font-extrabold text-[25px] mb-6 uppercase font-bebas">CONDITIONS</div>
            <span className="bg-white border-none rounded-full px-10 py-4 text-xl font-medium  text-black shadow" style={{letterSpacing:'0.1em', fontFamily: 'inherit'}}>NEW</span>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 sm:px-8 md:px-12 lg:px-8 mb-8 md:mb-16 gap-4 md:gap-0">
            <span className="font-normal text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bebas tracking-widest">SHOWING 1-9 OF 15 RESULTS</span>
            <div className="relative w-full md:w-auto">
              <button
                className="flex items-center bg-black text-white text-base sm:text-lg md:text-xl px-4 sm:px-8 md:px-12 py-2 sm:py-3 md:py-4 rounded-full font-semibold tracking-[0.2em] focus:outline-none select-none min-w-0 md:min-w-[350px] justify-between w-full md:w-auto"
                style={{ letterSpacing: '0.2em', fontFamily: 'Bebas Neue, sans-serif', fontWeight: 600 }}
                onClick={() => setSortOpen((prev) => !prev)}
              >
                <span className="mr-4 sm:mr-8 md:mr-10 mt-1 tracking-[0.2em] text-lg sm:text-xl md:text-[16px]">{sortOption.toUpperCase()}</span>
                <svg className={`ml-2 sm:ml-4 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {sortOpen && (
                <div className="absolute right-0 md:right-10 mt-2 w-full bg-black rounded-xl shadow-lg z-50 border border-gray-800">
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-white text-base sm:text-lg font-semibold cursor-pointer hover:bg-gray-900 rounded-xl transition-all ${sortOption === option ? 'bg-gray-900' : ''}`}
                      onClick={() => { setSortOption(option); setSortOpen(false); }}
                      style={{ letterSpacing: '0.15em', fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      {option.toUpperCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 md:gap-x-4 2xl:gap-x-20 gap-y-8">
            {products.slice(0, 9).map((product, idx) =>
              idx === 2 ? (
                <div className="w-full">
                <div key={product.id} className="flex flex-col items-center pb-6 rounded-t">
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt="Special Edition Necklace"
                    className="rounded-t-xl w-full max-w-[340px] sm:max-w-[400px] md:max-w-[519px] h-[320px] sm:h-[400px] md:h-[595px] object-cover bg-none border-none shadow-none"
                  />
                  {/* Product Info & Buttons with background */}
                  <div className="w-full max-w-[519px] flex flex-col items-center bg-[#DFD1C6] rounded-b-xl pt-6 pb-6">
                    <span className="font-medium  text-[30px] font-bebas text-center tracking-wider">
                      Special Edition Necklace
                    </span>
                    <span className="font-semibold text-[25px] font-bebas mt-4 mb-6">
                      $199
                    </span>
                    <div className="mt-4 flex items-center gap-2 w-full justify-center">
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold">-</button>
                      <span className="font-semibold">1</span>
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold">+</button>
                      <button className="ml-2 sm:ml-4 bg-black text-white px-4 sm:px-6 py-2 rounded-full font-semibold text-xs">ADD TO CART</button>
                    </div>
                  </div>
                </div>
                </div>
              ) : (
                <div key={product.id} className="flex flex-col items-center pb-6">
                  {/* Default content for other products */}
                  <img src={product.image} alt={product.name} className="rounded-xl w-full max-w-[340px] sm:max-w-[400px] md:max-w-[519px] h-[320px] sm:h-[400px] md:h-[595px] object-cover bg-none border-none shadow-none" />
                  <div className="mt-6 flex flex-col items-center w-full">
                    <span className="font-medium text-[30px] font-bebas text-center tracking-wider">{product.name}</span>
                    <span className="font-semibold text-[25px] font-bebas mt-2">${product.price}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
