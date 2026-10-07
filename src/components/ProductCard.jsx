import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

export const ProductCard = ({ product, priority = false }) => {
  const {
    navigateToProduct,
    wishlist,
    toggleWishlist,
    setQuickAddProduct,
    formatPrice
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);

  const isSavedInWishlist = wishlist.includes(product.id);
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <div
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-portrait w-full overflow-hidden bg-brand-cream/60">
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 ${
            isSavedInWishlist
              ? 'bg-brand-ivory text-brand-dustyRose shadow-md scale-105'
              : 'bg-brand-ivory/80 backdrop-blur-sm text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-brand-ivory hover:scale-105'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart
            size={16}
            strokeWidth={1.75}
            fill={isSavedInWishlist ? 'currentColor' : 'none'}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
          {product.isNew && (
            <span className="bg-brand-charcoal text-brand-ivory text-[9px] uppercase tracking-[0.2em] font-medium px-2.5 py-1">
              New In
            </span>
          )}
          {product.salePrice && (
            <span className="bg-brand-dustyRose text-white text-[9px] uppercase tracking-[0.2em] font-medium px-2.5 py-1">
              Sale
            </span>
          )}
        </div>

        {/* Main Image with Hover Swap & Zoom */}
        <div
          onClick={() => navigateToProduct(product.id)}
          className="w-full h-full"
        >
          <img
            src={isHovered && secondaryImage ? secondaryImage : product.images[0]}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Quick Add Overlay Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickAddProduct(product);
            }}
            className="w-full py-2.5 bg-brand-ivory/95 backdrop-blur-md text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-2 border border-brand-charcoal/10 shadow-lg"
          >
            <ShoppingBag size={14} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div
        onClick={() => navigateToProduct(product.id)}
        className="mt-3.5 flex flex-col space-y-1"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">
            {product.category}
          </span>
          {product.rating && (
            <span className="text-[11px] text-brand-taupe flex items-center space-x-1">
              <span className="text-brand-gold">★</span>
              <span>{product.rating}</span>
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg text-brand-charcoal group-hover:text-brand-taupe transition-colors leading-tight font-medium">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 pt-0.5">
          {product.salePrice ? (
            <>
              <span className="text-sm font-semibold text-brand-charcoal">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs text-brand-taupe line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-brand-charcoal">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
