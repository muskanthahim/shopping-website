import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage = () => {
  const {
    wishlist,
    PRODUCTS,
    toggleWishlist,
    setQuickAddProduct,
    navigateToProduct,
    navigateToShop,
    formatPrice
  } = useShop();

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.35em] text-brand-taupe font-medium block">
          SAVED WARDROBE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-brand-charcoal tracking-wide">
          YOUR WISHLIST
        </h1>
        <p className="text-xs sm:text-sm font-sans text-brand-charcoal/70 font-light">
          {savedProducts.length} {savedProducts.length === 1 ? 'silhouette' : 'silhouettes'} saved for later.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 bg-brand-cream/40 border border-brand-taupeLight/30 space-y-4 p-8">
          <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mx-auto text-brand-taupe">
            <Heart size={28} strokeWidth={1.25} />
          </div>
          <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-brand-taupe leading-relaxed">
            Click the heart icon on any silhouette to save items to your personal wishlist.
          </p>
          <button
            onClick={() => navigateToShop('All', 'All')}
            className="mt-4 px-6 py-3 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-taupe transition-colors inline-flex items-center space-x-2"
          >
            <span>EXPLORE NEW ARRIVALS</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {savedProducts.map((product) => (
            <div key={product.id} className="relative group flex flex-col space-y-3">
              <ProductCard product={product} />

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={() => setQuickAddProduct(product)}
                  className="flex-1 py-2.5 bg-brand-charcoal text-brand-ivory hover:bg-brand-taupe text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center space-x-1.5"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2.5 border border-brand-taupeLight/50 text-brand-taupe hover:text-brand-dustyRose hover:border-brand-dustyRose transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
