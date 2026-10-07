import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const {
    navigateToHome,
    navigateToShop,
    navigateToWishlist,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setIsAccountOpen
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'New In', action: () => navigateToShop('All', 'All') },
    { name: 'Clothing', action: () => navigateToShop('Lawn', 'All') },
    { name: 'Collections', action: () => navigateToShop('All', 'All') },
    { name: 'Best Sellers', action: () => navigateToShop('All', 'All') },
    { name: 'Sale', action: () => navigateToShop('All', 'All') }
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div className="bg-[#1A1A1A] text-[#FAF8F5] text-[11px] tracking-[0.2em] uppercase py-2 text-center font-light">
        Complimentary Express Shipping Across Pakistan on Orders Above PKR 5,000
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-black/5 ${
          isScrolled
            ? 'bg-brand-ivory/95 backdrop-blur-md py-3 shadow-sm'
            : 'bg-brand-ivory py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-brand-charcoal hover:text-brand-taupe transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Left: Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              onClick={navigateToHome}
              className="text-left group inline-block"
            >
              <span className="font-display tracking-[0.22em] text-lg sm:text-xl lg:text-2xl uppercase font-semibold text-brand-charcoal group-hover:text-brand-taupe transition-colors">
                MUSKAN
              </span>
              <span className="block text-[9px] sm:text-[10px] tracking-[0.35em] text-brand-taupe uppercase font-sans font-light -mt-1">
                THE LABEL
              </span>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  link.action();
                }}
                className="text-xs uppercase tracking-[0.18em] font-medium text-brand-charcoal/85 hover:text-brand-charcoal hover-underline-animation transition-colors py-1"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-brand-charcoal/85 hover:text-brand-charcoal transition-colors relative"
              title="Search"
              aria-label="Search items"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            {/* Account */}
            <button
              onClick={() => setIsAccountOpen(true)}
              className="hidden sm:block p-1.5 text-brand-charcoal/85 hover:text-brand-charcoal transition-colors"
              title="Account"
              aria-label="Account details"
            >
              <User size={19} strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <button
              onClick={navigateToWishlist}
              className="p-1.5 text-brand-charcoal/85 hover:text-brand-charcoal transition-colors relative"
              title="Wishlist"
              aria-label="View Saved Wishlist"
            >
              <Heart size={19} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-dustyRose text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 text-brand-charcoal/85 hover:text-brand-charcoal transition-colors relative group"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-brand-charcoal text-brand-ivory text-[9px] font-medium rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-brand-ivory shadow-xl flex flex-col justify-between p-6 z-10 animate-slide-in-right">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-brand-taupeLight/30">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateToHome();
                  }}
                  className="text-left"
                >
                  <span className="font-display tracking-[0.2em] text-lg uppercase font-semibold text-brand-charcoal">
                    MUSKAN
                  </span>
                  <span className="block text-[9px] tracking-[0.3em] text-brand-taupe uppercase font-light">
                    THE LABEL
                  </span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-brand-charcoal hover:text-brand-taupe"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Links */}
              <nav className="mt-8 space-y-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      link.action();
                    }}
                    className="block w-full text-left font-serif text-2xl tracking-wide text-brand-charcoal hover:text-brand-dustyRose transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-brand-taupeLight/30 space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAccountOpen(true);
                  }}
                  className="flex items-center space-x-3 text-sm text-brand-charcoal/80 uppercase tracking-widest font-light"
                >
                  <User size={18} strokeWidth={1.5} />
                  <span>My Account</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateToWishlist();
                  }}
                  className="flex items-center space-x-3 text-sm text-brand-charcoal/80 uppercase tracking-widest font-light"
                >
                  <Heart size={18} strokeWidth={1.5} />
                  <span>Saved Wishlist ({wishlist.length})</span>
                </button>
              </div>
            </div>

            {/* Footer info in drawer */}
            <div className="pt-6 border-t border-brand-taupeLight/30 text-xs text-brand-taupe space-y-2">
              <p className="font-serif italic text-sm text-brand-charcoal/70">"Contemporary Pakistani fashion, made with intention."</p>
              <p>© 2026 Muskan The Label</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
