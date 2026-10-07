import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

const ShopContext = createContext();

const API_BASE_URL = 'http://localhost:5001/api';

export const ShopProvider = ({ children }) => {
  // Page view state: 'home' | 'shop' | 'product-detail' | 'wishlist' | 'checkout' | 'order-confirmation'
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMood, setFilterMood] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Products from Backend REST API
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Cart & Wishlist state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('muskan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('muskan_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [recentOrder, setRecentOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('muskan_token') || null);

  // UI Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // 1. Fetch Products from Express + MySQL REST API
  const fetchProductsFromApi = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_BASE_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setIsBackendConnected(true);
        }
      }
    } catch (err) {
      // Backend not running yet or starting up -> fallback gracefully
      setIsBackendConnected(false);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // 2. Health check & Initial Data load
  useEffect(() => {
    fetchProductsFromApi();

    // Fetch Categories & Collections
    fetch(`${API_BASE_URL}/categories`)
      .then(r => r.ok ? r.json() : [])
      .then(data => data.length && setCategories(data))
      .catch(() => {});

    fetch(`${API_BASE_URL}/collections`)
      .then(r => r.ok ? r.json() : [])
      .then(data => data.length && setCollections(data))
      .catch(() => {});
  }, [fetchProductsFromApi]);

  // Persist Local Backup
  useEffect(() => {
    localStorage.setItem('muskan_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('muskan_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync Cart with Backend API
  const syncCartWithBackend = async (product, size, color, quantity) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, size, color, quantity })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items) setCart(data.items);
      }
    } catch (e) {
      // API sync silent fallback
    }
  };

  const addToCart = (product, size = 'M', color = null, quantity = 1) => {
    const selectedColor = color || (product.colors && product.colors[0] ? product.colors[0].name : 'Standard');
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            image: product.images[0],
            size,
            color: selectedColor,
            quantity
          }
        ];
      }
    });

    syncCartWithBackend(product, size, selectedColor, quantity);
    showToast(`Added "${product.name}" (${size}) to your bag`);
  };

  const removeFromCart = (index) => {
    const item = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    
    if (item && item.cartItemId) {
      fetch(`${API_BASE_URL}/cart/${item.cartItemId}`, { method: 'DELETE' }).catch(() => {});
    }
    showToast('Item removed from shopping bag');
  };

  const updateCartQuantity = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      
      if (updated[index].cartItemId) {
        fetch(`${API_BASE_URL}/cart/${updated[index].cartItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQty })
        }).catch(() => {});
      }
      return updated;
    });
  };

  // Sync Wishlist with Backend API
  const toggleWishlist = async (productId) => {
    const isSaved = wishlist.includes(productId);
    const product = products.find(p => p.id === productId);
    
    if (isSaved) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      fetch(`${API_BASE_URL}/wishlist/${productId}`, { method: 'DELETE' }).catch(() => {});
      if (product) showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, productId]);
      fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      }).catch(() => {});
      if (product) showToast(`Saved "${product.name}" to wishlist`);
    }
  };

  // Place Order API Integration
  const placeOrderApi = async (orderPayload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const orderData = await res.json();
        setRecentOrder(orderData);
        setCart([]); // Clear cart
        fetchProductsFromApi(); // Refresh stock numbers
        return { success: true, data: orderData };
      } else {
        const errData = await res.json();
        return { success: false, error: errData.error || 'Failed to place order.' };
      }
    } catch (err) {
      // Local fallback execution if backend DB is reconnecting
      return { success: false, error: err.message };
    }
  };

  const navigateToProduct = (id) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShop = (category = 'All', mood = 'All') => {
    setFilterCategory(category);
    setFilterMood(mood);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToWishlist = () => {
    setCurrentView('wishlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (amount) => {
    return `PKR ${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <ShopContext.Provider
      value={{
        PRODUCTS: products,
        categories,
        collections,
        isBackendConnected,
        loadingProducts,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        filterCategory,
        setFilterCategory,
        filterMood,
        setFilterMood,
        searchQuery,
        setSearchQuery,
        cart,
        wishlist,
        recentOrder,
        setRecentOrder,
        user,
        setUser,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isAccountOpen,
        setIsAccountOpen,
        activeArticle,
        setActiveArticle,
        quickAddProduct,
        setQuickAddProduct,
        toastMessage,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        placeOrderApi,
        navigateToProduct,
        navigateToShop,
        navigateToHome,
        navigateToWishlist,
        navigateToCheckout,
        cartTotal,
        cartItemCount,
        formatPrice,
        refreshProducts: fetchProductsFromApi
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
