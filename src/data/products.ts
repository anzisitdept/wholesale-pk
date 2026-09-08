import type { Product, ProductVariant, ProductSpecification } from '@/types';

export type { Product, ProductVariant, ProductSpecification };

export const PRODUCTS: Product[] = [
  {
    "id": "premium-cotton-t-shirt",
    "slug": "premium-cotton-t-shirt",
    "name": "Premium Cotton T-Shirt (Size M)",
    "urduName": "پریمیم کاٹن ٹی شرٹ",
    "category": "apparel",
    "categoryName": "Apparel",
    "originalPrice": 1299,
    "price": 899,
    "discountBadge": "-31%",
    "isBestSeller": true,
    "isNew": false,
    "image": "https://nisarachar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg",
    "hoverImage": "https://nisarachar.com/cdn/shop/files/1_f5d5b353-617f-4ca6-ae85-3da84d1e4f8e_533x.jpg",
    "images": [
      "https://nisarachar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg",
      "https://nisarachar.com/cdn/shop/files/1_f5d5b353-617f-4ca6-ae85-3da84d1e4f8e_533x.jpg"
    ],
    "weights": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "weightPrices": {
      "S": 899,
      "M": 899,
      "L": 899,
      "XL": 949
    },
    "description": "Soft, breathable 100% cotton t-shirt in a classic everyday fit. Durable stitching and comfortable feel for all-day wear.",
    "benefits": "Comfortable everyday wear, machine washable, fade-resistant color.",
    "rating": 4.9,
    "reviewsCount": 142
  },
  {
    "id": "wireless-buds-pro",
    "slug": "wireless-buds-pro",
    "name": "Wireless Earbuds Pro",
    "urduName": "وائرلیس ایئربڈز پرو",
    "category": "electronics",
    "categoryName": "Electronics",
    "originalPrice": 4999,
    "price": 3299,
    "discountBadge": "-34%",
    "isBestSeller": true,
    "isNew": true,
    "image": "https://nisarachar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg",
    "hoverImage": "https://nisachar.com/cdn/shop/files/2_2_533x.jpg",
    "images": [
      "https://nisarachar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg",
      "https://nisachar.com/cdn/shop/files/2_2_533x.jpg"
    ],
    "weights": [
      "Standard",
      "Pro"
    ],
    "weightPrices": {
      "Standard": 3299,
      "Pro": 3999
    },
    "description": "True wireless earbuds with crystal-clear sound, deep bass, and long battery life. Includes charging case and touch controls.",
    "benefits": "Long battery life, comfortable fit, clear calls, easy Bluetooth pairing.",
    "rating": 4.8,
    "reviewsCount": 98
  },
  {
    "id": "modern-wall-clock",
    "slug": "modern-wall-clock",
    "name": "Modern Minimalist Wall Clock",
    "urduName": "ماڈرن وال کلاک",
    "category": "home-living",
    "categoryName": "Home & Living",
    "originalPrice": 1899,
    "price": 1299,
    "discountBadge": "-32%",
    "isBestSeller": true,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/3_2_533x.jpg",
    "images": [
      "https://nisacharar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg",
      "https://nisacharar.com/cdn/shop/files/3_2_533x.jpg"
    ],
    "weights": [
      "12 inch",
      "16 inch"
    ],
    "weightPrices": {
      "12 inch": 1299,
      "16 inch": 1599
    },
    "description": "Sleek minimalist wall clock that complements any modern living space. Quiet sweep movement and easy to mount.",
    "benefits": "Quiet operation, durable build, easy wall mounting.",
    "rating": 4.9,
    "reviewsCount": 210
  },
  {
    "id": "nonstick-cookware-set",
    "slug": "nonstick-cookware-set",
    "name": "Non-Stick Cookware Set",
    "urduName": "نان اسٹک کک ویئر سیٹ",
    "category": "home-living",
    "categoryName": "Home & Living",
    "originalPrice": 5999,
    "price": 3899,
    "discountBadge": "-35%",
    "isBestSeller": true,
    "isNew": true,
    "image": "https://nisacharar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/6_1_533x.png",
    "images": [
      "https://nisacharar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg",
      "https://nisacharar.com/cdn/shop/files/6_1_533x.png"
    ],
    "weights": [
      "3-Piece",
      "5-Piece"
    ],
    "weightPrices": {
      "3-Piece": 3899,
      "5-Piece": 5499
    },
    "description": "Durable non-stick cookware set perfect for everyday cooking. Scratch-resistant coating and heat-safe handles.",
    "benefits": "Easy to clean, even heat distribution, long-lasting non-stick surface.",
    "rating": 5,
    "reviewsCount": 84
  },
  {
    "id": "weekend-backpack",
    "slug": "weekend-backpack",
    "name": "Waterproof Travel Backpack",
    "urduName": "واٹر پروف ٹریول بیک پیک",
    "category": "apparel",
    "categoryName": "Apparel",
    "originalPrice": 2999,
    "price": 1999,
    "discountBadge": "-33%",
    "isBestSeller": false,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/02_00c0b731-9c48-4d3a-bf59-0ad7b9a3cfbe_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/4_62c1f1de-4c19-42a3-b8d3-a61d995b48fb_900x.png",
    "images": [
      "https://nisacharar.com/cdn/shop/files/02_00c0b731-9c48-4d3a-bf59-0ad7b9a3cfbe_533x.jpg",
      "https://nisacharar.com/cdn/shop/files/4_62c1f1de-4c19-42a3-b8d3-a61d995b48fb_900x.png"
    ],
    "weights": [
      "20L",
      "30L"
    ],
    "weightPrices": {
      "20L": 1999,
      "30L": 2499
    },
    "description": "Lightweight, waterproof backpack with padded laptop sleeve and multiple compartments for organized storage.",
    "benefits": "Water-resistant, comfortable straps, spacious and well-organized.",
    "rating": 4.7,
    "reviewsCount": 56
  },
  {
    "id": "smart-watch-series",
    "slug": "smart-watch-series",
    "name": "Smart Watch Series X",
    "urduName": "سمارٹ واچ سیریز ایکس",
    "category": "electronics",
    "categoryName": "Electronics",
    "originalPrice": 7999,
    "price": 4999,
    "discountBadge": "-37%",
    "isBestSeller": true,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/1_f5d5b353-617f-4ca6-ae85-3da84d1e4f8e_533x.jpg",
    "images": [
      "https://nisacharar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg"
    ],
    "weights": [
      "Standard",
      "Pro"
    ],
    "weightPrices": {
      "Standard": 4999,
      "Pro": 5999
    },
    "description": "Feature-packed smart watch with fitness tracking, heart-rate monitor, notifications, and up to 7 days battery life.",
    "benefits": "Tracks health and fitness, stay connected, water resistant.",
    "rating": 4.9,
    "reviewsCount": 312
  },
  {
    "id": "portable-blender",
    "slug": "portable-blender",
    "name": "Portable USB Blender Bottle",
    "urduName": "پورٹیبل یو ایس بی بلینڈر",
    "category": "home-living",
    "categoryName": "Home & Living",
    "originalPrice": 2499,
    "price": 1699,
    "discountBadge": "-32%",
    "isBestSeller": true,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/3_2_533x.jpg",
    "images": [
      "https://nisacharar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg"
    ],
    "weights": [
      "400ml",
      "600ml"
    ],
    "weightPrices": {
      "400ml": 1699,
      "600ml": 1999
    },
    "description": "Compact rechargeable blender bottle for shakes and smoothies on the go. USB-C charging and easy to clean.",
    "benefits": "Portable, rechargeable, quick blend, easy to carry.",
    "rating": 4.9,
    "reviewsCount": 175
  },
  {
    "id": "cotton-bed-sheet-set",
    "slug": "cotton-bed-sheet-set",
    "name": "Premium Cotton Bed Sheet Set",
    "urduName": "پریمیم بیڈ شیٹ سیٹ",
    "category": "home-living",
    "categoryName": "Home & Living",
    "originalPrice": 3499,
    "price": 2299,
    "discountBadge": "-34%",
    "isBestSeller": true,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/2_2_533x.jpg",
    "images": [
      "https://nisacharar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg"
    ],
    "weights": [
      "Single",
      "Double",
      "Queen"
    ],
    "weightPrices": {
      "Single": 2299,
      "Double": 2799,
      "Queen": 3299
    },
    "description": "Soft, breathable 100% cotton bed sheet set with pillow covers. Fade-resistant and gentle on skin.",
    "benefits": "Soft and breathable, easy to wash, durable colors.",
    "rating": 4.8,
    "reviewsCount": 160
  },
  {
    "id": "winter-jacket",
    "slug": "winter-jacket",
    "name": "Warm Winter Jacket (Men)",
    "urduName": "ونٹر جیکٹ",
    "category": "apparel",
    "categoryName": "Apparel",
    "originalPrice": 4499,
    "price": 2999,
    "discountBadge": "-33%",
    "isBestSeller": true,
    "isNew": true,
    "image": "https://nisacharar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/6_1_533x.png",
    "images": [
      "https://nisacharar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg"
    ],
    "weights": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "weightPrices": {
      "M": 2999,
      "L": 2999,
      "XL": 3199,
      "XXL": 3399
    },
    "description": "Insulated winter jacket designed to keep you warm in cold weather with a stylish, modern fit.",
    "benefits": "Super warm, wind-resistant, durable zippers.",
    "rating": 5,
    "reviewsCount": 205
  },
  {
    "id": "led-desk-lamp",
    "slug": "led-desk-lamp",
    "name": "Adjustable LED Desk Lamp",
    "urduName": "ایل ای ڈی ڈیسک لیمپ",
    "category": "electronics",
    "categoryName": "Electronics",
    "originalPrice": 1999,
    "price": 1299,
    "discountBadge": "-35%",
    "isBestSeller": false,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/02_00c0b731-9c48-4d3a-bf59-0ad7b9a3cfbe_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/4_62c1f1de-4c19-42a3-b8d3-a61d995b48fb_900x.png",
    "images": [
      "https://nisacharar.com/cdn/shop/files/02_00c0b731-9c48-4d3a-bf59-0ad7b9a3cfbe_533x.jpg"
    ],
    "weights": [
      "Classic",
      "USB-C"
    ],
    "weightPrices": {
      "Classic": 1299,
      "USB-C": 1499
    },
    "description": "Energy-efficient LED desk lamp with adjustable brightness and flexible neck for perfect task lighting.",
    "benefits": "Energy efficient, adjustable light, eye-friendly.",
    "rating": 4.8,
    "reviewsCount": 78
  },
  {
    "id": "skincare-kit",
    "slug": "skincare-kit",
    "name": "Daily Skincare Essentials Kit",
    "urduName": "ڈیلی اسکن کیئر کٹ",
    "category": "beauty-care",
    "categoryName": "Beauty & Care",
    "originalPrice": 2499,
    "price": 1699,
    "discountBadge": "-32%",
    "isBestSeller": false,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/3_2_533x.jpg",
    "images": [
      "https://nisacharar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg"
    ],
    "weights": [
      "Basic",
      "Deluxe"
    ],
    "weightPrices": {
      "Basic": 1699,
      "Deluxe": 2199
    },
    "description": "Complete daily skincare kit with cleanser, moisturizer, and sun protection for healthy, glowing skin.",
    "benefits": "Hydrates and nourishes, suitable for all skin types.",
    "rating": 4.6,
    "reviewsCount": 45
  },
  {
    "id": "classic-sneakers",
    "slug": "classic-sneakers",
    "name": "Classic Everyday Sneakers",
    "urduName": "کلاسک سنیکرز",
    "category": "apparel",
    "categoryName": "Apparel",
    "originalPrice": 3999,
    "price": 2699,
    "discountBadge": "-33%",
    "isBestSeller": true,
    "isNew": true,
    "image": "https://nisacharar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/1_f5d5b353-617f-4ca6-ae85-3da84d1e4f8e_533x.jpg",
    "images": [
      "https://nisacharar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg"
    ],
    "weights": [
      "40",
      "41",
      "42",
      "43"
    ],
    "weightPrices": {
      "40": 2699,
      "41": 2699,
      "42": 2799,
      "43": 2799
    },
    "description": "Comfortable, stylish sneakers ideal for daily wear. Padded sole and breathable upper for all-day comfort.",
    "benefits": "Comfortable fit, durable sole, breathable material.",
    "rating": 4.9,
    "reviewsCount": 189
  },
  {
    "id": "earbuds-case",
    "slug": "earbuds-case",
    "name": "Silicone Earbuds Case Cover",
    "urduName": "سلیکون ایئربڈز کیس",
    "category": "electronics",
    "categoryName": "Electronics",
    "originalPrice": 799,
    "price": 499,
    "discountBadge": "-38%",
    "isBestSeller": false,
    "isNew": false,
    "image": "https://nisacharar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/2_2_533x.jpg",
    "images": [
      "https://nisacharar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg"
    ],
    "weights": [
      "Standard",
      "With Keyring"
    ],
    "weightPrices": {
      "Standard": 499,
      "With Keyring": 549
    },
    "description": "Protective silicone case for your wireless earbuds. Soft grip, shock-resistance, and easy access to ports.",
    "benefits": "Protects from scratches, easy grip, comes in multiple colors.",
    "rating": 4.7,
    "reviewsCount": 51
  },
  {
    "id": "daily-essentials-combo",
    "slug": "daily-essentials-combo",
    "name": "Daily Essentials Value Bundle",
    "urduName": "ڈیلی ایسنشیلز ویلیو بنڈل",
    "category": "bundles",
    "categoryName": "Value Bundles",
    "originalPrice": 5499,
    "price": 3799,
    "discountBadge": "-31%",
    "isBestSeller": true,
    "isNew": true,
    "image": "https://nisacharar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg",
    "hoverImage": "https://nisacharar.com/cdn/shop/files/6_1_533x.png",
    "images": [
      "https://nisacharar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg"
    ],
    "weights": [
      "Value Pack",
      "Family Pack"
    ],
    "weightPrices": {
      "Value Pack": 3799,
      "Family Pack": 4999
    },
    "description": "Ultimate value combo of our top-selling everyday essentials — home, apparel, and electronics picks in one bundle.",
    "benefits": "Save Rs. 1,700+ with Free Delivery across Pakistan!",
    "rating": 5,
    "reviewsCount": 410
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug || p.id === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all' || category === 'all-products') return PRODUCTS;
  if (category === 'best-selling' || category === 'best-sellers') {
    return PRODUCTS.filter(p => p.isBestSeller);
  }
  if (category === 'new-arrivals') {
    return PRODUCTS.filter(p => p.isNew);
  }
  return PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
}
