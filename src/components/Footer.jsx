import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Instagram, Facebook } from 'lucide-react';

export const Footer = () => {
  const { navigateToShop, setIsSizeGuideOpen, showToast } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to Muskan The Label newsletter');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#181716] text-[#FAF8F5] pt-16 pb-12 border-t border-brand-taupe/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Statement & Newsletter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="font-display tracking-[0.25em] text-2xl uppercase font-semibold text-white">
                MUSKAN
              </span>
              <span className="block text-[10px] tracking-[0.4em] text-brand-taupeLight uppercase font-light -mt-1">
                THE LABEL
              </span>
            </div>
            <p className="font-serif italic text-lg text-white/80 max-w-sm">
              "Contemporary Pakistani fashion, made with intention."
            </p>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm">
              Crafted for modern women who value timeless elegance, high-thread lawn, lush raw silk, and artisanal craftsmanship.
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 bg-white/5 p-6 sm:p-8 border border-white/10">
            <h3 className="font-serif text-2xl font-normal tracking-wide text-white">
              STAY IN THE KNOW
            </h3>
            <p className="text-xs text-white/70">
              Be the first to discover new collections, exclusive drops, and private festive previews.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs px-4 py-3 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black hover:bg-brand-sand text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>JOIN</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs">
          
          {/* Shop Column */}
          <div className="space-y-4">
            <h4 className="text-white/40 uppercase tracking-[0.25em] font-medium">SHOP</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateToShop('All', 'All')} className="text-white/80 hover:text-white transition-colors">
                  New In
                </button>
              </li>
              <li>
                <button onClick={() => navigateToShop('Lawn', 'All')} className="text-white/80 hover:text-white transition-colors">
                  Lawn Collection
                </button>
              </li>
              <li>
                <button onClick={() => navigateToShop('Festive', 'All')} className="text-white/80 hover:text-white transition-colors">
                  Festive Wear
                </button>
              </li>
              <li>
                <button onClick={() => navigateToShop('Velvet', 'All')} className="text-white/80 hover:text-white transition-colors">
                  Velvet Edit
                </button>
              </li>
              <li>
                <button onClick={() => navigateToShop('All', 'All')} className="text-white/80 hover:text-white transition-colors">
                  Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-4">
            <h4 className="text-white/40 uppercase tracking-[0.25em] font-medium">HELP</h4>
            <ul className="space-y-2.5">
              <li><a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact Concierge</a></li>
              <li><a href="#shipping" className="text-white/80 hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="#returns" className="text-white/80 hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li>
                <button onClick={() => setIsSizeGuideOpen(true)} className="text-white/80 hover:text-white transition-colors">
                  Size Guide
                </button>
              </li>
              <li><a href="#faqs" className="text-white/80 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* About Column */}
          <div className="space-y-4">
            <h4 className="text-white/40 uppercase tracking-[0.25em] font-medium">ABOUT</h4>
            <ul className="space-y-2.5">
              <li><a href="#story" className="text-white/80 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#journal" className="text-white/80 hover:text-white transition-colors">The Style Edit</a></li>
              <li><a href="#craftsmanship" className="text-white/80 hover:text-white transition-colors">Artisanal Craftsmanship</a></li>
              <li><a href="#careers" className="text-white/80 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="space-y-4">
            <h4 className="text-white/40 uppercase tracking-[0.25em] font-medium">CONNECT</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white flex items-center space-x-2 transition-colors">
                  <Instagram size={14} />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white flex items-center space-x-2 transition-colors">
                  <Facebook size={14} />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors">
                  TikTok
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 space-y-4 sm:space-y-0">
          <p>© 2026 MUSKAN THE LABEL. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>Lahore • Karachi • Islamabad</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
