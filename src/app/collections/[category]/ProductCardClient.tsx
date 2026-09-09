'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getProductEffectivePrice, getProductEffectiveOriginalPrice, getProductDisplayWeight } from '@/lib/productPrice';

export default function ProductCardClient({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const primaryImg = (product.image && product.image.trim() !== '') 
    ? product.image 
    : ((product.images && product.images[0] && product.images[0].trim() !== '') ? product.images[0] : '');
  const hoverImg = (product.hoverImage && product.hoverImage.trim() !== '') ? product.hoverImage : primaryImg;

  const displayPrice = getProductEffectivePrice(product);
  const originalPrice = getProductEffectiveOriginalPrice(product, displayPrice);
  const displayWeight = getProductDisplayWeight(product);
  const hasDiscount = originalPrice > displayPrice;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-[#1a1c22] group border border-[#262932] rounded-2xl overflow-hidden hover:border-[#383d4a] hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 flex flex-col justify-between relative h-full"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-20 flex flex-col items-start gap-1 pointer-events-none">
        {product.discountBadge && (
          <div className="bg-[#ff5722] text-white text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs font-display tracking-tight">
            {product.discountBadge}
          </div>
        )}
        {product.isBestSeller && (
          <div className="bg-[#ff9800] text-white text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs font-display tracking-tight">
            Best Selling
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label="Toggle wishlist"
        className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
          isWishlisted
            ? 'bg-[#ff5722] text-white shadow-md'
            : 'bg-black/40 text-gray-300 hover:text-white hover:bg-black/60'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : ''}`} />
      </button>

      {/* Image Container with crossfade */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#20232a] block">
        {primaryImg ? (
          <>
            <img
              src={primaryImg}
              alt={product.name || 'Product Image'}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0 z-10"
            />
            <img
              src={hoverImg}
              alt={`${product.name || 'Product'} Alternate`}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-0"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
      </Link>

      {/* Quick Add Button */}
      <div className="p-2 md:p-2.5 bg-[#17191e] border-t border-[#232630]">
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="w-full bg-[#007aff] hover:bg-[#0069d9] active:scale-[0.98] text-white font-extrabold text-[10px] md:text-xs uppercase tracking-wider py-2 md:py-2.5 rounded-xl flex items-center justify-center space-x-1.5 md:space-x-2 transition font-display shadow-xs cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>QUICK ADD</span>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3 md:p-4 text-center flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="text-[11px] md:text-xs font-bold text-gray-100 hover:text-[#007aff] transition-colors leading-relaxed line-clamp-2 block mb-1 font-body"
          >
            {product.name}
          </Link>
          {product.urduName && (
            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium mb-2">{product.urduName}</p>
          )}
        </div>

        <div>
          <div className="flex justify-center items-center space-x-1 text-yellow-400 text-[10px] md:text-xs mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400" />
            ))}
            <span className="text-[9px] md:text-[10px] text-gray-400 ml-1">({product.reviewsCount || 100})</span>
          </div>

          <div className="flex justify-center items-center space-x-1.5 text-[10px] md:text-xs flex-wrap">
            {hasDiscount && (
              <span className="text-gray-400 line-through">Rs. {originalPrice.toLocaleString()}</span>
            )}
            {product.weights && product.weights.length > 1 && (
              <span className="text-gray-400 text-[10px] md:text-[11px] font-medium">{displayWeight}:</span>
            )}
            <span className="text-white font-black text-xs md:text-sm font-display tracking-tight">
              Rs. {displayPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
