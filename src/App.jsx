import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { QuickAddModal } from './components/QuickAddModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ArticleModal } from './components/ArticleModal';
import { AccountModal } from './components/AccountModal';
import { Toast } from './components/Toast';

const MainContent = () => {
  const { currentView } = useShop();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-ivory text-brand-charcoal">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchOverlay />
      <QuickAddModal />
      <SizeGuideModal />
      <ArticleModal />
      <AccountModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}

export default App;
