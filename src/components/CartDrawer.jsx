import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    cartItemCount,
    removeFromCart,
    updateCartQuantity,
    navigateToCheckout,
    navigateToShop,
    formatPrice
  } = useShop();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 5000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-ivory shadow-2xl flex flex-col justify-between animate-slide-in-right z-10 border-l border-brand-taupeLight/30">
          
          {/* Header */}
          <div className="p-6 border-b border-brand-taupeLight/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={20} strokeWidth={1.5} className="text-brand-charcoal" />
                <h2 className="font-serif text-2xl font-medium text-brand-charcoal tracking-wide">
                  Shopping Bag
                </h2>
                <span className="text-xs text-brand-taupe">({cartItemCount})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
                aria-label="Close Shopping Bag"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Free Delivery Bar */}
            <div className="mt-4 pt-3 border-t border-brand-taupeLight/20">
              <div className="flex justify-between text-xs text-brand-charcoal mb-1.5">
                {remainingForFreeShipping > 0 ? (
                  <span>
                    You're <strong className="font-semibold text-brand-dustyRose">{formatPrice(remainingForFreeShipping)}</strong> away from <span className="uppercase tracking-wider font-medium">Free Shipping</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium tracking-wide flex items-center space-x-1">
                    <span>✨</span>
                    <span>You've unlocked FREE EXPRESS SHIPPING!</span>
                  </span>
                )}
              </div>
              <div className="w-full bg-brand-sand h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-charcoal h-full transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-taupe">
                  <ShoppingBag size={28} strokeWidth={1.25} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-brand-charcoal">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-brand-taupe max-w-xs">
                    Explore our latest lawn, festive, and everyday edits crafted for modern elegance.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateToShop('All', 'All');
                  }}
                  className="mt-4 px-6 py-3 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-taupe transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}-${index}`}
                  className="flex space-x-4 pb-5 border-b border-brand-taupeLight/20 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-28 object-cover bg-brand-cream flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-lg font-medium text-brand-charcoal leading-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-brand-taupe hover:text-brand-dustyRose p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-xs text-brand-taupe mt-1">
                        Size: <span className="font-medium text-brand-charcoal uppercase">{item.size}</span>
                        {item.color && (
                          <>
                            <span className="mx-1.5">•</span>
                            <span>{item.color}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-brand-taupeLight/50">
                        <button
                          onClick={() => updateCartQuantity(index, -1)}
                          className="px-2 py-1 text-brand-charcoal hover:bg-brand-sand transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-xs font-medium text-brand-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, 1)}
                          className="px-2 py-1 text-brand-charcoal hover:bg-brand-sand transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-brand-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-taupeLight/30 bg-brand-cream/40 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-brand-taupe">
                  <span>Subtotal</span>
                  <span className="text-brand-charcoal font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-brand-taupe">
                  <span>Estimated Shipping</span>
                  <span className="text-brand-charcoal font-medium">
                    {remainingForFreeShipping === 0 ? 'FREE' : formatPrice(250)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-brand-charcoal pt-2 border-t border-brand-taupeLight/20">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal + (remainingForFreeShipping === 0 ? 0 : 250))}</span>
                </div>
              </div>

              <button
                onClick={navigateToCheckout}
                className="w-full py-3.5 bg-brand-charcoal text-brand-ivory hover:bg-brand-taupe transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
