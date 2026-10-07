import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Calendar, Tag } from 'lucide-react';

export const ArticleModal = () => {
  const { activeArticle, setActiveArticle } = useShop();

  if (!activeArticle) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setActiveArticle(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-brand-ivory p-6 sm:p-10 shadow-2xl z-10 my-8 animate-fade-in border border-brand-taupeLight/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setActiveArticle(null)}
          className="absolute top-6 right-6 text-brand-charcoal/60 hover:text-brand-charcoal p-1"
          aria-label="Close Article"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Article Header */}
        <div className="flex items-center space-x-4 text-xs text-brand-taupe uppercase tracking-widest mb-3">
          <span className="flex items-center space-x-1">
            <Tag size={14} />
            <span>{activeArticle.category}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{activeArticle.date}</span>
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-brand-charcoal tracking-wide mb-6 leading-tight">
          {activeArticle.title}
        </h2>

        {/* Hero Cover Image */}
        <div className="aspect-[16/9] w-full bg-brand-cream overflow-hidden mb-8">
          <img
            src={activeArticle.image}
            alt={activeArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-6 font-serif text-lg text-brand-charcoal/90 leading-relaxed">
          <p className="text-xl italic font-light text-brand-taupe border-l-2 border-brand-dustyRose pl-4">
            "{activeArticle.summary}"
          </p>

          <div className="whitespace-pre-line font-sans text-sm text-brand-charcoal/80 leading-relaxed space-y-4 pt-4">
            {activeArticle.content}
          </div>
        </div>

        {/* Author / Footer */}
        <div className="mt-10 pt-6 border-t border-brand-taupeLight/30 flex justify-between items-center text-xs text-brand-taupe">
          <span>Written by The Editorial Team</span>
          <span className="uppercase tracking-widest font-semibold text-brand-charcoal">MUSKAN JOURNAL</span>
        </div>
      </div>
    </div>
  );
};
