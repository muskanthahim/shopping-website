import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-brand-ivory p-6 sm:p-8 shadow-2xl z-10 animate-fade-in border border-brand-taupeLight/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-5 right-5 text-brand-charcoal/60 hover:text-brand-charcoal"
          aria-label="Close Size Guide"
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <Ruler size={22} className="text-brand-taupe" />
          <span className="text-xs uppercase tracking-[0.2em] text-brand-taupe font-medium">
            Sizing & Fit
          </span>
        </div>
        <h3 className="font-serif text-3xl font-normal text-brand-charcoal tracking-wide mb-6">
          WOMEN'S SIZE GUIDE
        </h3>

        <p className="text-xs text-brand-charcoal/80 mb-6 leading-relaxed">
          All Muskan The Label garments are tailored to relaxed contemporary Pakistani proportions. All measurements below are given in inches.
        </p>

        {/* Size Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-charcoal border-collapse">
            <thead>
              <tr className="border-b border-brand-charcoal text-brand-taupe uppercase tracking-wider">
                <th className="py-3 px-3 font-medium">Size</th>
                <th className="py-3 px-3 font-medium">Bust (in)</th>
                <th className="py-3 px-3 font-medium">Waist (in)</th>
                <th className="py-3 px-3 font-medium">Hip (in)</th>
                <th className="py-3 px-3 font-medium">Shirt Length (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-taupeLight/30">
              <tr>
                <td className="py-3 px-3 font-semibold uppercase">XS (Extra Small)</td>
                <td className="py-3 px-3">34"</td>
                <td className="py-3 px-3">28"</td>
                <td className="py-3 px-3">37"</td>
                <td className="py-3 px-3">44"</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold uppercase">S (Small)</td>
                <td className="py-3 px-3">36"</td>
                <td className="py-3 px-3">30"</td>
                <td className="py-3 px-3">39"</td>
                <td className="py-3 px-3">45"</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold uppercase">M (Medium)</td>
                <td className="py-3 px-3">39"</td>
                <td className="py-3 px-3">33"</td>
                <td className="py-3 px-3">42"</td>
                <td className="py-3 px-3">46"</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold uppercase">L (Large)</td>
                <td className="py-3 px-3">42"</td>
                <td className="py-3 px-3">36"</td>
                <td className="py-3 px-3">45"</td>
                <td className="py-3 px-3">47"</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold uppercase">XL (Extra Large)</td>
                <td className="py-3 px-3">45"</td>
                <td className="py-3 px-3">39"</td>
                <td className="py-3 px-3">48"</td>
                <td className="py-3 px-3">47"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-taupeLight/30 text-xs text-brand-taupe space-y-2">
          <p className="font-semibold text-brand-charcoal">Need custom stitching or fit advice?</p>
          <p>Contact our concierge team via WhatsApp or email at care@muskanthelabel.com.</p>
        </div>
      </div>
    </div>
  );
};
