import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useShopWishlistOperations } from '../../../hooks/useShopWishlist';
import { toast } from 'react-hot-toast';
import shop3ApiService, { Product } from '../../../services/shop3ApiService';
import { useTranslation } from 'react-i18next';
import { useAmazonTranslate } from '../../../hooks/useAmazonTranslate';

const SHOP_ID = 3;

const AoinCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const { translateBatch } = useAmazonTranslate();
  const [nameMap, setNameMap] = useState<Record<number, string>>({});

  // Wishlist functionality
  const { isAuthenticated, user } = useAuth();
  const {
    toggleProductInWishlist,
    isProductInWishlist,
    isLoading: wishlistLoading
  } = useShopWishlistOperations(SHOP_ID);

  // Handle wishlist click
  const handleWishlistClick = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to manage your wishlist');
      navigate('/sign-in');
      return;
    }

    if (user?.role !== 'customer') {
      toast.error('Only customers can manage wishlists');
      return;
    }

    try {
      const wasInWishlist = isProductInWishlist(productId);
      await toggleProductInWishlist(productId);
      
      if (wasInWishlist) {
        toast.success('Removed from wishlist');
      } else {
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await shop3ApiService.getProducts({ per_page: 6 }); // Fetch 6 products for catalog
        if (res && res.success) {
          // Filter to show only 1st, 3rd, and 4th products (remove 2nd product)
          const filteredProducts = res.products.filter((_, index) => index === 0 || index === 2 || index === 3);
          setProducts(filteredProducts);
        } else {
          setProducts([]);
        }
      } catch (e) {
        console.error('Error fetching products:', e);
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Translate product names (display-only)
  useEffect(() => {
    const lang = (i18n.language || 'en').split('-')[0];
    if (lang === 'en' || products.length === 0) {
      setNameMap({});
      return;
    }
    const run = async () => {
      try {
        const items = products
          .filter(p => p.product_name)
          .map(p => ({ id: String(p.product_id), text: p.product_name }));
        if (items.length === 0) return;
        const res = await translateBatch(items, lang, 'text/plain');
        const m: Record<number, string> = {};
        for (const p of products) {
          const t = res[String(p.product_id)];
          if (t) m[p.product_id] = t;
        }
        setNameMap(m);
      } catch {
        setNameMap({});
      }
    };
    run();
  }, [products, i18n.language, translateBatch]);

  const handleProductClick = (productId: number) => {
    navigate(`/shop3-productpage?id=${productId}`);
  };
  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center py-10 px-2">
      <div className="w-full min-w-[100vw] bg-[#d4ff00] py-2 h-[60px] sm:h-[80px] md:h-[100px] px-2 mb-16 sm:mb-24 md:mb-32 flex items-center transform rotate-[-1.5deg] -mt-6 overflow-x-auto whitespace-nowrap">
        <span className="text-black text-[22px] sm:text-[32px] md:text-[43px] font-extrabold tracking-wider inline-block min-w-[200%] animate-marquee-pingpong">
          SHOP NOW!  DISCOUNT UP TO 80%  SHOP NOW!  DISCOUNT UP TO 80%  SHOP NOW!  DISCOUNT UP TO 80% SHOP NOW!  DISCOUNT UP TO 80%  SHOP NOW!  DISCOUNT UP TO 80%  SHOP NOW!  DISCOUNT UP TO 80% SHOP NOW!  DISCOUNT UP TO 80% 
        </span>
      </div>
      <h1 className="text-white text-center font-semibold uppercase text-[32px] sm:text-[40px] md:text-[64px] lg:text-[104px] leading-none mb-8 sm:mb-12 tracking-normal font-bebas">
        Best Our Aoin Catalog.
      </h1>

      {loading ? (
        <div className="text-white text-xl">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-white text-xl">No products found.</div>
      ) : products.length <= 3 ? (
        // Grid layout for 3 or fewer products - mobile first with row layout
        <div className="flex flex-row gap-4 md:gap-6 w-full max-w-[1329px] justify-start items-stretch pb-4 md:pb-0 overflow-x-auto px-4 md:px-0">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="rounded-3xl flex flex-col shadow-lg overflow-hidden w-[calc(100vw-32px)] sm:w-[320px] md:w-[429px] flex-shrink-0 cursor-pointer relative group"
              onClick={() => handleProductClick(product.product_id)}
            >
              <div className="block relative">
                <img
                  src={product.primary_image || "https://res.cloudinary.com/do3vxz4gw/image/upload/v1751544854/svg_assets/Shop3_Component5_Image1.svg"}
                  alt={nameMap[product.product_id] || product.product_name}
                  width={427}
                  height={500}
                  className="object-cover w-full h-[500px] hover:opacity-90 transition-opacity duration-200 rounded-3xl"
                />
                
                {/* Wishlist button */}
                <button
                  onClick={(e) => handleWishlistClick(e, product.product_id)}
                  disabled={wishlistLoading}
                  className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isProductInWishlist(product.product_id) 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
                  } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''} shadow-md hover:shadow-lg`}
                  title={isProductInWishlist(product.product_id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <Heart 
                      size={16} 
                      className={isProductInWishlist(product.product_id) ? 'fill-current' : ''} 
                    />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-start py-4 px-2 sm:px-2 mt-2">
                <span className="text-white font-bold font-alexandria text-base sm:text-lg md:text-[19px] tracking-wide ">
                  {nameMap[product.product_id] || product.product_name}
                </span>
                <span className="text-white font-extrabold text-base sm:text-lg md:text-[22px] font-clash ">
                  ₹{product.special_price || product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Horizontal scroll layout for more than 3 products - mobile first with one full width
        <div className="w-full max-w-[1920px] overflow-hidden mx-auto">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 px-4 "
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            {products.map((product) => (
              <div
                key={product.product_id}
                className="rounded-3xl flex flex-col shadow-lg overflow-hidden w-full sm:w-[429px] flex-shrink-0 cursor-pointer relative group"
                onClick={() => handleProductClick(product.product_id)}
              >
                <div className="block relative">
                  <img
                    src={product.primary_image || "https://res.cloudinary.com/do3vxz4gw/image/upload/v1751544854/svg_assets/Shop3_Component5_Image1.svg"}
                    alt={nameMap[product.product_id] || product.product_name}
                    width={427}
                    height={500}
                    className="object-cover w-full h-[500px] hover:opacity-90 transition-opacity duration-200 rounded-3xl"
                  />
                  
                  {/* Wishlist button */}
                  <button
                    onClick={(e) => handleWishlistClick(e, product.product_id)}
                    disabled={wishlistLoading}
                    className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isProductInWishlist(product.product_id) 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
                    } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''} shadow-md hover:shadow-lg`}
                    title={isProductInWishlist(product.product_id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {wishlistLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Heart 
                        size={16} 
                        className={isProductInWishlist(product.product_id) ? 'fill-current' : ''} 
                      />
                    )}
                  </button>
                </div>
                <div className="flex justify-between items-start gap-10 py-4 px-2 sm:px-2 mt-2">
                  <span className="text-white  font-bold font-alexandria text-base sm:text-lg md:text-[19px] tracking-wide ">
                    {nameMap[product.product_id] || product.product_name}
                  </span>
                  <span className="text-white font-extrabold text-base sm:text-lg md:text-[22px] font-clash ">
                    ₹{product.special_price || product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Collection Button */}
      <div className="mt-2 sm:mt-8">
        <Link to="/shop3-allproductpage">
          <button className="bg-[#CCFF00] text-black font-bold py-3 px-8 rounded-full text-[16px] font-alexandria hover:bg-[#b3e600] transition-colors duration-300">
            EXPLORE COLLECTION
          </button>
        </Link>
      </div>

      {/* Hide scrollbars with inline styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
          .overflow-x-auto {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
    </div>
  );
};

export default AoinCatalog;
