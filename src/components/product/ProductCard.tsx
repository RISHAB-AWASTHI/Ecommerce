import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  isBuiltIn?: boolean;
  salePercentage?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isNew = false, 
  isBuiltIn = false,
  salePercentage
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist, 
    loading: wishlistLoading,
    wishlistItems 
  } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      // Store the current URL to redirect back after sign in
      const returnUrl = encodeURIComponent(window.location.pathname);
      navigate(`/sign-in?returnUrl=${returnUrl}`);
      return;
    }

    // Check if user is a merchant or admin (they shouldn't be able to add to cart)
    if (user?.role === 'merchant' || user?.role === 'admin') {
      toast.error('Merchants and admins cannot add items to cart');
      return;
    }
    
    try {
      await addToCart(product, 1);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to wishlist');
      const returnUrl = encodeURIComponent(window.location.pathname);
      navigate(`/sign-in?returnUrl=${returnUrl}`);
      return;
    }

    // Check if user is a merchant or admin
    if (user?.role === 'merchant' || user?.role === 'admin') {
      toast.error('Merchants and admins cannot add items to wishlist');
      return;
    }
    
    try {
      const productId = Number(product.id);
      const isInWishlistItem = isInWishlist(productId);
      
      if (isInWishlistItem) {
        // Find the wishlist item ID from the wishlist items
        const wishlistItem = wishlistItems.find(item => item.product_id === productId);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.wishlist_item_id);
          toast.success('Product removed from wishlist');
        }
      } else {
        console.log('Attempting to add to wishlist, product ID:', productId);
        await addToWishlist(productId);
        toast.success('Product added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist error details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist');
    }
  };
  
  // Calculate sale percentage if original price exists
  const calculateSalePercentage = () => {
    if (product.originalPrice && product.price) {
      const percentage = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(percentage);
    }
    return 0;
  };
    
  return (

    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col w-62 h-[350px] border border-gray-100">
      <div className="relative h-44 w-full bg-white">

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {isNew && (
            <span className="w-[50px] h-[24px] bg-[#F2631F] text-white text-[12px] font-medium flex items-center justify-center px-1.5 py-0.5 rounded-[4px]">
              New
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-400 text-black text-[10px] px-1.5 py-0.5 rounded">
              Sold Out
            </span>
          )}
          {!isNew && product.stock > 0 && (salePercentage || calculateSalePercentage() > 0) && (
            <span className="bg-[#F2631F] text-white text-[10px] px-1.5 py-0.5 rounded">
              -{salePercentage || calculateSalePercentage()}%
            </span>
          )}
        </div>
        
        {/* Wishlist button */}
        <button
          className={`absolute top-2 right-2 p-1.5 z-10 rounded-full transition-all duration-300 ${
            isInWishlist(Number(product.id)) 
              ? 'text-[#F2631F] bg-white shadow-md' 
              : 'text-gray-400 hover:text-[#F2631F] hover:bg-white hover:shadow-md'
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(Number(product.id)) ? 'fill-current' : ''}`} />
        </button>
        
        {/* Product image */}
        <Link to={`/product/${product.id}`} className="block h-full">
          <img 
            src={product.primary_image || product.image || '/placeholder-image.png'}
            alt={product.name} 
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        </Link>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-normal mb-1 line-clamp-2 font-['Work_Sans']">{product.name}</h3>
          {/* <p className="text-xs text-gray-500">
            SKU: {product.sku}
          </p> */}
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg font-semibold">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-sm line-through">₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className="w-[117px] sm:w-[80%] mx-auto bg-[#F2631F] text-white text-sm font-worksans font-medium hover:bg-orange-600 py-2 px-5 rounded-xl duration-300 transition"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || user?.role === 'merchant' || user?.role === 'admin'}
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;