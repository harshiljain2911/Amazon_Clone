import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartDB } from '../slices/cartSlice';
import { toggleWishlistDB } from '../slices/wishlistSlice';
import { openQuickView } from '../slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { splitPrice } from '../utils/formatters';

/* Helper — render star rating */
const StarRating = ({ rating = 0, count = 0 }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array(full).fill(null).map((_, i) => (
          <Star key={`f${i}`} size={13} className="text-[#e47911]" fill="#e47911" />
        ))}
        {half === 1 && (
          <div className="relative w-[13px] h-[13px]">
            <Star size={13} className="text-[#dddddd] absolute inset-0" fill="#dddddd" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <Star size={13} className="text-[#e47911]" fill="#e47911" />
            </div>
          </div>
        )}
        {Array(empty).fill(null).map((_, i) => (
          <Star key={`e${i}`} size={13} className="text-[#dddddd]" fill="#dddddd" />
        ))}
      </div>
      {count > 0 && (
        <span className="text-xs text-[#007185] hover:text-[#c7511f] cursor-pointer hover:underline">
          {count.toLocaleString('en-IN')}
        </span>
      )}
    </div>
  );
};



const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo }    = useSelector((s) => s.user);
  const { wishlistItems } = useSelector((s) => s.wishlist);

  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);
  const { int, dec } = splitPrice(product.price ?? 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!userInfo) {
      toast.error('Sign in to add items to your cart');
      return navigate('/login');
    }
    dispatch(addToCartDB({ item: product, qty: 1 }));
    toast.success(`"${product.name.split(' ').slice(0, 3).join(' ')}" added to cart`, {
      style: { fontSize: '13px' },
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!userInfo) {
      toast.error('Sign in to manage your wishlist');
      return navigate('/login');
    }
    dispatch(toggleWishlistDB(product));
    toast(isWishlisted ? 'Removed from Wish List' : 'Added to Wish List', {
      icon: isWishlisted ? '💔' : '❤️',
      style: { fontSize: '13px' },
    });
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    dispatch(openQuickView(product));
  };

  return (
    <div
      className="bg-white border border-[#dddddd] flex flex-col h-full relative group
                 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                 hover:-translate-y-0.5 cursor-pointer rounded-sm"
      onClick={handleQuickView}
    >
      {/* Wishlist heart */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full
                   shadow-sm hover:scale-110 active:scale-95 transition-transform"
        aria-label="Add to Wishlist"
      >
        <Heart
          size={16}
          className={isWishlisted ? 'fill-[#c7511f] text-[#c7511f]' : 'text-[#565959]'}
        />
      </button>

      {/* Product image */}
      <div className="flex items-center justify-center h-44 p-4 bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply
                     group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-3 pb-3 pt-1 gap-1">

        {/* Title */}
        <h3 className="text-sm text-[#0f1111] line-clamp-2 leading-snug
                       hover:text-[#c7511f] transition-colors">
          {product.name}
        </h3>

        {/* Stars */}
        <StarRating rating={product.rating ?? 4} count={product.numReviews ?? 0} />

        {/* Price */}
        <div className="flex items-start mt-1">
          <span className="text-xs text-[#0f1111] mt-0.5 mr-0.5">₹</span>
          <span className="text-lg font-bold text-[#0f1111] leading-none">{int}</span>
          <span className="text-xs text-[#0f1111] mt-0.5">.{dec}</span>
        </div>

        {/* Shipping note */}
        <p className="text-xs text-[#007185]">FREE Delivery by Amazon</p>

        {/* In stock */}
        {product.countInStock > 0 ? (
          <p className="text-xs text-[#067d62] font-medium">In stock</p>
        ) : (
          <p className="text-xs text-[#c7511f] font-medium">Out of stock</p>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="mt-auto w-full py-1.5 rounded-lg text-xs font-medium text-[#0f1111]
                     bg-[#ffd814] hover:bg-[#f7ca00] border border-[#FCD200]
                     active:bg-[#ddb100] transition-colors duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
