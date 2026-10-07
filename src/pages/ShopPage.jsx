import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, COLLECTIONS } from '../data/products';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

export const ShopPage = () => {
  const {
    PRODUCTS,
    filterCategory,
    setFilterCategory,
    filterMood,
    setFilterMood
  } = useShop();

  const [selectedCollection, setSelectedCollection] = useState('All Collections');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL'];
  const colors = ['All', 'Ivory', 'Onyx', 'Dusty Rose', 'Emerald', 'Gold', 'Sapphire', 'Taupe'];

  // Clear all filters handler
  const clearAllFilters = () => {
    setFilterCategory('All');
    setFilterMood('All');
    setSelectedCollection('All Collections');
    setSelectedSize('All');
    setSelectedColor('All');
    setMaxPrice(20000);
    setInStockOnly(false);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (filterCategory !== 'All' && product.category !== filterCategory) {
        return false;
      }
      // Mood match
      if (filterMood !== 'All' && product.mood !== filterMood) {
        return false;
      }
      // Collection match
      if (selectedCollection !== 'All Collections' && product.collection !== selectedCollection) {
        return false;
      }
      // Size match
      if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
        return false;
      }
      // Color match
      if (selectedColor !== 'All') {
        const hasColor = product.colors && product.colors.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }
      // Price match
      const currentPrice = product.salePrice || product.price;
      if (currentPrice > maxPrice) {
        return false;
      }
      // In Stock
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'best-selling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0; // Featured
    });
  }, [PRODUCTS, filterCategory, filterMood, selectedCollection, selectedSize, selectedColor, maxPrice, inStockOnly, sortBy]);

  const hasActiveFilters =
    filterCategory !== 'All' ||
    filterMood !== 'All' ||
    selectedCollection !== 'All Collections' ||
    selectedSize !== 'All' ||
    selectedColor !== 'All' ||
    maxPrice < 20000 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs uppercase tracking-[0.35em] text-brand-taupe font-medium">
          THE COMPLETE WARDROBE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-brand-charcoal tracking-wide">
          {filterCategory !== 'All' ? filterCategory.toUpperCase() : filterMood !== 'All' ? `${filterMood.toUpperCase()} EDIT` : 'SHOP ALL'}
        </h1>
        <p className="text-xs sm:text-sm font-sans text-brand-charcoal/70 font-light leading-relaxed">
          Discover modern Pakistani silhouettes designed with artisanal craftsmanship, high-thread lawn, raw silk, and quiet luxury.
        </p>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden col-span-1 flex justify-between items-center bg-brand-cream/60 p-4 border border-brand-taupeLight/30">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest font-medium text-brand-charcoal"
          >
            <SlidersHorizontal size={16} />
            <span>Filter Silhouettes</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-dustyRose" />
            )}
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-sans uppercase tracking-wider text-brand-charcoal focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>

        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 space-y-8 lg:block ${
            isMobileFilterOpen
              ? 'fixed inset-0 z-50 bg-brand-ivory p-6 overflow-y-auto block'
              : 'hidden'
          }`}
        >
          {/* Mobile Filter Header */}
          {isMobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-brand-taupeLight/30 lg:hidden">
              <span className="font-serif text-xl font-medium text-brand-charcoal">Filters</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-brand-charcoal"
              >
                <X size={22} />
              </button>
            </div>
          )}

          {/* Header Action */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-charcoal/20">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-charcoal">
              FILTERS
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] uppercase tracking-wider text-brand-dustyRose hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Filter 1: Category */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-brand-taupe font-medium">Category</h4>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`block w-full text-left text-xs uppercase tracking-wider transition-colors ${
                    filterCategory === cat
                      ? 'font-semibold text-brand-charcoal underline underline-offset-4'
                      : 'text-brand-charcoal/70 hover:text-brand-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: Collection */}
          <div className="space-y-3 pt-4 border-t border-brand-taupeLight/20">
            <h4 className="text-xs uppercase tracking-widest text-brand-taupe font-medium">Collection</h4>
            <div className="space-y-1.5">
              {COLLECTIONS.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col)}
                  className={`block w-full text-left text-xs uppercase tracking-wider transition-colors ${
                    selectedCollection === col
                      ? 'font-semibold text-brand-charcoal underline underline-offset-4'
                      : 'text-brand-charcoal/70 hover:text-brand-charcoal'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 3: Size */}
          <div className="space-y-3 pt-4 border-t border-brand-taupeLight/20">
            <h4 className="text-xs uppercase tracking-widest text-brand-taupe font-medium">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 text-xs font-medium uppercase border transition-all ${
                    selectedSize === sz
                      ? 'border-brand-charcoal bg-brand-charcoal text-brand-ivory'
                      : 'border-brand-taupeLight/50 text-brand-charcoal hover:border-brand-charcoal'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 4: Color */}
          <div className="space-y-3 pt-4 border-t border-brand-taupeLight/20">
            <h4 className="text-xs uppercase tracking-widest text-brand-taupe font-medium">Color Palette</h4>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1 text-[11px] uppercase border transition-all ${
                    selectedColor === c
                      ? 'border-brand-charcoal bg-brand-cream font-semibold text-brand-charcoal'
                      : 'border-brand-taupeLight/40 text-brand-charcoal/70 hover:border-brand-charcoal'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 5: Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-brand-taupeLight/20">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-brand-taupe">
              <span>Max Price</span>
              <span className="font-semibold text-brand-charcoal">PKR {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="4000"
              max="20000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-charcoal cursor-pointer"
            />
          </div>

          {/* Filter 6: Availability */}
          <div className="pt-4 border-t border-brand-taupeLight/20">
            <label className="flex items-center space-x-2 text-xs uppercase tracking-wider text-brand-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-brand-charcoal"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Mobile Done Button */}
          {isMobileFilterOpen && (
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-6 w-full py-3 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          )}
        </aside>

        {/* Products Grid Column */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Top Grid Status Bar */}
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-brand-taupeLight/30 text-xs text-brand-taupe uppercase tracking-wider">
            <span>Showing {filteredProducts.length} Silhouettes</span>

            {/* Desktop Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-brand-taupe">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-sans text-xs uppercase font-medium text-brand-charcoal focus:outline-none cursor-pointer border-b border-brand-charcoal/30 pb-0.5"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="best-selling">Best Selling</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-[11px] uppercase tracking-wider text-brand-taupe">Active:</span>
              {filterCategory !== 'All' && (
                <span className="px-2.5 py-1 bg-brand-cream border border-brand-taupeLight text-[11px] uppercase text-brand-charcoal flex items-center space-x-1">
                  <span>Category: {filterCategory}</span>
                  <button onClick={() => setFilterCategory('All')}><X size={12} /></button>
                </span>
              )}
              {filterMood !== 'All' && (
                <span className="px-2.5 py-1 bg-brand-cream border border-brand-taupeLight text-[11px] uppercase text-brand-charcoal flex items-center space-x-1">
                  <span>Mood: {filterMood}</span>
                  <button onClick={() => setFilterMood('All')}><X size={12} /></button>
                </span>
              )}
              {selectedCollection !== 'All Collections' && (
                <span className="px-2.5 py-1 bg-brand-cream border border-brand-taupeLight text-[11px] uppercase text-brand-charcoal flex items-center space-x-1">
                  <span>Collection: {selectedCollection}</span>
                  <button onClick={() => setSelectedCollection('All Collections')}><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid Layout */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-brand-cream/40 border border-brand-taupeLight/30 space-y-3">
              <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
                No matching silhouettes found
              </h3>
              <p className="text-xs text-brand-taupe max-w-sm mx-auto">
                Try widening your price range or clearing specific size/category filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
