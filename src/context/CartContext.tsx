'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/data/products';
import { getProductUnit } from '@/lib/productPrice';

export interface CartItem {
  specialInstructions: string | undefined;
  cartId: string;
  productId: string;
  slug: string;
  name: string;
  urduName: string;
  price: number;
  originalPrice: number;
  image: string;
  selectedWeight: string;
  selectedVariant: string;
  unit: string;
  quantity: number;
  moq?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variantOrWeight?: ProductVariant | string, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const freeShippingThreshold = 3000;

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('wholesale_pk_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem('wholesale_pk_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart and wishlist
  useEffect(() => {
    try {
      localStorage.setItem('wholesale_pk_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('wholesale_pk_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: Product, variantOrWeight?: ProductVariant | string, quantity?: number, specialInstructions?: string) => {
    // 1. Enforce Minimum Order Quantity (MOQ)
    const moq = product.moq && product.moq > 0 ? product.moq : 1;
    const qty = Math.max(quantity && quantity > 0 ? quantity : moq, moq);

    let variant: ProductVariant | undefined;
    let weight: string | undefined;
    if (typeof variantOrWeight === 'string') {
      weight = variantOrWeight;
    } else if (variantOrWeight && typeof variantOrWeight === 'object') {
      variant = variantOrWeight;
    }

    // 2. Legacy weight fallback (food products)
    const availableWeights = (product.weights && Array.isArray(product.weights) && product.weights.length > 0)
      ? product.weights
      : ['1kg'];
    const defaultWeight = availableWeights.find(w => w.toLowerCase().replace(/\s+/g, '') === '1kg') || availableWeights[0] || '1kg';
    const weightLabel = weight || defaultWeight;

    // 3. Determine unit price: variant > weight-specific > base price
    const basePrice = typeof product.price === 'number' && product.price > 0 ? product.price : 0;
    let price = 0;
    if (variant && typeof variant.price === 'number' && variant.price > 0) {
      price = variant.price;
    } else if (weightLabel && product.weightPrices && typeof product.weightPrices[weightLabel] === 'number' && product.weightPrices[weightLabel] > 0) {
      price = product.weightPrices[weightLabel];
    } else if (basePrice > 0) {
      price = basePrice;
    } else if (product.weightPrices && typeof product.weightPrices[defaultWeight] === 'number' && product.weightPrices[defaultWeight] > 0) {
      price = product.weightPrices[defaultWeight];
    } else {
      price = 0;
    }

    const originalPrice = (variant && typeof variant.originalPrice === 'number' && variant.originalPrice > price)
      ? variant.originalPrice
      : (typeof product.originalPrice === 'number' && product.originalPrice > price ? product.originalPrice : 0);

    const displayLabel = variant ? variant.name : weightLabel;
    const cartId = `${product.id || product.slug}-${variant?.id || variant?.name || weightLabel}${specialInstructions ? '-' + specialInstructions.slice(0, 10) : ''}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + qty, specialInstructions: specialInstructions || item.specialInstructions }
            : item
        );
      }
      return [
        ...prev,
        {
          cartId,
          productId: product.id || product.slug,
          slug: product.slug || product.id,
          name: product.name,
          urduName: product.urduName || '',
          price,
          originalPrice,
          image: product.image || (product.images && product.images[0]) || '',
          selectedWeight: displayLabel,
          selectedVariant: variant ? variant.name : '',
          unit: getProductUnit(product),
          quantity: qty,
          specialInstructions: specialInstructions || '',
          moq
        }
      ];
    });

    showToast(`Added ${qty}x ${product.name} to cart!`);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toastMessage,
        showToast,
        freeShippingThreshold,
        amountNeededForFreeShipping
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] bg-[#000000] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center space-x-3 text-sm font-medium animate-bounce">
          <span className="text-lg">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
