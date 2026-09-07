export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  urduName?: string;
  description?: string;
  image?: string;
  itemCount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;             // e.g. "Large", "Red", "128GB", "Pack of 12", "500g"
  price: number;            // Variant price in PKR
  originalPrice?: number;
  sku?: string;
  inStock?: boolean;
}

export interface ProductSpecification {
  key: string;              // e.g. "Material", "Brand", "Warranty", "Origin", "Dimensions"
  value: string;            // e.g. "Stainless Steel", "Samsung", "1 Year", "Pakistan"
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  urduName?: string;
  category: string;
  categoryName: string;
  subCategory?: string;
  subCategoryName?: string;
  // Wholesale & Inventory
  brand?: string;
  sku?: string;
  unit?: string;            // e.g. "Piece", "Box", "Pack of 12", "Carton", "Dozen", "Kg"
  moq?: number;             // Minimum Order Quantity (default 1)
  stockQuantity?: number;
  // Pricing
  price: number;
  originalPrice?: number;
  wholesalePrice?: number;  // Special rate for bulk buyers
  discountBadge?: string;
  // Flags & Status
  isBestSeller?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  showInAllProducts?: boolean;
  // Images
  image: string;
  hoverImage?: string;
  images: string[];
  // Universal Variants & Content
  variants?: ProductVariant[];
  description: string;
  highlights?: string[];                   // Bullet points
  specifications?: ProductSpecification[]; // Key-value attributes
  // Legacy fields (optional fallback)
  weights?: string[];
  weightPrices?: Record<string, number>;
  ingredients?: string;
  benefits?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  urduName?: string;
  description?: string;
  image?: string;
  itemCount?: number;
  subcategories?: SubCategory[];
}

// Keep Collection as an alias to Category for backward compatibility
export type Collection = Category;

export interface CartItem {
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

export interface NavigationItem {
  label: string;
  href: string;
}

export interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  inStockOnly?: boolean;
}

// ─────────────────────────────────────────────
// Admin Sync Types
// ─────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  name: string;
  selectedWeight: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderId: string;
  createdAt: any;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: OrderStatus;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  reviewId?: string;
  productId?: string;
  author: string;
  location?: string;
  rating: number;
  date?: string;
  comment?: string;
  verified?: boolean;
  productSlug?: string;
  productName?: string;
  title?: string;
  body?: string;
  isVerified?: boolean;
  status?: ReviewStatus;
  createdAt?: any;
}

export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  alt: string;
  link?: string;
}

export interface Banner {
  id: string;
  image: string;
  link: string;
  alt: string;
}

export interface ReelItem {
  id: number;
  videoUrl: string;
  title: string;
  productSlug: string;
}

export interface ShopByCategorySection {
  title: string;
  categoryIds: string[]; // Ordered list of category IDs or slugs
}

export interface ProductCuratedSection {
  title: string;
  productIds: string[]; // Ordered list of product IDs or slugs
}

export interface StoreContent {
  topBarMessages: string[];
  heroSlides: HeroSlide[];
  shopByCategory: ShopByCategorySection;
  bestSellers: ProductCuratedSection;
  newArrivals: ProductCuratedSection;
  midBanners: Banner[];
  bundleOffers: ProductCuratedSection;
  specialItems: ProductCuratedSection;
  reels?: ReelItem[];
}
