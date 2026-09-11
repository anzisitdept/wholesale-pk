'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Share2, MessageCircle, Check, BadgeCheck } from 'lucide-react';
import { Product, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import CustomerReviewsSection from '@/components/reviews/CustomerReviewsSection';
import { subscribeProductReviews } from '@/lib/firestoreServices';

import { getProductEffectivePrice } from '@/lib/productPrice';
import { getJewelryMetaLabel, getJewelrySpecRows, getTrustBadges } from '@/lib/productMeta';

type TabKey = 'description' | 'highlights' | 'specifications' | 'ingredients' | 'benefits';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const [productReviews, setProductReviews] = useState<Review[]>([]);

  useEffect(() => {
    const unsub = subscribeProductReviews(product.id, (rs) => setProductReviews(rs));
    return () => { if (unsub) unsub(); };
  }, [product.id]);

  // Universal variants (sizes / colors / packs / models) take priority.
  const variants = (product.variants && Array.isArray(product.variants) && product.variants.length > 0)
    ? product.variants
    : [];
  const hasVariants = variants.length > 0;

  const defaultVariantId = (variants.find(v => v.inStock !== false) || variants[0])?.id;
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariantId);
  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

  const moq = product.moq && product.moq > 0 ? product.moq : 1;
  const [quantity, setQuantity] = useState(moq);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  // Price from selected variant, otherwise base price
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : getProductEffectivePrice(product);

  const originalPrice = (selectedVariant && typeof selectedVariant.originalPrice === 'number' && selectedVariant.originalPrice > currentPrice)
    ? selectedVariant.originalPrice
    : (typeof product.originalPrice === 'number' && product.originalPrice > currentPrice ? product.originalPrice : 0);

  const subtotal = currentPrice * quantity;

  const initialImg = (product.image && product.image.trim() !== '')
    ? product.image
    : (product.images && product.images[0] && product.images[0].trim() !== '' ? product.images[0] : '');
  const [selectedImage, setSelectedImage] = useState(initialImg);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    const nextVariantId = (variants.find(v => v.inStock !== false) || variants[0])?.id;
    setSelectedVariantId(nextVariantId);
    setQuantity(product.moq && product.moq > 0 ? product.moq : 1);
    setSpecialInstructions('');
    const img = (product.image && product.image.trim() !== '')
      ? product.image
      : (product.images && product.images[0] && product.images[0].trim() !== '' ? product.images[0] : '');
    setSelectedImage(img);
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const optionLabel = selectedVariant ? selectedVariant.name : '';
  const isOutOfStock = product.inStock === false || selectedVariant?.inStock === false;

  const handleAddToCart = () => {
    if (product.inStock === false || selectedVariant?.inStock === false) {
      alert('This product is currently out of stock.');
      return;
    }
    if (hasVariants) {
      addToCart(product, selectedVariant, quantity, specialInstructions);
    } else {
      addToCart(product, undefined, quantity, specialInstructions);
    }
  };

  const handleBuyNow = () => {
    if (product.inStock === false || selectedVariant?.inStock === false) {
      alert('This product is currently out of stock.');
      return;
    }
    if (hasVariants) {
      addToCart(product, selectedVariant, quantity, specialInstructions);
    } else {
      addToCart(product, undefined, quantity, specialInstructions);
    }
    setIsCheckoutOpen(true);
  };

  const handleBargainClick = () => {
    const message = encodeURIComponent(`Hi! I am looking for a discount on ${product.name}${optionLabel ? ` (${optionLabel})` : ''}.`);
    window.open(`https://wa.me/923100005480?text=${message}`, '_blank');
  };

  const hasHighlights = Array.isArray(product.highlights) && product.highlights.length > 0;
  const jewelrySpecRows = getJewelrySpecRows(product);
  const hasSpecs = (Array.isArray(product.specifications) && product.specifications.length > 0) || jewelrySpecRows.length > 0;

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#222' }}>

      {/* Main Grid: Left Gallery | Right Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start px-4 md:px-0">

        {/* Left Column: Gallery */}
        <div>
          <div style={{ position: 'relative', width: '100%', minHeight: '300px', borderRadius: '4px', overflow: 'hidden', background: '#f9f9f9', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedImage && selectedImage.trim() !== '' ? (
              <img
                src={selectedImage}
                alt={product.name || 'Product'}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ color: '#aaa', fontSize: '14px', fontWeight: 500, padding: '40px' }}>
                No Image Available
              </div>
            )}
            {/* Badges */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
              {isOutOfStock && (
                <span style={{ background: '#000000', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '2px' }}>
                  OUT OF STOCK
                </span>
              )}
              {product.discountBadge && (
                <span style={{ background: '#000000', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '2px' }}>
                  {product.discountBadge}
                </span>
              )}
              {product.isBestSeller && (
                <span style={{ background: '#000000', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '2px' }}>
                  Best Selling
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {(() => {
            const validImages = (product.images || []).filter(img => typeof img === 'string' && img.trim() !== '');
            if (validImages.length <= 1) return null;

            return (
              <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95 transition flex-shrink-0 cursor-pointer shadow-2xs"
                  onClick={() => {
                    const idx = validImages.indexOf(selectedImage);
                    if (idx > 0) setSelectedImage(validImages[idx - 1]);
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex gap-2.5 overflow-x-auto">
                  {validImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden p-0 cursor-pointer bg-white transition-all duration-200 flex-shrink-0 ${
                        selectedImage === img ? 'ring-2 ring-[#000000] shadow-xs' : 'border border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95 transition flex-shrink-0 cursor-pointer shadow-2xs"
                  onClick={() => {
                    const idx = validImages.indexOf(selectedImage);
                    if (idx < validImages.length - 1) setSelectedImage(validImages[idx + 1]);
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            );
          })()}
        </div>

        {/* Right Column: Information & Controls */}
        <div className="w-full md:pl-4 lg:pl-6">

          {/* Brand, SKU & Unit Header */}
          <div className="mb-1.5">
            {product.brand && (
              <span className="font-semibold text-gray-500 uppercase text-xs mr-2">{product.brand}</span>
            )}
            {product.sku && (
              <span className="text-[10px] text-gray-400 font-medium">SKU: {product.sku}</span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 700, color: '#111', lineHeight: 1.3, marginBottom: '8px' }}>
            {product.name}
          </h1>

          {/* Rating & Urgency */}
          <div
            onClick={() => {
              const el = document.getElementById('customer-reviews-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', marginBottom: '6px', cursor: 'pointer' }}
          >
            {productReviews.length > 0 ? (
              <>
                <span style={{ color: '#000000', fontSize: '15px' }}>
                  {'★'.repeat(Math.round(productReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / productReviews.length))}
                  {'☆'.repeat(5 - Math.round(productReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / productReviews.length))}
                </span>
                <span style={{ fontWeight: 600, color: '#333' }}>
                  ({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </>
            ) : (
              <>
                <span style={{ color: '#d1d5db', fontSize: '15px' }}>☆☆☆☆☆</span>
                <span style={{ fontWeight: 500, color: '#666', textDecoration: 'underline' }}>
                  (Be the first to review)
                </span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#000000', fontWeight: 600, marginBottom: '14px' }}>
            <span>🔥</span> In High Demand
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginBottom: '14px' }}>
            Category: <span style={{ color: '#333', fontWeight: 500 }}>{product.categoryName || 'General'}</span>
            {product.subCategoryName && (
              <> · <span style={{ color: '#333', fontWeight: 500 }}>{product.subCategoryName}</span></>
            )}
          </p>

          {/* Jewelry Metadata: 22K Gold · Diamond · 5.5 g */}
          {(() => {
            const jewelryLabel = getJewelryMetaLabel(product);
            return jewelryLabel ? (
              <p style={{ fontSize: '13px', color: '#a9822b', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.02em' }}>
                {jewelryLabel}
              </p>
            ) : null;
          })()}

          {/* Price Line */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {originalPrice > currentPrice && (
              <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '16px' }}>
                Rs.{originalPrice.toLocaleString()}.00
              </span>
            )}
            <span style={{ color: '#000000', fontSize: '20px', fontWeight: 700 }}>
              Rs.{currentPrice.toLocaleString()}.00
              {product.unit && product.unit.trim() !== '' && (
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#555' }}> / {product.unit}</span>
              )}
            </span>
          </div>

          {/* Wholesale Price Callout */}
          {typeof product.wholesalePrice === 'number' && product.wholesalePrice > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'inline-block', background: '#000000', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '5px 10px', borderRadius: '4px' }}>
                Wholesale Price: Rs. {product.wholesalePrice.toLocaleString()} / unit on bulk orders
              </span>
            </div>
          )}

          {/* MOQ Hint */}
          {product.moq && product.moq > 1 && (
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '14px' }}>
              Minimum Order Quantity: <strong style={{ color: '#333' }}>{product.moq} {product.unit || 'units'}</strong>
            </p>
          )}

          {/* Need a Better Price ~ Chat with Us! Box */}
          <div className="mb-6">
            <p className="font-serif text-base sm:text-lg font-bold text-gray-900 mb-2.5 flex items-center gap-2">
              Need a Better Wholesale Price? Chat with Us! <MessageCircle className="w-5 h-5 text-[#25d366]" />
            </p>
            <button
              onClick={handleBargainClick}
              className="w-full bg-[#25d366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider py-3.5 px-5 rounded-md transition duration-200 shadow-md shadow-green-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>BARGAIN NOW</span>
            </button>
          </div>

          {/* Universal Variant Selector */}
          {hasVariants && (
            <div className="mb-5">
              <p className="text-xs text-gray-600 mb-2">
                Select Option: <strong className="text-gray-900 font-bold">{optionLabel}</strong>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {variants.map(v => {
                  const active = selectedVariant?.id === v.id;
                  const variantOut = v.inStock === false;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        if (variantOut) return;
                        setSelectedVariantId(v.id);
                        setQuantity(q => Math.max(moq, q));
                      }}
                      disabled={variantOut}
                      className={`min-h-[46px] rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 px-4 py-2 active:scale-[0.98] cursor-pointer ${
                        active
                          ? 'bg-gray-100/70 border-2 border-[#000000] text-[#000000] shadow-xs font-bold'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      } ${variantOut ? 'opacity-50 line-through cursor-not-allowed' : ''}`}
                    >
                      <span>{v.name}</span>
                      <span className={`text-[10px] ${active ? 'text-[#000000]' : 'text-gray-500'}`}>
                        Rs. {v.price.toLocaleString()}{variantOut ? ' · Out of stock' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Input */}
          <div className="mb-4 bg-[#f8f9fa] border border-gray-200/80 rounded-2xl p-4 space-y-1.5">
            <label className="block text-xs font-bold text-gray-800 tracking-wide">
              Special Instructions
            </label>
            <textarea
              placeholder="Please enter instructions about this item"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 500))}
              maxLength={500}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#007aff] outline-none resize-none min-h-[85px] transition"
            />
            <div className="text-right text-[10px] text-gray-400 font-medium">
              {specialInstructions.length}/500
            </div>
          </div>

          {/* Action Controls: Quantity, Add to Cart, Wishlist, Share */}
          <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 items-stretch md:items-center mb-3">

            {/* Top controls on mobile (Quantity + Mobile Auxiliary buttons) / Left on desktop */}
            <div className="flex items-center justify-between md:justify-start gap-2.5">
              {/* Quantity Stepper (enforces MOQ) */}
              <div className="flex items-center border border-gray-300 rounded-lg bg-white h-[46px] md:h-[48px] px-1 shadow-2xs">
                <button
                  onClick={() => setQuantity(q => Math.max(moq, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-base text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded transition font-bold cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-9 text-center text-sm font-bold text-gray-900 select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-full flex items-center justify-center text-base text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded transition font-bold cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Mobile-only Share button */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="w-[46px] h-[46px] rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-gray-400 flex items-center justify-center transition active:scale-95 shadow-2xs cursor-pointer"
                  aria-label="Share product"
                  title="Share product"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart Main CTA Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full md:flex-1 h-[48px] px-4 rounded-lg font-bold text-xs md:text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition duration-200 shadow-sm active:scale-[0.99] cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1a1a1a] hover:bg-black text-white shadow-gray-900/10'
              }`}
            >
              {isOutOfStock ? (
                <span>OUT OF STOCK</span>
              ) : (
                <>
                  <span>ADD TO CART</span>
                  {product.moq && product.moq > 1 && (
                    <span className="font-normal text-[11px] opacity-90 tracking-normal">(MOQ {product.moq})</span>
                  )}
                </>
              )}
            </button>

            {/* Desktop/Tablet Share icon */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="w-[48px] h-[48px] rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center transition active:scale-95 shadow-2xs cursor-pointer"
                aria-label="Share product"
                title="Share product"
              >
                <Share2 size={18} />
              </button>
            </div>

          </div>

          {/* Buy It Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`w-full min-h-[48px] sm:min-h-[50px] px-5 py-3.5 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase transition duration-200 shadow-sm active:scale-[0.99] mb-4 flex items-center justify-center gap-2 cursor-pointer ${
              isOutOfStock
                ? 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900'
            }`}
          >
            <span>{isOutOfStock ? 'OUT OF STOCK' : 'BUY IT NOW'}</span>
          </button>

          {/* Trust Badges (BIS Hallmarked / Certified / Certificate Included) */}
          {getTrustBadges(product).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {getTrustBadges(product).map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 border border-gray-200 bg-gray-50 text-gray-700 text-[10px] sm:text-[11px] font-semibold px-2.5 py-1.5 rounded-full"
                >
                  <BadgeCheck size={13} className="text-[#00663a] flex-shrink-0" />
                  {badge}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* RICH DESCRIPTION CONTENT SECTION BELOW PRODUCT DETAILS */}
      <div className="mt-10 md:mt-16 border-t border-gray-200 pt-8 md:pt-10 overflow-x-hidden">

        {/* Content Tabs Header - Single row scrollable on mobile */}
        <div className="flex items-center justify-start gap-1 sm:gap-2 md:gap-4 border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth">
          <button
            onClick={() => setActiveTab('description')}
            className={`whitespace-nowrap flex-shrink-0 pb-3 px-3 sm:px-3.5 md:px-4 font-serif text-sm sm:text-base md:text-lg font-bold border-b-2 transition cursor-pointer -mb-[1px] ${
              activeTab === 'description' ? 'border-[#111] text-[#111]' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Description
          </button>
          {hasHighlights && (
            <button
              onClick={() => setActiveTab('highlights')}
              className={`whitespace-nowrap flex-shrink-0 pb-3 px-3 sm:px-3.5 md:px-4 font-serif text-sm sm:text-base md:text-lg font-bold border-b-2 transition cursor-pointer -mb-[1px] ${
                activeTab === 'highlights' ? 'border-[#111] text-[#111]' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Key Highlights
            </button>
          )}
          {hasSpecs && (
            <button
              onClick={() => setActiveTab('specifications')}
              className={`whitespace-nowrap flex-shrink-0 pb-3 px-3 sm:px-3.5 md:px-4 font-serif text-sm sm:text-base md:text-lg font-bold border-b-2 transition cursor-pointer -mb-[1px] ${
                activeTab === 'specifications' ? 'border-[#111] text-[#111]' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Specifications
            </button>
          )}
          {product.ingredients && (
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`whitespace-nowrap flex-shrink-0 pb-3 px-3 sm:px-3.5 md:px-4 font-serif text-sm sm:text-base md:text-lg font-bold border-b-2 transition cursor-pointer -mb-[1px] ${
                activeTab === 'ingredients' ? 'border-[#111] text-[#111]' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Ingredients
            </button>
          )}
          {product.benefits && (
            <button
              onClick={() => setActiveTab('benefits')}
              className={`whitespace-nowrap flex-shrink-0 pb-3 px-3 sm:px-3.5 md:px-4 font-serif text-sm sm:text-base md:text-lg font-bold border-b-2 transition cursor-pointer -mb-[1px] ${
                activeTab === 'benefits' ? 'border-[#111] text-[#111]' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Benefits
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div style={{ maxWidth: '850px', fontSize: '14px', color: '#333', lineHeight: 1.7 }}>

          {activeTab === 'description' && (
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '14px' }}>
                Buy {product.name} Online in Pakistan
              </h3>
              <p style={{ color: '#555', marginBottom: '20px' }}>
                {product.description || `Explore ${product.name} at the best wholesale prices in Pakistan. For bulk ordering or instant price confirmation, contact our team on WhatsApp.`}
              </p>
            </div>
          )}

          {activeTab === 'highlights' && hasHighlights && (
            <div>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>
                Key Highlights
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0, listStyle: 'none' }}>
                {product.highlights!.map((h, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#22c55e', fontSize: '16px', lineHeight: 1.4 }}><Check size={16} strokeWidth={3} /></span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && hasSpecs && (
            <div>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>
                Specifications
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {jewelrySpecRows.map((row, i) => (
                      <tr key={`jewelry-${row.key}`} className={i % 2 === 0 ? "bg-amber-50/60" : "bg-white"}>
                        <td className="px-4 py-2.5 font-semibold text-gray-600 w-1/3 border-b">{row.key}</td>
                        <td className="px-4 py-2.5 text-gray-900 border-b">{row.value}</td>
                      </tr>
                    ))}
                    {product.specifications!.map((spec, i) => (
                      <tr key={`spec-${i}`} className={(i + jewelrySpecRows.length) % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-2.5 font-semibold text-gray-600 w-1/3 border-b">{spec.key}</td>
                        <td className="px-4 py-2.5 text-gray-900 border-b">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>
                Pure & Natural Ingredients
              </h4>
              <p style={{ color: '#555', marginBottom: '20px' }}>
                {product.ingredients}
              </p>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>
                Key Benefits
              </h4>
              <p style={{ color: '#555', marginBottom: '20px' }}>
                {product.benefits}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Customer Reviews Section */}
      <div id="customer-reviews-section" className="mt-10 md:mt-16 border-t border-gray-200 pt-8 md:pt-10">
        <CustomerReviewsSection />
      </div>

      {/* Sticky Purchase Bar at Bottom (Desktop & Tablet) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 md:p-3 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] hidden md:flex justify-between items-center">
          <div className="flex items-center gap-3">
            {selectedImage && (
              <img src={selectedImage} alt={product.name} className="w-10 h-10 object-cover rounded border border-gray-200" />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900 m-0 max-w-md truncate">{product.name}</p>
              <p className="text-[11px] m-0">
                {originalPrice > currentPrice && (
                  <span className="line-through text-gray-400 mr-1.5">Rs.{originalPrice.toLocaleString()}</span>
                )}
                <span className="text-[#000000] font-bold">Rs.{currentPrice.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasVariants && variants.length > 0 && (
              <select
                value={selectedVariant?.id || ''}
                onChange={e => setSelectedVariantId(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-2 text-xs bg-white font-medium cursor-pointer focus:outline-none focus:border-[#000000]"
              >
                {variants.map(v => <option key={v.id} value={v.id} disabled={v.inStock === false}>{v.name} - Rs.{v.price.toLocaleString()}</option>)}
              </select>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="bg-[#1a1a1a] hover:bg-black text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition cursor-pointer active:scale-95 shadow-xs"
            >
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="bg-[#000000] hover:bg-[#333333] text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition cursor-pointer active:scale-95 shadow-xs"
            >
              BUY NOW
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Add to Cart Bar */}
      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-900 m-0 truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#000000] font-extrabold">Rs.{currentPrice.toLocaleString()}</span>
                {hasVariants && optionLabel && (
                  <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium">{optionLabel}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="bg-[#1a1a1a] active:bg-black text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition flex-shrink-0 shadow-sm cursor-pointer"
              >
                {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}