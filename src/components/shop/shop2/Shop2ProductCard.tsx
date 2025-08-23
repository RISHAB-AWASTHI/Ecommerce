import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { useShopWishlistOperations } from '../../../hooks/useShopWishlist';
import { useShopCartOperations } from '../../../context/ShopCartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAmazonTranslate } from '../../../hooks/useAmazonTranslate';

const SHOP_ID = 2;

interface Shop2ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  discount?: number;
  overlay?: number;
  shopProductId: number;
  onClick?: () => void;
}

const Shop2ProductCard: React.FC<Shop2ProductCardProps> = ({ 
  id, 
  image, 
  name, 
  price, 
  discount, 
  shopProductId, 
  onClick 
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const {
    toggleProductInWishlist,
    isProductInWishlist,
    isLoading: wishlistLoading
  } = useShopWishlistOperations(SHOP_ID);
  const { addToShopCart, canPerformShopCartOperations } = useShopCartOperations();
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [translatedName, setTranslatedName] = useState('');
  const { i18n } = useTranslation();
  const { translateBatch } = useAmazonTranslate();

  useEffect(() => {
    const doTranslate = async () => {
      const lang = (i18n.language || 'en').split('-')[0];
      if (lang === 'en' || !name) {
        setTranslatedName('');
        return;
      }
      try {
        const res = await translateBatch([{ id: 'name', text: name }], lang, 'text/plain');
        setTranslatedName(res['name'] || '');
      } catch {
        setTranslatedName('');
      }
    };
    doTranslate();
  }, [name, i18n.language, translateBatch]);

  const handleWishlistClick = async (e: React.MouseEvent) => {
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
      const wasInWishlist = isProductInWishlist(id);
      await toggleProductInWishlist(id);
      
      if (wasInWishlist) {
        toast.success('Removed from wishlist');
      } else {
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      // Error is already handled by the hook with toast, so we don't need to show another one
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canPerformShopCartOperations()) {
      toast.error('Please sign in to add items to cart');
      navigate('/sign-in');
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToShopCart(SHOP_ID, shopProductId, quantity);
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isInWishlist = isProductInWishlist(id);

  return (
    <div 
      className="flex flex-col items-center pb-7 px-4 relative group cursor-pointer max-w-full sm:max-w-[400px] md:max-w-[519px]"
      onClick={onClick}
    >
      {/* Product Image Container */}
      <div className="relative w-full h-[450px] xs:h-[590px] sm:h-[400px] md:h-[595px]">
        <img
          src={image}
          alt={translatedName || name}
          className="rounded-t-xl w-full h-full object-cover sm:object-cover bg-none border-none shadow-none transition-transform duration-300 hover:scale-100"
        />
        {/* Optional discount badge */}
        {discount && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">{discount}% OFF</span>
        )}
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            isInWishlist 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
          } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''} shadow-md hover:shadow-lg`}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlistLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <Heart 
              size={16} 
              className={isInWishlist ? 'fill-current' : ''} 
            />
          )}
        </button>
      </div>
      {/* Product Info and Hover Add-to-Cart, with hover bg color */}
      <div className="w-full flex flex-col pt-10 items-center rounded-b-xl transition-colors duration-300 group-hover:bg-[#DFD1C6]">
  <span className="font-medium text-[30px] font-bebas text-center tracking-wider">{translatedName || name}</span>
        <span className="font-semibold text-[25px] font-bebas mt-3 mb-4">₹{price}</span>
        {/* Hover Block: Add-to-cart only */}
        <div className="w-full flex flex-col items-center transition-all duration-300 max-h-0 opacity-0 overflow-hidden group-hover:max-h-40 group-hover:opacity-100">
          <div className="flex items-center gap-2 w-full justify-center p-6">
            <button 
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(-1);
              }}
            >-</button>
            <span className="font-semibold min-w-[2rem] text-center">{quantity}</span>
            <button 
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(1);
              }}
            >+</button>
            <button 
              className="ml-2 sm:ml-4 bg-black text-white px-4 sm:px-6 py-2 rounded-full font-semibold text-xs disabled:opacity-50 flex items-center gap-2"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
              ) : (
                "ADD TO CART"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop2ProductCard;