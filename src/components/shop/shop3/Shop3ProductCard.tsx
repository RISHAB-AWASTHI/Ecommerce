import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { useShopWishlistOperations } from '../../../hooks/useShopWishlist';
import { useShopCartOperations } from '../../../context/ShopCartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAmazonTranslate } from '../../../hooks/useAmazonTranslate';

const SHOP_ID = 3;

interface Shop3ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  badgeColor?: string;
  isNew?: boolean;
  discount?: number | null;
  onClick?: () => void;
  productId?: number; // Add product ID for cart functionality
}

const Shop3ProductCard: React.FC<Shop3ProductCardProps> = ({ 
  id, 
  image, 
  name, 
  price, 
  originalPrice, 
  badge, 
  badgeColor, 
  onClick,
  productId 
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const {
    toggleProductInWishlist,
    isProductInWishlist,
    isLoading: wishlistLoading
  } = useShopWishlistOperations(SHOP_ID);
  const { addToShopCart, canPerformShopCartOperations } = useShopCartOperations();
  
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canPerformShopCartOperations()) {
      toast.error('Please sign in to add items to cart');
      navigate('/sign-in');
      return;
    }

    const targetProductId = productId || id;

    try {
      setIsAddingToCart(true);
      await addToShopCart(SHOP_ID, targetProductId, 1);
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
      className="flex flex-col items-center group w-full sm:w-full h-[600px] cursor-pointer"
      onClick={onClick}
    >
      {/* Image with Badge Overlay */}
      <div className="relative w-full h-[553px] aspect-[3/4] overflow-hidden">
        {badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${badgeColor} z-10`}
          >
            {badge}
          </span>
        )}
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            isInWishlist 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
          } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''} shadow-md hover:shadow-lg z-10`}
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
        <img
          src={image}
          alt={translatedName || name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      {/* Info: show by default, hide on hover */}
      <div className="w-full flex flex-col items-start font-alexandria mt-6 group-hover:hidden">
        <div className="text-[16px] font-semibold mb-1 truncate w-full text-white">
          {translatedName || name}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lime-400 text-base font-bold">
            ₹{price}
          </span>
          {originalPrice && (
            <span className="text-pink-400 text-sm line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>
      {/* Add button: hidden by default, show on hover */}
      <div className="w-full mt-6 hidden group-hover:flex items-center justify-center gap-2">
        <button 
          className="flex-1 bg-lime-400 text-black font-semibold py-2 rounded transition hover:bg-lime-300 max-w-md disabled:opacity-50 flex items-center justify-center gap-2"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
};

export default Shop3ProductCard; 