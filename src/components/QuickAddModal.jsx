import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Check } from 'lucide-react';

export const QuickAddModal = () => {
  const { quickAddProduct, setQuickAddProduct, addToCart, formatPrice } = useShop();

  if (!quickAddProduct) return null;

  const [selectedSize, setSelectedSize] = useState(quickAddProduct.sizes[1] || quickAddProduct.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(
    quickAddProduct.colors && quickAddProduct.colors[0] ? quickAddProduct.colors[0].name : 'Standard'
  );

  const handleAdd = () => {
    addToCart(quickAddProduct, selectedSize, selectedColor, 1);
    setQuickAddProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickAddProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-brand-ivory p-6 shadow-2xl z-10 animate-fade-in border border-brand-taupeLight/30">
        <button
          onClick={() => setQuickAddProduct(null)}
          className="absolute top-4 right-4 text-brand-charcoal/60 hover:text-brand-charcoal"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <div className="flex space-x-4">
          <img
            src={quickAddProduct.images[0]}
            alt={quickAddProduct.name}
            className="w-20 h-28 object-cover bg-brand-cream"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">
              {quickAddProduct.category}
            </span>
            <h3 className="font-serif text-xl font-medium text-brand-charcoal">
              {quickAddProduct.name}
            </h3>
            <p className="text-sm font-semibold text-brand-charcoal mt-1">
              {formatPrice(quickAddProduct.salePrice || quickAddProduct.price)}
            </p>
          </div>
        </div>

        {/* Color Swatches if multiple */}
        {quickAddProduct.colors && quickAddProduct.colors.length > 0 && (
          <div className="mt-5">
            <label className="block text-xs uppercase tracking-widest text-brand-taupe mb-2">
              Color: <span className="text-brand-charcoal font-medium">{selectedColor}</span>
            </label>
            <div className="flex space-x-2">
              {quickAddProduct.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                    selectedColor === c.name
                      ? 'border-brand-charcoal ring-2 ring-brand-charcoal/20 scale-110'
                      : 'border-black/20 hover:border-black/40'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.name && (
                    <Check
                      size={12}
                      className={c.hex === '#FFFFFF' || c.hex === '#F7F5F0' || c.hex === '#F5F3ED' ? 'text-black' : 'text-white'}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-widest text-brand-taupe">
              Select Size
            </label>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {quickAddProduct.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 text-xs font-medium uppercase border transition-all ${
                  selectedSize === size
                    ? 'border-brand-charcoal bg-brand-charcoal text-brand-ivory'
                    : 'border-brand-taupeLight/60 bg-transparent text-brand-charcoal hover:border-brand-charcoal'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add Action */}
        <button
          onClick={handleAdd}
          className="mt-6 w-full py-3 bg-brand-charcoal text-brand-ivory hover:bg-brand-taupe transition-colors text-xs uppercase tracking-[0.2em] font-medium"
        >
          Add to Bag — {formatPrice(quickAddProduct.salePrice || quickAddProduct.price)}
        </button>
      </div>
    </div>
  );
};
