'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Mail, Lock, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen: propIsOpen, onClose: propOnClose, initialMode }: AuthModalProps) {
  const authContext = useAuth();
  
  const isOpen = propIsOpen !== undefined ? propIsOpen : authContext.isAuthModalOpen;
  const handleClose = propOnClose || authContext.closeAuthModal;
  
  const [mode, setMode] = useState<'login' | 'register'>(
    initialMode || authContext.authModalMode || 'register'
  );
  
  const [loginTab, setLoginTab] = useState<'phone' | 'email'>('email');

  // Form inputs
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [showPromoField, setShowPromoField] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || authContext.authModalMode || 'login');
      setError('');
      setSuccessMessage('');
      setResetSent(false);
      setLoading(false);
      setPassword('');
    }
  }, [isOpen, initialMode, authContext.authModalMode]);

  if (!isOpen) return null;

  const resetFormState = () => {
    setError('');
    setSuccessMessage('');
    setResetSent(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!acceptTerms) {
      setError('Please accept the user agreement to register.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Determine target email for Firebase Auth
    let regEmail = email.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!regEmail && cleanPhone) {
      regEmail = `${cleanPhone}@wholesaler.pk`;
    }

    if (!regEmail) {
      setError('Please enter a valid email address or phone number.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, password);
      const user = userCredential.user;

      // Sync user profile to Firestore users collection
      await authContext.syncUserProfile(user, {
        phone: phone.trim(),
        promoCode: promoCode.trim(),
      });

      setSuccessMessage('Registration successful! Welcome to Wholesaler-PK.');
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email or phone number is already registered. Please log in.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 8 characters.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    let targetEmail = '';
    if (loginTab === 'email') {
      targetEmail = email.trim();
    } else {
      const cleanPhone = phone.replace(/\D/g, '');
      if (!cleanPhone) {
        setError('Please enter your phone number.');
        return;
      }
      targetEmail = `${cleanPhone}@wholesaler.pk`;
    }

    if (!targetEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
      await authContext.syncUserProfile(userCredential.user);
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid login credentials. Please check your details or register.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    resetFormState();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Save Google User to Firestore users collection
      await authContext.syncUserProfile(result.user, {
        phone: phone.trim() || result.user.phoneNumber || '',
        promoCode: promoCode.trim(),
      });

      setSuccessMessage('Successfully authenticated with Google!');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      console.error('Google Auth error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    resetFormState();
    const targetEmail = email.trim();
    if (!targetEmail) {
      setError('Please enter your email address above to reset your password.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setResetSent(true);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError('Failed to send reset email. Ensure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-gray-900">
      
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Main Dialog Modal */}
      <div className="relative w-full max-w-[400px] bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {mode === 'register' ? 'Registration' : 'Login'}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3.5 py-2.5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-gray-900">{successMessage}</h3>
          </div>
        ) : (
          <>
            {/* REGISTRATION FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                
                {/* Phone Input */}
                <div className="flex items-center bg-[#f4f5f7] rounded-2xl px-3.5 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition">
                  <div className="flex items-center gap-1 pr-3 border-r border-gray-300/80 text-gray-700 flex-shrink-0 select-none">
                    <span className="text-base leading-none">🇵🇰</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+92 000 0000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent pl-3 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Email Input */}
                <div className="flex items-center bg-[#f4f5f7] rounded-2xl px-3.5 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition">
                  <div className="flex items-center pr-3 border-r border-gray-300/80 text-gray-400 flex-shrink-0">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent pl-3 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Password Input */}
                <div className="flex items-center bg-[#f4f5f7] rounded-2xl px-3.5 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition">
                  <div className="flex items-center pr-3 border-r border-gray-300/80 text-gray-400 flex-shrink-0">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent pl-3 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>

                <p className="text-xs text-gray-400 pl-1 -mt-1">At least 8 characters</p>

                {/* Add promo code */}
                <div className="pt-1">
                  {showPromoField ? (
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-[#f4f5f7] rounded-xl px-3.5 py-2 text-xs text-gray-900 border border-gray-200 outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPromoField(true)}
                      className="text-sm font-semibold text-[#6f0c07] hover:underline cursor-pointer"
                    >
                      Add promo code
                    </button>
                  )}
                </div>

                {/* User Agreement Checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer select-none pt-2 pb-1">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-[#6f0c07] border-gray-300 cursor-pointer"
                  />
                  <span>
                    By clicking &quot;Register&quot;, I accept{' '}
                    <a href="/pages/terms-conditions" target="_blank" className="text-[#6f0c07] font-semibold hover:underline">
                      the user agreement
                    </a>
                  </span>
                </label>

                {/* Register Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6f0c07] hover:bg-[#580a06] text-white font-extrabold text-base py-3.5 rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3">
                
                {/* Segmented Phone / Email Switcher */}
                <div className="bg-[#f4f5f7] p-1 rounded-2xl flex gap-1 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginTab('phone');
                      resetFormState();
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      loginTab === 'phone'
                        ? 'bg-[#6f0c07] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginTab('email');
                      resetFormState();
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      loginTab === 'email'
                        ? 'bg-[#6f0c07] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                </div>

                {/* Input according to selected Login Tab */}
                {loginTab === 'phone' ? (
                  <div className="flex items-center bg-[#f4f5f7] rounded-2xl px-3.5 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition">
                    <div className="flex items-center gap-1 pr-3 border-r border-gray-300/80 text-gray-700 flex-shrink-0 select-none">
                      <span className="text-base leading-none">🇵🇰</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+92 000 0000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent pl-3 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                ) : (
                  <div className="flex items-center bg-[#f4f5f7] rounded-2xl px-3.5 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition">
                    <div className="flex items-center pr-3 border-r border-gray-300/80 text-gray-400 flex-shrink-0">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent pl-3 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}

                {/* Password Input */}
                <div className="flex items-center bg-[#f4f5f7] rounded-2xl px-3.5 py-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition">
                  <div className="flex items-center pr-3 border-r border-gray-300/80 text-gray-400 flex-shrink-0">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent pl-3 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-[#6f0c07] font-semibold hover:underline cursor-pointer"
                  >
                    Forgot your password?
                  </button>
                </div>

                {resetSent && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-xl text-center">
                    Password reset link sent to your email!
                  </p>
                )}

                {/* Login Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6f0c07] hover:bg-[#580a06] text-white font-extrabold text-base py-3.5 rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-3"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
            )}

            {/* Divider 'or' */}
            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-gray-200" />
              <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">or</span>
            </div>

            {/* Social Auth (Google Icon Button Only as requested) */}
            <div className="flex justify-center mb-5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-13 h-13 rounded-2xl bg-[#f4f5f7] hover:bg-gray-200 border border-gray-200/80 flex items-center justify-center transition shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50"
                title="Sign in with Google"
              >
                <GoogleIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Navigation Link */}
            <div className="text-center text-xs text-gray-600 font-medium">
              {mode === 'register' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      resetFormState();
                    }}
                    className="text-[#6f0c07] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      resetFormState();
                    }}
                    className="text-[#6f0c07] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
