import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Package, Heart, LogOut } from 'lucide-react';

export const AccountModal = () => {
  const { isAccountOpen, setIsAccountOpen, wishlist, recentOrder } = useShop();

  const [activeTab, setActiveTab] = useState('profile');
  const [email, setEmail] = useState('customer@muskanthelabel.com');

  if (!isAccountOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAccountOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-brand-ivory p-6 sm:p-8 shadow-2xl z-10 animate-fade-in border border-brand-taupeLight/30">
        <button
          onClick={() => setIsAccountOpen(false)}
          className="absolute top-5 right-5 text-brand-charcoal/60 hover:text-brand-charcoal"
          aria-label="Close Account"
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-charcoal">
            <User size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium text-brand-charcoal">
              Welcome Back
            </h3>
            <p className="text-xs text-brand-taupe">Manage your orders and saved wardrobe</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-taupeLight/30 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-4 text-xs uppercase tracking-widest font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'profile'
                ? 'border-brand-charcoal text-brand-charcoal'
                : 'border-transparent text-brand-taupe hover:text-brand-charcoal'
            }`}
          >
            My Details
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 text-xs uppercase tracking-widest font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'orders'
                ? 'border-brand-charcoal text-brand-charcoal'
                : 'border-transparent text-brand-taupe hover:text-brand-charcoal'
            }`}
          >
            Orders History
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Ayesha"
                  className="w-full px-3 py-2 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Khan"
                  className="w-full px-3 py-2 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-brand-taupe">
              <span>Saved Items: <strong className="text-brand-charcoal">{wishlist.length}</strong></span>
              <button
                onClick={() => setIsAccountOpen(false)}
                className="px-4 py-2 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-wider hover:bg-brand-taupe transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrder ? (
              <div className="p-4 bg-brand-cream/60 border border-brand-taupeLight/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-brand-charcoal">
                  <span>Order #{recentOrder.orderNumber}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                    Confirmed
                  </span>
                </div>
                <p className="text-xs text-brand-taupe">Total: PKR {recentOrder.total.toLocaleString()}</p>
                <p className="text-[11px] text-brand-taupe">Placed on: {recentOrder.date}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-brand-taupe space-y-2">
                <Package size={28} strokeWidth={1.25} className="mx-auto text-brand-taupeLight" />
                <p className="text-xs">No recent orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
