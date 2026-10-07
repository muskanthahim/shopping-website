import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm w-full bg-brand-charcoal text-brand-ivory px-4 py-3 shadow-2xl flex items-center space-x-3 border border-brand-taupeLight/20">
      <CheckCircle2 size={18} className="text-brand-dustyRose flex-shrink-0" />
      <span className="text-xs tracking-wide font-medium">{toastMessage}</span>
    </div>
  );
};
