import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Search, ArrowRight } from 'lucide-react';

export const SearchOverlay = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    PRODUCTS,
    navigateToProduct,
    setQuickAddProduct,
    formatPrice
  } = useShop();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const popularTags = [
    'Lawn',
    'Festive',
    'Velvet',
    'Kurta Sets',
    'Essentials',
    'New In',
    'Sale'
  ];

  const filteredProducts = query.trim() === ''
    ? []
    : PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.collection.toLowerCase().includes(query.toLowerCase()) ||
          p.fabric.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-ivory/98 backdrop-blur-xl animate-fade-in flex flex-col">
      {/* Header Close */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-end">
        <button
          onClick={() => setIsSearchOpen(false)}
          className="p-2 text-brand-charcoal hover:text-brand-taupe transition-colors flex items-center space-x-2"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Close</span>
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Search Container */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-4 pb-16 flex-1 flex flex-col items-center">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-taupe font-medium mb-3">
          MUSKAN THE LABEL
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-center text-brand-charcoal font-normal tracking-wide mb-8">
          WHAT ARE YOU LOOKING FOR?
        </h2>

        {/* Input Field */}
        <div className="w-full relative border-b-2 border-brand-charcoal/30 focus-within:border-brand-charcoal transition-colors pb-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lawn, velvet, festive, kurta sets..."
            className="w-full bg-transparent text-xl sm:text-2xl font-serif placeholder:font-sans placeholder:text-brand-taupeLight placeholder:text-lg focus:outline-none text-brand-charcoal pr-12"
          />
          <Search
            size={24}
            strokeWidth={1.5}
            className="absolute right-2 top-2 text-brand-taupe"
          />
        </div>

        {/* Popular Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-2xl">
          <span className="text-xs text-brand-taupe uppercase tracking-wider self-center mr-2">
            Popular Searches:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-4 py-1.5 border border-brand-taupeLight/40 hover:border-brand-charcoal text-xs uppercase tracking-wider text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory transition-all"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="w-full mt-12">
          {query.trim() !== '' && (
            <div className="mb-6 flex justify-between items-center text-xs text-brand-taupe uppercase tracking-widest border-b border-brand-taupeLight/20 pb-3">
              <span>Results ({filteredProducts.length})</span>
              <span>Matching "{query}"</span>
            </div>
          )}

          {query.trim() !== '' && filteredProducts.length === 0 && (
            <div className="text-center py-12 text-brand-taupe space-y-2">
              <p className="font-serif text-xl text-brand-charcoal">No silhouettes found matching "{query}"</p>
              <p className="text-xs">Try searching for Lawn, Festive, Silk, or Velvet.</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setIsSearchOpen(false);
                  navigateToProduct(product.id);
                }}
                className="group cursor-pointer flex flex-col space-y-2 text-left"
              >
                <div className="aspect-portrait bg-brand-cream overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-brand-taupe">
                    {product.category}
                  </span>
                  <h4 className="font-serif text-base text-brand-charcoal group-hover:text-brand-taupe transition-colors leading-tight">
                    {product.name}
                  </h4>
                  <p className="text-xs font-semibold text-brand-charcoal mt-0.5">
                    {formatPrice(product.salePrice || product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
