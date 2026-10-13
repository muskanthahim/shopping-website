import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Package, Heart, LogOut, Lock, Mail, Phone, Eye, EyeOff, Check, AlertCircle, ShoppingBag } from 'lucide-react';

export const AccountModal = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    user,
    login,
    register,
    logout,
    updateProfile,
    wishlist,
    cartItemCount,
    navigateToWishlist,
    navigateToShop,
    recentOrder
  } = useShop();

  // Mode when logged out: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');

  // Mode when logged in: 'profile' | 'orders'
  const [accountTab, setAccountTab] = useState('profile');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Profile edit form state (when logged in)
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Orders list state
  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Sync profile fields when user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Fetch orders when modal opens and user is logged in
  useEffect(() => {
    if (isAccountOpen && user) {
      setLoadingOrders(true);
      const token = localStorage.getItem('muskan_token');
      fetch('/api/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setOrdersList(data);
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [isAccountOpen, user]);

  if (!isAccountOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    const result = await login(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (!result.success) {
      setLoginError(result.error);
    } else {
      setLoginPassword('');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsRegistering(true);
    const result = await register(regName.trim(), regEmail.trim(), regPassword, regPhone.trim());
    setIsRegistering(false);

    if (!result.success) {
      setRegError(result.error);
    } else {
      setRegPassword('');
      setRegConfirmPassword('');
    }
  };

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');

    if (!profileName.trim()) {
      setProfileMessage('Name cannot be empty.');
      return;
    }

    setIsSavingProfile(true);
    const result = await updateProfile(profileName, profilePhone);
    setIsSavingProfile(false);

    if (result.success) {
      setProfileMessage('Profile updated successfully.');
      setTimeout(() => setProfileMessage(''), 4000);
    } else {
      setProfileMessage(result.error || 'Failed to update profile.');
    }
  };

  // Format member date
  const memberDate = user && user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'October 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAccountOpen(false)}
      />

      {/* Modal Dialog */}
      <div id="account-modal-dialog" className="relative w-full max-w-lg bg-brand-ivory p-6 sm:p-8 shadow-2xl z-10 animate-fade-in border border-brand-taupeLight/30 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="account-modal-close-btn"
          onClick={() => setIsAccountOpen(false)}
          className="absolute top-5 right-5 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
          aria-label="Close Account Modal"
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        {/* ============================================================== */}
        {/* VIEW 1: USER IS NOT LOGGED IN (SIGN IN / CREATE ACCOUNT)     */}
        {/* ============================================================== */}
        {!user ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-taupe block mb-1">
                MUSKAN THE LABEL
              </span>
              <h3 className="font-serif text-3xl font-normal text-brand-charcoal">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="text-xs text-brand-taupe font-light mt-1.5 max-w-xs mx-auto">
                {authMode === 'login'
                  ? 'Access your saved pieces, track your orders and checkout seamlessly.'
                  : 'Join Muskan The Label to save silhouettes, track deliveries and receive private edits.'}
              </p>
            </div>

            {/* Auth Switcher Tabs */}
            <div className="flex border-b border-brand-taupeLight/30 mb-6">
              <button
                id="tab-sign-in"
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError('');
                }}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-medium transition-all border-b-2 -mb-px text-center ${
                  authMode === 'login'
                    ? 'border-brand-charcoal text-brand-charcoal'
                    : 'border-transparent text-brand-taupe hover:text-brand-charcoal'
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-create-account"
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setRegError('');
                }}
                className={`flex-1 pb-3 text-xs uppercase tracking-widest font-medium transition-all border-b-2 -mb-px text-center ${
                  authMode === 'register'
                    ? 'border-brand-charcoal text-brand-charcoal'
                    : 'border-transparent text-brand-taupe hover:text-brand-charcoal'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50/80 border border-red-200/60 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-brand-cream/40 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal placeholder-brand-taupe/40 focus:outline-none focus:border-brand-charcoal"
                    />
                    <Mail size={16} className="absolute left-3 top-3 text-brand-taupe" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password-input"
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-brand-cream/40 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal placeholder-brand-taupe/40 focus:outline-none focus:border-brand-charcoal"
                    />
                    <Lock size={16} className="absolute left-3 top-3 text-brand-taupe" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-brand-taupe hover:text-brand-charcoal"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-3 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-taupe transition-colors disabled:opacity-60 flex items-center justify-center space-x-2"
                >
                  {isLoggingIn ? (
                    <span>Signing In...</span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

                <div className="text-center pt-3 text-xs text-brand-taupe">
                  <span>Don't have an account yet? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setLoginError('');
                    }}
                    className="text-brand-charcoal font-medium underline"
                  >
                    Create one now
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <div className="p-3 bg-red-50/80 border border-red-200/60 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-name-input"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full pl-9 pr-3 py-2 bg-brand-cream/40 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal placeholder-brand-taupe/40 focus:outline-none focus:border-brand-charcoal"
                    />
                    <User size={16} className="absolute left-3 top-2.5 text-brand-taupe" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-email-input"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. ayesha@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-brand-cream/40 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal placeholder-brand-taupe/40 focus:outline-none focus:border-brand-charcoal"
                    />
                    <Mail size={16} className="absolute left-3 top-2.5 text-brand-taupe" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="reg-phone-input"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-9 pr-3 py-2 bg-brand-cream/40 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal placeholder-brand-taupe/40 focus:outline-none focus:border-brand-charcoal"
                    />
                    <Phone size={16} className="absolute left-3 top-2.5 text-brand-taupe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full pl-9 pr-9 py-2 bg-brand-cream/40 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal placeholder-brand-taupe/40 focus:outline-none focus:border-brand-charcoal"
                      />
                      <Lock size={16} className="absolute left-3 top-2.5 text-brand-taupe" />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-2.5 text-brand-taupe hover:text-brand-charcoal"
                      >
                        {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                      Confirm <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="reg-confirm-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full pl-9 pr-3 py-2 bg-brand-cream/40 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal placeholder-brand-taupe/40 focus:outline-none focus:border-brand-charcoal"
                      />
                      <Lock size={16} className="absolute left-3 top-2.5 text-brand-taupe" />
                    </div>
                  </div>
                </div>

                <button
                  id="reg-submit-btn"
                  type="submit"
                  disabled={isRegistering}
                  className="w-full mt-3 py-3 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-taupe transition-colors disabled:opacity-60 flex items-center justify-center space-x-2"
                >
                  {isRegistering ? (
                    <span>Creating Account...</span>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>

                <div className="text-center pt-2 text-xs text-brand-taupe">
                  <span>Already have an account? </span>
                  <button
                    id="switch-to-login-btn"
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setRegError('');
                    }}
                    className="text-brand-charcoal font-medium underline"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 2: USER IS LOGGED IN (PROFILE & ORDERS HISTORY)           */
          /* ============================================================== */
          <div>
            {/* Logged in Header Banner */}
            <div className="flex items-center justify-between pb-5 border-b border-brand-taupeLight/30 mb-6">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-brand-charcoal text-brand-ivory flex items-center justify-center font-serif text-lg tracking-wider">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-brand-charcoal leading-tight">
                    {user.name}
                  </h3>
                  <p className="text-xs text-brand-taupe font-mono">{user.email}</p>
                  <span className="text-[10px] text-brand-taupe/80 uppercase tracking-widest block mt-0.5">
                    Member Since {memberDate}
                  </span>
                </div>
              </div>

              <button
                id="sign-out-btn"
                onClick={() => {
                  logout();
                  setAuthMode('login');
                }}
                title="Sign Out"
                className="flex items-center space-x-1.5 px-3 py-1.5 border border-brand-taupeLight/50 text-[11px] uppercase tracking-wider text-brand-taupe hover:text-red-700 hover:border-red-300 transition-colors"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
              <div className="p-3 bg-brand-cream/40 border border-brand-taupeLight/30">
                <span className="text-xs uppercase tracking-wider text-brand-taupe block text-[10px]">Orders</span>
                <span className="font-serif text-lg font-semibold text-brand-charcoal">{ordersList.length}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAccountOpen(false);
                  navigateToWishlist();
                }}
                className="p-3 bg-brand-cream/40 border border-brand-taupeLight/30 hover:border-brand-charcoal transition-colors text-center"
              >
                <span className="text-xs uppercase tracking-wider text-brand-taupe block text-[10px]">Saved</span>
                <span className="font-serif text-lg font-semibold text-brand-charcoal">{wishlist.length}</span>
              </button>
              <div className="p-3 bg-brand-cream/40 border border-brand-taupeLight/30">
                <span className="text-xs uppercase tracking-wider text-brand-taupe block text-[10px]">In Bag</span>
                <span className="font-serif text-lg font-semibold text-brand-charcoal">{cartItemCount}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-brand-taupeLight/30 mb-6">
              <button
                id="tab-my-details"
                onClick={() => setAccountTab('profile')}
                className={`flex-1 pb-2 px-4 text-xs uppercase tracking-widest font-medium transition-all border-b-2 -mb-px text-center ${
                  accountTab === 'profile'
                    ? 'border-brand-charcoal text-brand-charcoal'
                    : 'border-transparent text-brand-taupe hover:text-brand-charcoal'
                }`}
              >
                My Details
              </button>
              <button
                id="tab-orders-history"
                onClick={() => setAccountTab('orders')}
                className={`flex-1 pb-2 px-4 text-xs uppercase tracking-widest font-medium transition-all border-b-2 -mb-px text-center ${
                  accountTab === 'orders'
                    ? 'border-brand-charcoal text-brand-charcoal'
                    : 'border-transparent text-brand-taupe hover:text-brand-charcoal'
                }`}
              >
                Orders History ({ordersList.length})
              </button>
            </div>

            {/* TAB: MY DETAILS */}
            {accountTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {profileMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <Check size={15} className="flex-shrink-0" />
                    <span>{profileMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Account Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full pl-9 pr-3 py-2 bg-brand-taupeLight/20 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal/70 cursor-not-allowed"
                    />
                    <Lock size={15} className="absolute left-3 top-2.5 text-brand-taupe/60" />
                  </div>
                  <span className="text-[10px] text-brand-taupe/70 mt-1 block">
                    Contact concierge support to update verified account email.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                    />
                    <User size={15} className="absolute left-3 top-2.5 text-brand-taupe" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-brand-taupe mb-1 font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-9 pr-3 py-2 bg-brand-cream/50 border border-brand-taupeLight/40 text-sm font-sans text-brand-charcoal focus:outline-none focus:border-brand-charcoal"
                    />
                    <Phone size={15} className="absolute left-3 top-2.5 text-brand-taupe" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-wider hover:bg-brand-taupe transition-colors disabled:opacity-60"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: ORDERS HISTORY */}
            {accountTab === 'orders' && (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {loadingOrders ? (
                  <div className="text-center py-10 text-brand-taupe text-xs">
                    Loading your order history...
                  </div>
                ) : ordersList.length > 0 ? (
                  ordersList.map((ord) => (
                    <div
                      key={ord.id || ord.order_number}
                      className="p-4 bg-brand-cream/60 border border-brand-taupeLight/30 space-y-2.5"
                    >
                      <div className="flex justify-between items-center text-xs font-semibold text-brand-charcoal">
                        <span>Order #{ord.order_number}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                          {ord.order_status || 'Confirmed'}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline text-xs">
                        <span className="text-brand-taupe">Total Amount:</span>
                        <span className="font-serif font-semibold text-brand-charcoal">
                          PKR {Number(ord.total).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-[11px] text-brand-taupe space-y-0.5 border-t border-brand-taupeLight/20 pt-2">
                        <p>
                          Placed on: {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p>Payment: {ord.payment_method || 'Cash on Delivery'}</p>
                        <p className="truncate">Delivery to: {ord.shipping_address}, {ord.city}</p>
                      </div>

                      {/* Item list */}
                      {ord.items && ord.items.length > 0 && (
                        <div className="border-t border-brand-taupeLight/20 pt-2 space-y-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-brand-taupe block">
                            Ordered Items ({ord.items.length}):
                          </span>
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-brand-charcoal/90">
                              <span className="truncate pr-2">
                                {item.quantity}x {item.product_name} ({item.size || 'M'})
                              </span>
                              <span className="font-mono text-[11px]">
                                PKR {Number(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : recentOrder ? (
                  <div className="p-4 bg-brand-cream/60 border border-brand-taupeLight/30 space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-brand-charcoal">
                      <span>Order #{recentOrder.orderNumber}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-xs text-brand-taupe">
                      Total: PKR {Number(recentOrder.total).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-brand-taupe">Placed on: {recentOrder.date}</p>
                  </div>
                ) : (
                  <div className="text-center py-10 text-brand-taupe space-y-3">
                    <Package size={32} strokeWidth={1.2} className="mx-auto text-brand-taupeLight" />
                    <h4 className="font-serif text-lg text-brand-charcoal font-normal">
                      No Orders Placed Yet
                    </h4>
                    <p className="text-xs max-w-xs mx-auto leading-relaxed">
                      Your past orders and deliveries will appear here once you make your first purchase.
                    </p>
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        navigateToShop('All', 'All');
                      }}
                      className="mt-2 px-5 py-2 bg-brand-charcoal text-brand-ivory text-xs uppercase tracking-wider hover:bg-brand-taupe transition-colors"
                    >
                      Explore Collections
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
