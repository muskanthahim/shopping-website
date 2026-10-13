import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ShopContext = createContext();

const API_BASE_URL = '/api';

export const ShopProvider = ({ children }) => {
  // Page view state: 'home' | 'shop' | 'product-detail' | 'wishlist' | 'checkout' | 'order-confirmation'
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMood, setFilterMood] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Data from Backend REST API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Authentication State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('muskan_token') || null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Helper for Authorization Headers
  const getAuthHeaders = useCallback(() => {
    const token = authToken || localStorage.getItem('muskan_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [authToken]);

  // 1. Fetch Products from Express + MySQL REST API
  const fetchProductsFromApi = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_BASE_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setIsBackendConnected(true);
        }
      }
    } catch (err) {
      console.error('Failed to load products from API:', err);
      setIsBackendConnected(false);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // 2. Fetch User Profile if Token Exists
  const fetchCurrentUser = useCallback(async (token) => {
    const activeToken = token || authToken || localStorage.getItem('muskan_token');
    if (!activeToken) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } else {
        // Invalid or expired token -> clear it
        localStorage.removeItem('muskan_token');
        setAuthToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('fetchCurrentUser error:', err);
    } finally {
      setAuthLoading(false);
    }
  }, [authToken]);

  // 3. Fetch Cart from Backend
  const fetchCartFromApi = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items)) {
          setCart(data.items);
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }, [getAuthHeaders]);

  // 4. Fetch Wishlist from Backend
  const fetchWishlistFromApi = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist);
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }, [getAuthHeaders]);

  // 5. Initial Data Load & Authentication Verification
  useEffect(() => {
    fetchProductsFromApi();

    // Fetch Categories
    fetch(`${API_BASE_URL}/categories`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});

    // Fetch Collections
    fetch(`${API_BASE_URL}/collections`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) setCollections(data);
      })
      .catch(() => {});

    // Fetch Editorial Articles
    fetch(`${API_BASE_URL}/articles`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(() => {});

    // Check user auth
    fetchCurrentUser();

    // Fetch Cart & Wishlist
    fetchCartFromApi();
    fetchWishlistFromApi();
  }, [fetchProductsFromApi, fetchCurrentUser, fetchCartFromApi, fetchWishlistFromApi]);

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
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
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
            image: product.images && product.images[0] ? product.images[0] : '',
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
      fetch(`${API_BASE_URL}/cart/${item.cartItemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(() => {});
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
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
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
      fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(() => {});
      if (product) showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, productId]);
      fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
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
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
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
      return { success: false, error: err.message };
    }
  };

  // Auth: Login function
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid email or password.' };
      }

      localStorage.setItem('muskan_token', data.token);
      setAuthToken(data.token);
      setUser(data.user);

      // Refresh cart, wishlist, and orders with newly authenticated user
      setTimeout(() => {
        fetchCartFromApi();
        fetchWishlistFromApi();
      }, 100);

      showToast(`Welcome back, ${data.user.name}`);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: 'Could not connect to server. Please try again.' };
    }
  };

  // Auth: Register function
  const register = async (name, email, password, phone) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      localStorage.setItem('muskan_token', data.token);
      setAuthToken(data.token);
      setUser(data.user);

      showToast(`Account created. Welcome to Muskan The Label, ${data.user.name}`);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: 'Could not connect to server. Please try again.' };
    }
  };

  // Auth: Logout function
  const logout = () => {
    localStorage.removeItem('muskan_token');
    setAuthToken(null);
    setUser(null);
    setRecentOrder(null);
    setCart([]);
    setWishlist([]);
    showToast('You have been signed out.');
  };

  // Auth: Update Profile function
  const updateProfile = async (name, phone) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ name, phone })
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update profile.' };
      }

      setUser(data.user);
      showToast('Your profile details have been updated.');
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: 'Could not update profile.' };
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
        articles,
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
        authToken,
        authLoading,
        login,
        register,
        logout,
        updateProfile,
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
