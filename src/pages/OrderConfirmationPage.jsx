import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { recentOrder, navigateToHome, navigateToShop, formatPrice } = useShop();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!recentOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-medium text-brand-charcoal">No recent order found</h2>
        <button
          onClick={navigateToHome}
          className="px-6 py-3 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em]"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in space-y-10">
      
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-brand-dustyRoseLight text-brand-dustyRose flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle size={44} strokeWidth={1.5} />
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.35em] text-brand-taupe font-medium block">
          THANK YOU FOR YOUR ORDER
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-brand-charcoal tracking-wide">
          ORDER CONFIRMED
        </h1>
        <p className="text-sm font-sans text-brand-charcoal/70 font-light max-w-md mx-auto">
          Thank you for choosing Muskan The Label. We are preparing your pieces with intention and care.
        </p>
      </div>

      {/* Order Reference Box */}
      <div className="bg-brand-cream/60 p-6 sm:p-8 border border-brand-taupeLight/30 max-w-2xl mx-auto text-left space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-brand-taupeLight/30">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-taupe">Order Reference Number</span>
            <h3 className="font-serif text-2xl font-semibold text-brand-charcoal tracking-wider">
              {recentOrder.orderNumber}
            </h3>
          </div>
          <div className="mt-2 sm:mt-0 text-xs text-brand-taupe">
            <span>Date: {recentOrder.date}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-brand-charcoal">
          <div>
            <span className="text-brand-taupe uppercase tracking-wider text-[10px] block mb-1">
              Customer & Delivery Address
            </span>
            <p className="font-semibold">{recentOrder.customerName}</p>
            <p className="text-brand-charcoal/80 font-light mt-0.5">{recentOrder.shippingAddress}</p>
          </div>
          <div>
            <span className="text-brand-taupe uppercase tracking-wider text-[10px] block mb-1">
              Payment Method
            </span>
            <p className="font-semibold">{recentOrder.paymentMethod}</p>
            <p className="text-brand-charcoal/80 font-light mt-0.5">Order Status: Processing</p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="pt-4 border-t border-brand-taupeLight/30 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-brand-taupe block">Purchased Silhouettes</span>
          <div className="space-y-3">
            {recentOrder.items.map((item, idx) => (
              <div key={idx} className="flex space-x-3 items-center">
                <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-brand-cream" />
                <div className="flex-1">
                  <h4 className="font-serif text-sm font-medium text-brand-charcoal">{item.name}</h4>
                  <p className="text-[11px] text-brand-taupe">Size: {item.size} • Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-brand-charcoal">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Breakdown */}
        <div className="pt-4 border-t border-brand-taupeLight/30 text-xs space-y-1">
          <div className="flex justify-between text-brand-taupe">
            <span>Subtotal</span>
            <span>{formatPrice(recentOrder.subtotal)}</span>
          </div>
          {recentOrder.discount > 0 && (
            <div className="flex justify-between text-brand-dustyRose">
              <span>Discount</span>
              <span>-{formatPrice(recentOrder.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-brand-taupe">
            <span>Shipping</span>
            <span>{recentOrder.shipping === 0 ? 'FREE' : formatPrice(recentOrder.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-brand-charcoal pt-2 border-t border-brand-taupeLight/30">
            <span>Total Paid</span>
            <span>{formatPrice(recentOrder.total)}</span>
          </div>
        </div>
      </div>

      {/* Continue Shopping Button */}
      <div>
        <button
          onClick={() => navigateToShop('All', 'All')}
          className="px-8 py-4 bg-brand-charcoal text-brand-ivory hover:bg-brand-taupe transition-colors text-xs uppercase tracking-[0.25em] font-medium inline-flex items-center space-x-2"
        >
          <span>CONTINUE SHOPPING</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
};
