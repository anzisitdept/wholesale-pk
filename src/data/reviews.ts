import { Review } from '@/types';

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Dr. Tariq Mahmood',
    location: 'Islamabad',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent quality and very securely packed! The packaging was leak-proof and the item arrived in perfect condition. Will order again!',
    verified: true,
    productSlug: 'premium-cotton-t-shirt',
    productName: 'Premium Cotton T-Shirt'
  },
  {
    id: 'rev-2',
    author: 'Fatima Zafar',
    location: 'Lahore',
    rating: 5,
    date: '1 week ago',
    comment: 'Great quality and fast delivery. The product matched the description perfectly. Highly recommended!',
    verified: true,
    productSlug: 'wireless-buds-pro',
    productName: 'Wireless Earbuds Pro'
  },
  {
    id: 'rev-3',
    author: 'Usman Ghani',
    location: 'Karachi',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best quality products in Pakistan. Delivery was super fast via COD.',
    verified: true,
    productSlug: 'modern-wall-clock',
    productName: 'Modern Minimalist Wall Clock'
  },
  {
    id: 'rev-4',
    author: 'Ayesha Malik',
    location: 'Rawalpindi',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Very happy with my purchase. Great value for money and the packaging was professional and secure.',
    verified: true,
    productSlug: 'skincare-kit',
    productName: 'Daily Skincare Essentials Kit'
  }
];
