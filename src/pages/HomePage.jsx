import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { MOODS, ARTICLES, INSTAGRAM_POSTS } from '../data/products';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export const HomePage = () => {
  const { PRODUCTS, navigateToShop, navigateToProduct, setActiveArticle, showToast } = useShop();

  // Carousel index for Best Sellers
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Newsletter state
  const [newsEmail, setNewsEmail] = useState('');

  // Filter products for homepage sections
  const newInProducts = PRODUCTS.slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 6);

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? Math.max(0, bestSellers.length - 4) : prev - 1));
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev >= bestSellers.length - 4 ? 0 : prev + 1));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsEmail) {
      showToast('Welcome to the world of Muskan The Label.');
      setNewsEmail('');
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[88vh] sm:h-[92vh] overflow-hidden bg-brand-charcoal">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2000&auto=format&fit=crop"
          alt="Muskan The Label New Season Editorial"
          className="w-full h-full object-cover object-top opacity-85 scale-105 animate-fade-in transition-transform duration-1000"
        />
        
        {/* Subtle Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />

        {/* Text Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-6 sm:p-12 text-white max-w-4xl mx-auto z-10 pb-20 sm:pb-24">
          <span className="text-xs uppercase tracking-[0.35em] text-brand-sand font-medium mb-3">
            THE NEW SEASON
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-wide leading-tight text-white mb-4">
            Made for moments that matter.
          </h1>
          <p className="text-sm sm:text-base font-sans text-white/90 max-w-lg font-light mb-8 leading-relaxed">
            Contemporary silhouettes, timeless details and effortless Pakistani elegance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigateToShop('All', 'All')}
              className="px-8 py-4 bg-brand-ivory text-brand-charcoal hover:bg-brand-sand transition-all duration-300 text-xs uppercase tracking-[0.2em] font-semibold shadow-lg"
            >
              SHOP NEW IN
            </button>
            <button
              onClick={() => navigateToShop('All', 'All')}
              className="px-8 py-4 border border-white/60 text-white hover:bg-white hover:text-brand-charcoal transition-all duration-300 text-xs uppercase tracking-[0.2em] font-medium backdrop-blur-sm"
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </div>

        {/* Subtle Scroll Down Indicator */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center z-10">
          <a
            href="#new-in"
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors text-[10px] uppercase tracking-widest space-y-1"
          >
            <span>Scroll</span>
            <span className="w-px h-6 bg-white/40 animate-pulse" />
          </a>
        </div>
      </section>

      {/* 2. "NEW IN" SECTION — Asymmetric Grid */}
      <section id="new-in" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-brand-taupeLight/30 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-brand-taupe font-medium block mb-1">
              AUTUMN / WINTER '26
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-charcoal tracking-wide">
              NEW IN
            </h2>
            <p className="text-xs sm:text-sm text-brand-taupe font-sans mt-1">
              Pieces designed for your everyday elegance.
            </p>
          </div>
          <button
            onClick={() => navigateToShop('All', 'All')}
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] font-medium text-brand-charcoal hover:text-brand-taupe hover-underline-animation flex items-center space-x-2"
          >
            <span>View All New Arrivals</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Asymmetric Product Layout (1 featured large + 3 side items) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main Hero Product (Span 6) */}
          <div className="md:col-span-6">
            <ProductCard product={newInProducts[0]} priority={true} />
          </div>
          
          {/* 3 Secondary Products (Span 6 in 2-col or stacked) */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ProductCard product={newInProducts[1]} />
            <ProductCard product={newInProducts[2]} />
            <div className="sm:col-span-2 md:col-span-2">
              <ProductCard product={newInProducts[3]} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY MOOD */}
      <section className="bg-brand-cream/50 py-20 border-y border-brand-taupeLight/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-taupe font-medium block mb-2">
              CURATED CATEGORIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-charcoal tracking-wide">
              SHOP BY MOOD
            </h2>
            <div className="w-12 h-px bg-brand-taupeLight mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOODS.map((mood) => (
              <div
                key={mood.id}
                onClick={() => navigateToShop('All', mood.id)}
                className="group relative h-[420px] overflow-hidden cursor-pointer bg-brand-charcoal shadow-sm"
              >
                <img
                  src={mood.image}
                  alt={mood.title}
                  className="w-full h-full object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-108 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-brand-sand font-medium mb-1">
                    {mood.count}
                  </span>
                  <h3 className="font-serif text-2xl font-normal tracking-wider mb-1 group-hover:text-brand-sand transition-colors">
                    {mood.title}
                  </h3>
                  <p className="text-xs text-white/80 font-light mb-4">
                    {mood.subtitle}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE MOOD</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED COLLECTION — Full-width editorial banner */}
      <section className="relative w-full py-28 sm:py-36 bg-brand-charcoal overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
          alt="The Autumn Edit '26 Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center text-white">
          <span className="text-xs uppercase tracking-[0.4em] text-brand-sand font-medium mb-4">
            FEATURED CAPSULE
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-normal tracking-wide text-white mb-6 max-w-2xl leading-tight">
            THE AUTUMN EDIT '26
          </h2>
          <p className="text-sm sm:text-base font-sans text-white/80 max-w-lg font-light mb-10 leading-relaxed">
            A collection inspired by warm evenings, timeless silhouettes and understated elegance.
          </p>
          <button
            onClick={() => navigateToShop('All', 'All')}
            className="px-9 py-4 bg-brand-ivory text-brand-charcoal hover:bg-brand-sand transition-all text-xs uppercase tracking-[0.25em] font-semibold"
          >
            DISCOVER THE COLLECTION
          </button>
        </div>
      </section>

      {/* 5. BEST SELLERS — Horizontal Product Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-brand-taupeLight/30 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-brand-taupe font-medium block mb-1">
              MOST COVETED SILHOUETTES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-charcoal tracking-wide">
              THE ONES YOU LOVE
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center space-x-3">
            <button
              onClick={prevSlide}
              className="p-3 border border-brand-taupeLight/60 hover:border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 border border-brand-taupeLight/60 hover:border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Carousel Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.slice(carouselIndex, carouselIndex + 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. BRAND STORY — Split-Screen Layout */}
      <section className="bg-brand-ivory py-16 border-y border-brand-taupeLight/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Large Editorial Image */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] bg-brand-cream overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop"
                alt="Made With Intention — Muskan The Label"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block w-44 h-44 bg-brand-cream p-4 border border-brand-taupeLight/40 shadow-lg">
              <div className="w-full h-full border border-brand-taupeLight/30 flex flex-col items-center justify-center text-center p-2">
                <span className="font-serif text-2xl text-brand-charcoal">2026</span>
                <span className="text-[9px] uppercase tracking-widest text-brand-taupe font-medium mt-1">
                  ESTABLISHED
                </span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <span className="text-xs uppercase tracking-[0.35em] text-brand-taupe font-medium">
              PHILOSOPHY & CRAFT
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-brand-charcoal tracking-wide leading-tight">
              MADE WITH INTENTION
            </h2>
            
            <p className="font-serif italic text-xl text-brand-charcoal/80 leading-relaxed border-l-2 border-brand-dustyRose pl-4">
              "Muskan The Label brings together contemporary design and the beauty of Pakistani craftsmanship."
            </p>

            <p className="text-sm font-sans text-brand-charcoal/70 leading-relaxed font-light">
              Founded on the belief that luxury modern Pakistani fashion should be thoughtful, comfortable, and enduring. Every piece in our collection begins with hand-selected natural textiles—from high-thread count Swiss lawns to lustrous raw silks and supple velvets—tailored into clean, flattering cuts designed for the contemporary woman.
            </p>

            <div className="pt-4">
              <button
                onClick={() => navigateToShop('All', 'All')}
                className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-charcoal hover:text-brand-taupe hover-underline-animation flex items-center space-x-2"
              >
                <span>OUR STORY →</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. THE STYLE EDIT — Magazine Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-taupe font-medium block mb-2">
            EDITORIAL JOURNAL
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-charcoal tracking-wide">
            THE STYLE EDIT
          </h2>
          <div className="w-12 h-px bg-brand-taupeLight mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="group cursor-pointer flex flex-col space-y-4 text-left"
            >
              <div className="aspect-[4/3] bg-brand-cream overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">
                  {article.category}
                </span>
                <h3 className="font-serif text-2xl text-brand-charcoal group-hover:text-brand-taupe transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-xs text-brand-charcoal/70 line-clamp-2 font-light leading-relaxed">
                  {article.summary}
                </p>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-brand-charcoal group-hover:text-brand-dustyRose transition-colors inline-block pt-2">
                  Read Article →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOLLOW THE LABEL — Instagram Grid */}
      <section className="bg-brand-cream/30 py-16 border-t border-brand-taupeLight/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 text-center sm:text-left">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-brand-taupe font-medium block mb-1">
                INSTAGRAM COMMUNITY
              </span>
              <h2 className="font-serif text-3xl font-normal text-brand-charcoal tracking-wide">
                FOLLOW THE LABEL
              </h2>
              <p className="text-xs text-brand-taupe font-sans mt-0.5">
                @muskanthelabel
              </p>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 sm:mt-0 px-6 py-3 border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              FOLLOW US
            </a>
          </div>

          {/* Grid of 6 fashion images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden bg-brand-cream block"
              >
                <img
                  src={post.image}
                  alt="Muskan The Label Instagram"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                  <span>♥ {post.likes}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-12">
        <span className="text-xs uppercase tracking-[0.35em] text-brand-taupe font-medium block mb-3">
          MUSKAN PRIVÉ
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal tracking-wide mb-3">
          STAY IN THE KNOW
        </h2>
        <p className="text-xs sm:text-sm text-brand-charcoal/70 font-light max-w-md mx-auto mb-8">
          Be the first to discover new collections, exclusive drops and special offers.
        </p>

        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={newsEmail}
            onChange={(e) => setNewsEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-brand-cream/60 border border-brand-taupeLight/50 px-4 py-3 text-xs text-brand-charcoal placeholder:text-brand-taupe focus:outline-none focus:border-brand-charcoal"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-brand-charcoal text-brand-ivory hover:bg-brand-taupe text-xs uppercase tracking-[0.2em] font-medium transition-colors"
          >
            JOIN
          </button>
        </form>
      </section>

    </div>
  );
};
