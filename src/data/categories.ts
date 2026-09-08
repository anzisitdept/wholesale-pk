import { Category, SubCategory } from '@/types';
export type { Category, SubCategory };

export const CATEGORIES: Category[] = [
  {
    id: 'apparel',
    slug: 'apparel',
    name: 'Apparel',
    urduName: 'لباس',
    description: 'Premium quality clothing for men, women, and kids — from everyday essentials to fashion statements.',
    image: 'https://nisarachar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg',
    itemCount: 12,
    subcategories: [
      {
        id: 'men-fashion',
        slug: 'men-fashion',
        name: 'Men Fashion',
        urduName: 'مردانہ فیشن',
        image: 'https://nisarachar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg',
        itemCount: 5,
      },
      {
        id: 'women-fashion',
        slug: 'women-fashion',
        name: 'Women Fashion',
        urduName: 'زنانہ فیشن',
        image: 'https://nisarachar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg',
        itemCount: 4,
      },
      {
        id: 'kids-fashion',
        slug: 'kids-fashion',
        name: 'Kids Fashion',
        urduName: 'بچوں کا فیشن',
        image: 'https://nisarachar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg',
        itemCount: 3,
      }
    ]
  },
  {
    id: 'electronics',
    slug: 'electronics',
    name: 'Electronics',
    urduName: 'الیکٹرانکس',
    description: 'Genuine electronics and gadgets — mobile accessories, audio, wearables, and smart home devices.',
    image: 'https://nisarachar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg',
    itemCount: 8,
    subcategories: [
      {
        id: 'mobile-accessories',
        slug: 'mobile-accessories',
        name: 'Mobile Accessories',
        urduName: 'موبائل لوازمات',
        image: 'https://nisarachar.com/cdn/shop/files/04_e50c3509-8de8-4347-8386-7c1317eb893c_533x.jpg',
        itemCount: 4,
      },
      {
        id: 'audio',
        slug: 'audio',
        name: 'Audio & Wearables',
        urduName: 'آڈیو اور وئیر ایبلز',
        image: 'https://nisarachar.com/cdn/shop/files/02_2ec724f6-078a-47e4-b64a-57cd5f305606_533x.jpg',
        itemCount: 4,
      }
    ]
  },
  {
    id: 'home-living',
    slug: 'home-living',
    name: 'Home & Living',
    urduName: 'گھر اور رہائش',
    description: 'Stylish and functional items for every room — decor, kitchenware, and everyday home essentials.',
    image: 'https://nisarachar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg',
    itemCount: 10,
    subcategories: [
      {
        id: 'kitchen-products',
        slug: 'kitchen-products',
        name: 'Kitchen Products',
        urduName: 'کچن پراڈکٹس',
        image: 'https://nisarachar.com/cdn/shop/files/01_e8785eb1-16a7-4ebe-a073-40cf7dce0210_533x.jpg',
        itemCount: 5,
      },
      {
        id: 'decor',
        slug: 'decor',
        name: 'Home Decor',
        urduName: 'گھر کی سجاوٹ',
        image: 'https://nisarachar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg',
        itemCount: 5,
      }
    ]
  },
  {
    id: 'grocery',
    slug: 'grocery',
    name: 'Grocery & Essentials',
    urduName: 'گروسری',
    description: 'Everyday grocery and household essentials at wholesale-friendly prices for the whole family.',
    image: 'https://nisarachar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg',
    itemCount: 7
  },
  {
    id: 'beauty-care',
    slug: 'beauty-care',
    name: 'Beauty & Care',
    urduName: 'بیوٹی اور کیئر',
    description: 'Personal care and beauty products to keep you fresh, confident, and well-groomed every day.',
    image: 'https://nisarachar.com/cdn/shop/files/02_00c0b731-9c48-4d3a-bf59-0ad7b9a3cfbe_533x.jpg',
    itemCount: 4
  },
  {
    id: 'best-selling',
    slug: 'best-selling',
    name: 'Best Selling',
    urduName: 'بہترین فروخت',
    description: 'Our most-loved products across all categories, ordered by thousands of happy customers across Pakistan.',
    image: 'https://nisarachar.com/cdn/shop/files/MAINN_WEB.jpg',
    itemCount: 12
  },
  {
    id: 'bundles',
    slug: 'bundles',
    name: 'Value Bundles (بنڈل آفرز)',
    urduName: 'خصوصی بنڈل آفرز',
    description: 'Exclusive combo packs offering maximum savings and free home delivery nationwide.',
    image: 'https://nisarachar.com/cdn/shop/files/06_d241e5df-955b-4d06-acda-2420ffd7af15_533x.jpg',
    itemCount: 5
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug || c.id === slug);
}
