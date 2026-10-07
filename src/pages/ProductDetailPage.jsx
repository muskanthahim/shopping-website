import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, Ruler, Check, ChevronDown, ChevronUp, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const ProductDetailPage = () => {
  const {
    selectedProductId,
    PRODUCTS,
    addToCart,
    wishlist,
    toggleWishlist,
    setIsSizeGuideOpen,
    formatPrice,
    navigateToShop
  } = useShop();

  const product = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors[0] ? product.colors[0].name : 'Standard'
  );
  const [quantity, setQuantity] = useState(1);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState('details');

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const isSavedInWishlist = wishlist.includes(product.id);

  // 4 Related Products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.mood === product.mood)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      
      {/* Main PDP Grid: 60% Image Gallery Left, 40% Product Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Gallery (~60% on desktop => lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Featured Large Image View */}
          <div className="aspect-portrait w-full bg-brand-cream overflow-hidden relative border border-brand-taupeLight/20 shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-all duration-500"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-brand-charcoal text-brand-ivory text-[9px] uppercase tracking-[0.2em] font-medium px-3 py-1">
                New In
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-28 flex-shrink-0 bg-brand-cream overflow-hidden border transition-all ${
                  selectedImageIndex === idx
                    ? 'border-brand-charcoal ring-1 ring-brand-charcoal'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Info & Add to Bag (~40% on desktop => lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Breadcrumbs & Category */}
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-brand-taupe font-medium">
            <button onClick={() => navigateToShop('All', 'All')} className="hover:text-brand-charcoal">Shop</button>
            <span>/</span>
            <span>{product.category}</span>
          </div>

          {/* Title & Ratings */}
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal tracking-wide leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center text-brand-gold text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                    className={i < Math.floor(product.rating || 5) ? 'text-brand-gold' : 'text-brand-taupeLight'}
                  />
                ))}
              </div>
              <span className="text-xs text-brand-taupe font-medium">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3 py-1">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-semibold text-brand-charcoal">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-brand-taupe line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-brand-dustyRose bg-brand-dustyRoseLight px-2 py-0.5">
                  Save {formatPrice(product.price - product.salePrice)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-brand-charcoal">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm font-sans text-brand-charcoal/80 font-light leading-relaxed">
            {product.description}
          </p>

          <div className="w-full h-px bg-brand-taupeLight/30 my-4" />

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-widest text-brand-taupe">
                <span>Color</span>
                <span className="font-semibold text-brand-charcoal">{selectedColor}</span>
              </div>
              <div className="flex space-x-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? 'border-brand-charcoal ring-2 ring-brand-charcoal/20 scale-105'
                        : 'border-black/20 hover:border-black/40'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check
                        size={14}
                        className={c.hex === '#FFFFFF' || c.hex === '#F7F5F0' || c.hex === '#F5F3ED' ? 'text-black' : 'text-white'}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector & Size Guide */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest">
              <span className="text-brand-taupe">Select Size</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-brand-charcoal hover:text-brand-dustyRose underline flex items-center space-x-1"
              >
                <Ruler size={13} />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 text-xs font-medium uppercase border transition-all ${
                    selectedSize === sz
                      ? 'border-brand-charcoal bg-brand-charcoal text-brand-ivory'
                      : 'border-brand-taupeLight/60 bg-transparent text-brand-charcoal hover:border-brand-charcoal'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs uppercase tracking-widest text-brand-taupe block">Quantity</span>
            <div className="flex items-center border border-brand-taupeLight/60 w-32 justify-between px-3 py-2 bg-brand-ivory">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-brand-charcoal hover:text-brand-taupe text-sm font-semibold"
              >
                -
              </button>
              <span className="text-xs font-semibold text-brand-charcoal">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-brand-charcoal hover:text-brand-taupe text-sm font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Bag & Wishlist Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
              className="w-full py-4 bg-brand-charcoal text-brand-ivory hover:bg-brand-taupe transition-colors text-xs uppercase tracking-[0.25em] font-medium flex items-center justify-center space-x-2 shadow-lg"
            >
              <ShoppingBag size={16} />
              <span>ADD TO BAG — {formatPrice((product.salePrice || product.price) * quantity)}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-full py-3.5 border transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center space-x-2 ${
                isSavedInWishlist
                  ? 'border-brand-dustyRose text-brand-dustyRose bg-brand-dustyRoseLight/30'
                  : 'border-brand-charcoal/30 text-brand-charcoal hover:border-brand-charcoal'
              }`}
            >
              <Heart size={16} fill={isSavedInWishlist ? 'currentColor' : 'none'} />
              <span>{isSavedInWishlist ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-brand-taupeLight/30 text-[11px] text-brand-taupe text-center">
            <div className="flex flex-col items-center space-y-1">
              <Truck size={18} strokeWidth={1.5} className="text-brand-charcoal" />
              <span>Free Delivery &gt; PKR 5k</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <ShieldCheck size={18} strokeWidth={1.5} className="text-brand-charcoal" />
              <span>100% Authentic Textile</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <RefreshCw size={18} strokeWidth={1.5} className="text-brand-charcoal" />
              <span>14-Day Hassle Free</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="pt-6 border-t border-brand-taupeLight/30 space-y-3">
            
            {/* Details Accordion */}
            <div className="border-b border-brand-taupeLight/20 pb-3">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center text-xs uppercase tracking-widest font-medium text-brand-charcoal py-1"
              >
                <span>Details & Specifications</span>
                {openAccordion === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'details' && (
                <div className="mt-3 text-xs text-brand-charcoal/80 space-y-2 leading-relaxed animate-fade-in">
                  <p>• <strong>Collection:</strong> {product.collection}</p>
                  <p>• <strong>Fabric:</strong> {product.fabric}</p>
                  <p>• <strong>Fit:</strong> Tailored relaxed silhouette</p>
                  <p>• <strong>Package Includes:</strong> Shirt, Trousers & Dupatta/Veil (as specified)</p>
                </div>
              )}
            </div>

            {/* Shipping Accordion */}
            <div className="border-b border-brand-taupeLight/20 pb-3">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center text-xs uppercase tracking-widest font-medium text-brand-charcoal py-1"
              >
                <span>Shipping & Delivery</span>
                {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="mt-3 text-xs text-brand-charcoal/80 space-y-2 leading-relaxed animate-fade-in">
                  <p>• Express Delivery across Pakistan within 2-4 working days.</p>
                  <p>• International worldwide shipping delivered via DHL Express within 5-7 business days.</p>
                  <p>• Free shipping applied automatically on all domestic orders above PKR 5,000.</p>
                </div>
              )}
            </div>

            {/* Returns Accordion */}
            <div className="border-b border-brand-taupeLight/20 pb-3">
              <button
                onClick={() => toggleAccordion('returns')}
                className="w-full flex justify-between items-center text-xs uppercase tracking-widest font-medium text-brand-charcoal py-1"
              >
                <span>Returns & Exchanges</span>
                {openAccordion === 'returns' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'returns' && (
                <div className="mt-3 text-xs text-brand-charcoal/80 space-y-2 leading-relaxed animate-fade-in">
                  <p>• 14-day exchange policy for unstitched or unaltered items in original packaging with tags intact.</p>
                  <p>• Doorstep pickup available for returns in Karachi, Lahore, and Islamabad.</p>
                </div>
              )}
            </div>

            {/* Fabric & Care Accordion */}
            <div className="border-b border-brand-taupeLight/20 pb-3">
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full flex justify-between items-center text-xs uppercase tracking-widest font-medium text-brand-charcoal py-1"
              >
                <span>Fabric & Care</span>
                {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'care' && (
                <div className="mt-3 text-xs text-brand-charcoal/80 space-y-2 leading-relaxed animate-fade-in">
                  <p>• Dry clean recommended for silk, organza, and velvet pieces.</p>
                  <p>• Gentle hand wash in cold water for lawn and cotton ensembles.</p>
                  <p>• Iron inside-out on low heat; avoid direct steam on embroidered embellishments.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* YOU MAY ALSO LIKE — 4 Related Items */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-brand-taupeLight/30">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-taupe font-medium block mb-1">
              CURATED RECOMMENDATIONS
            </span>
            <h2 className="font-serif text-3xl font-normal text-brand-charcoal tracking-wide">
              YOU MAY ALSO LIKE
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
