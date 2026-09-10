'use client';

import React, { useState, useEffect } from 'react';
import { X, Share2, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice } from '@/lib/productPrice';

interface ProductQuickViewModalProps {
  product?: Product | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ProductQuickViewModal({
  product: propProduct,
  isOpen: propIsOpen,
  onClose: propOnClose,
}: ProductQuickViewModalProps) {
  const { quickViewProduct, closeQuickView, addToCart, showToast } = useCart();

  const product = propProduct !== undefined ? propProduct : quickViewProduct;
  const isOpen = propIsOpen !== undefined ? propIsOpen : Boolean(quickViewProduct);
  const handleClose = propOnClose || closeQuickView;

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(product.moq && product.moq > 0 ? product.moq : 1);
      setSpecialInstructions('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const displayPrice = getProductEffectivePrice(product);
  const subtotal = displayPrice * quantity;
  const moq = product.moq && product.moq > 0 ? product.moq : 1;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, undefined, quantity, specialInstructions);
    handleClose();
  };

  const primaryImg =
    (product.image && product.image.trim() !== '')
      ? product.image
      : (product.images && product.images[0] ? product.images[0] : '/Wholesaler Logo.png');

  const subtitleText =
    product.shortDescription ||
    product.ingredients ||
    product.description ||
    '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-sans text-gray-100">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Main Card Container */}
      <div className="relative w-full max-w-[420px] bg-[#1a1c22] border border-[#262932] rounded-[28px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner Image */}
        <div className="relative w-full h-60 sm:h-64 bg-[#141415] flex-shrink-0 overflow-hidden">
          <img
            src={primaryImg}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c22] via-black/40 to-transparent" />

          {/* Top Right Action Buttons */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-[#007aff] hover:bg-[#0066d9] text-white flex items-center justify-center shadow-lg transition cursor-pointer"
              aria-label="Share product"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-[#007aff] hover:bg-[#0066d9] text-white flex items-center justify-center shadow-lg transition cursor-pointer"
              aria-label="Close product modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Overlaid Title & Description at Bottom Left of Image */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-sm font-display text-white">
              {product.name}
            </h2>
            {subtitleText && (
              <p className="text-xs text-gray-300/90 font-medium line-clamp-2 mt-1 leading-relaxed">
                {subtitleText}
              </p>
            )}
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Price Header */}
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[#007aff] tracking-tight font-display">
              Rs. {displayPrice.toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > displayPrice && (
              <span className="text-sm text-gray-500 line-through font-semibold">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Special Instructions Field */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-gray-200 tracking-wide">
              Special Instructions
            </label>
            <textarea
              placeholder="Please enter instructions about this item"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 500))}
              maxLength={500}
              className="w-full bg-[#141415] border border-[#2b2f3a] rounded-2xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#007aff] focus:border-[#007aff] focus:bg-[#17181b] outline-none resize-none min-h-[90px] transition"
            />
            <div className="text-right text-[10px] text-gray-500 font-medium">
              {specialInstructions.length}/500
            </div>
          </div>

        </div>

        {/* Bottom Sticky Action Footer Bar */}
        <div className="border-t border-[#262932] p-4 bg-[#17191e] flex items-center gap-3 flex-shrink-0">
          
          {/* Quantity Counter Pill */}
          <div className="bg-[#22262e] rounded-2xl p-1 flex items-center gap-2 select-none flex-shrink-0">
            <button
              onClick={() => setQuantity(prev => Math.max(moq, prev - 1))}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 flex items-center justify-center shadow-2xs transition cursor-pointer"
            >
              {quantity <= 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
            </button>
            <span className="font-extrabold text-sm text-white px-1 font-display min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-8 h-8 rounded-full bg-[#007aff] hover:bg-[#0066d9] text-white flex items-center justify-center shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Action Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#007aff] hover:bg-[#0066d9] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-lg transition cursor-pointer"
          >
            <span>Rs. {subtotal.toLocaleString()}</span>
            <div className="flex items-center gap-1.5">
              <span>Add to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

        </div>

      </div>
    </div>
  );
}