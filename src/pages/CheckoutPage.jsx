import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Lock, CheckCircle, ArrowLeft, Tag } from 'lucide-react';

export const CheckoutPage = () => {
  const {
    cart,
    cartTotal,
    setRecentOrder,
    setCurrentView,
    navigateToHome,
    formatPrice,
    showToast,
    placeOrderApi
  } = useShop();

  // Contact State
  const [formData, setFormData] = useState({
    fullName: 'Ayesha Khan',
    email: 'ayesha.khan@example.com',
    phone: '+92 300 1234567',
    address: 'House 42, Block 5, Clifton',
    area: 'Clifton Sector 5',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '75600',
    paymentMethod: 'Cash on Delivery' // 'Cash on Delivery' | 'Card' | 'Bank Transfer'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MUSKAN10') {
      setDiscountPercent(10);
      showToast('Promo code "MUSKAN10" applied! 10% discount subtracted.');
    } else {
      showToast('Invalid promo code. Try "MUSKAN10"');
    }
  };

  const shippingCost = cartTotal >= 5000 ? 0 : 250;
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: `${formData.address}${formData.area ? ', ' + formData.area : ''}`,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      paymentMethod: formData.paymentMethod,
      promoCode: discountPercent > 0 ? 'MUSKAN10' : '',
      items: cart.map(i => ({
        id: i.id,
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price
      }))
    };

    // Call REST API Endpoint
    const result = await placeOrderApi(payload);

    if (result.success) {
      setCurrentView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Create local order reference if API returned fallback
      const orderNumber = `MTL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackOrder = {
        orderNumber,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        items: [...cart],
        total: finalTotal,
        subtotal: cartTotal,
        discount: discountAmount,
        shippingFee: shippingCost,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.province}`,
        customerName: formData.fullName,
        paymentMethod: formData.paymentMethod
      };
      setRecentOrder(fallbackOrder);
      setCurrentView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setIsSubmitting(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-medium text-brand-charcoal">Your Shopping Bag is empty</h2>
        <p className="text-xs text-brand-taupe">Please add items to your bag before checking out.</p>
        <button
          onClick={navigateToHome}
          className="px-6 py-3 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em]"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-8 border-b border-brand-taupeLight/30 mb-10">
        <div>
          <button
            onClick={navigateToHome}
            className="text-xs uppercase tracking-widest text-brand-taupe hover:text-brand-charcoal flex items-center space-x-1 mb-2"
          >
            <ArrowLeft size={14} />
            <span>Return to Store</span>
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal tracking-wide">
            CHECKOUT
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs text-brand-taupe">
          <Lock size={16} className="text-emerald-700" />
          <span>Encrypted 256-Bit SSL Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Contact, Delivery, Payment (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Section 1: Contact Information */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-normal text-brand-charcoal border-b border-brand-taupeLight/20 pb-2 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-brand-charcoal text-brand-ivory text-xs flex items-center justify-center font-sans font-medium">1</span>
              <span>CONTACT INFORMATION</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                    Phone Number (SMS Order Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-normal text-brand-charcoal border-b border-brand-taupeLight/20 pb-2 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-brand-charcoal text-brand-ivory text-xs flex items-center justify-center font-sans font-medium">2</span>
              <span>DELIVERY ADDRESS</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                  Street Address / House No. / Building *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                  Area / Neighborhood
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                    City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Gujranwala">Gujranwala</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                  >
                    <option value="Sindh">Sindh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad Capital">Islamabad Capital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-taupe mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-normal text-brand-charcoal border-b border-brand-taupeLight/20 pb-2 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-brand-charcoal text-brand-ivory text-xs flex items-center justify-center font-sans font-medium">3</span>
              <span>PAYMENT METHOD</span>
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'Cash on Delivery'
                    ? 'border-brand-charcoal bg-brand-cream/60'
                    : 'border-brand-taupeLight/40 hover:border-brand-charcoal'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                  className="mt-1 accent-brand-charcoal"
                />
                <div className="ml-3">
                  <span className="font-semibold text-sm text-brand-charcoal block">Cash on Delivery (COD)</span>
                  <span className="text-xs text-brand-taupe block mt-0.5">
                    Pay with cash upon delivery at your doorstep anywhere in Pakistan.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'Card'
                    ? 'border-brand-charcoal bg-brand-cream/60'
                    : 'border-brand-taupeLight/40 hover:border-brand-charcoal'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={formData.paymentMethod === 'Card'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                  className="mt-1 accent-brand-charcoal"
                />
                <div className="ml-3">
                  <span className="font-semibold text-sm text-brand-charcoal block">Visa / MasterCard / UnionPay</span>
                  <span className="text-xs text-brand-taupe block mt-0.5">
                    Secure online card payment processed directly.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start p-4 border cursor-pointer transition-all ${
                  formData.paymentMethod === 'Bank Transfer'
                    ? 'border-brand-charcoal bg-brand-cream/60'
                    : 'border-brand-taupeLight/40 hover:border-brand-charcoal'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={formData.paymentMethod === 'Bank Transfer'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer' })}
                  className="mt-1 accent-brand-charcoal"
                />
                <div className="ml-3">
                  <span className="font-semibold text-sm text-brand-charcoal block">Direct Bank Transfer / Raast</span>
                  <span className="text-xs text-brand-taupe block mt-0.5">
                    Transfer funds directly to our Meezan Bank account.
                  </span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-brand-cream/40 p-6 sm:p-8 border border-brand-taupeLight/30 space-y-6 sticky top-28">
          <h2 className="font-serif text-2xl font-normal text-brand-charcoal border-b border-brand-taupeLight/30 pb-3">
            ORDER SUMMARY
          </h2>

          {/* Line items */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex space-x-3 items-center">
                <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-brand-cream" />
                <div className="flex-1">
                  <h4 className="font-serif text-sm font-medium text-brand-charcoal leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-brand-taupe">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-charcoal">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo code input */}
          <div className="pt-3 border-t border-brand-taupeLight/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (e.g. MUSKAN10)"
                className="flex-1 bg-brand-ivory border border-brand-taupeLight/40 px-3 py-2 text-xs text-brand-charcoal focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-brand-charcoal text-brand-ivory text-xs uppercase font-medium hover:bg-brand-taupe transition-colors"
              >
                Apply
              </button>
            </div>
            <p className="text-[10px] text-brand-taupe mt-1">
              Tip: Use code <strong>MUSKAN10</strong> for 10% launch discount!
            </p>
          </div>

          {/* Subtotal, Shipping, Discount, Total */}
          <div className="space-y-2 text-xs border-t border-brand-taupeLight/30 pt-4">
            <div className="flex justify-between text-brand-taupe">
              <span>Subtotal</span>
              <span className="font-medium text-brand-charcoal">{formatPrice(cartTotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-brand-dustyRose font-medium">
                <span>Discount (10%)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-taupe">
              <span>Shipping</span>
              <span className="font-medium text-brand-charcoal">
                {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
              </span>
            </div>

            <div className="flex justify-between text-base font-semibold text-brand-charcoal border-t border-brand-taupeLight/30 pt-3">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-charcoal text-brand-ivory hover:bg-brand-taupe transition-colors text-xs uppercase tracking-[0.25em] font-medium shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? 'PROCESSING ORDER...' : `PLACE ORDER — ${formatPrice(finalTotal)}`}
          </button>
        </div>

      </form>
    </div>
  );
};
