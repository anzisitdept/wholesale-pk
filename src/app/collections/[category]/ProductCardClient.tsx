'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, getProductEffectiveOriginalPrice } from '@/lib/productPrice';

export default function ProductCardClient({ product }: { product: Product }) {
  const { openQuickView } = useCart();

  const primaryImg = (product.image && product.image.trim() !== '')
    ? product.image
    : ((product.images && product.images[0] && product.images[0].trim() !== '') ? product.images[0] : '');

  const displayPrice = getProductEffectivePrice(product);
  const originalPrice = getProductEffectiveOriginalPrice(product, displayPrice);
  const hasDiscount = originalPrice > displayPrice;

  const subtitleText =
    product.shortDescription ||
    product.ingredients ||
    product.description ||
    '';

  return (
    <div
      onClick={() => openQuickView(product)}
      className="w-full bg-[#ffffff] border border-[#ece7e6] hover:border-[#6f0c07]/60 rounded-3xl transition-all duration-300 flex items-stretch justify-between relative group shadow-md hover:shadow-2xl hover:shadow-black/70 cursor-pointer overflow-hidden min-h-[120px] sm:min-h-[135px]"
    >
      {/* Badges */}
      {product.discountBadge && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-[#d63026] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs font-display tracking-tight pointer-events-none">
          {product.discountBadge}
        </div>
      )}

      {/* Left Column: Title, Subtitle/Ingredients, Price Badge */}
      <div className="flex-1 min-w-0 flex flex-col justify-between p-3.5 sm:p-4 pr-2">
        <div className={product.discountBadge ? "pt-3.5" : ""}>
          <h3 className="text-sm sm:text-base font-extrabold text-[#1a1a1a] group-hover:text-[#6f0c07] transition-colors leading-snug line-clamp-3 font-display">
            {product.name}
          </h3>
          {subtitleText && (
            <p className="text-[11px] sm:text-xs text-gray-600 font-medium line-clamp-2 mt-1 mb-2 leading-relaxed font-body">
              {subtitleText}
            </p>
          )}
        </div>

        {/* Price Pill Badge */}
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-[#6f0c07] group-hover:bg-[#580a06] text-white text-xs sm:text-sm font-extrabold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl shadow-xs transition-colors font-display tracking-tight inline-flex items-center">
            Rs. {displayPrice.toLocaleString()}
          </div>
          {hasDiscount && (
            <span className="text-[11px] text-gray-500 line-through font-medium">
              Rs. {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Image Thumbnail & Floating Action Button */}
      <div className="relative w-28 sm:w-36 flex-shrink-0 self-stretch overflow-hidden">
        {primaryImg ? (
          <img
            src={primaryImg}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#fafafa] text-gray-600 text-[10px]">
            No Image
          </div>
        )}

        {/* Floating Circle '+' Add Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openQuickView(product);
          }}
          className="absolute bottom-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6f0c07] hover:bg-[#580a06] active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform duration-200 cursor-pointer"
          aria-label="Quick View product"
        >
          <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
}