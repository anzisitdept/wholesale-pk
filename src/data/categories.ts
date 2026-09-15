import { Category } from '@/types';
export type { Category };
export const CATEGORIES: Category[] = [
  {
    id: 'necklaces',
    slug: 'necklaces',
    name: 'Necklaces',
    description: 'Elegant necklaces, pendants, and chokers crafted for every occasion.',
    itemCount: 0,
    subcategories: [
      {
        id: 'pendant-necklaces',
        slug: 'pendant-necklaces',
        name: 'Pendants & Chains',
        itemCount: 0,
      },
      {
        id: 'chokers',
        slug: 'chokers',
        name: 'Chokers',
        itemCount: 0,
      },
    ],
  },
  {
    id: 'rings',
    slug: 'rings',
    name: 'Rings',
    description: 'Statement rings, diamond rings, and stackable bands.',
    itemCount: 0,
    subcategories: [
      {
        id: 'diamond-rings',
        slug: 'diamond-rings',
        name: 'Diamond Rings',
        itemCount: 0,
      },
      {
        id: 'bands',
        slug: 'bands',
        name: 'Bands & Stacks',
        itemCount: 0,
      },
    ],
  },
  {
    id: 'bracelets',
    slug: 'bracelets',
    name: 'Bracelets',
    description: 'Bracelets, bangles, and cuffs to adorn your wrist.',
    itemCount: 0,
    subcategories: [
      {
        id: 'bangles',
        slug: 'bangles',
        name: 'Bangles & Cuffs',
        itemCount: 0,
      },
    ],
  },
  {
    id: 'firelighters',
    slug: 'firelighters',
    name: 'FireLighters',
    description: 'Premium lighters and essentials.',
    itemCount: 0,
    subcategories: [],
  },
  {
    id: 'watches',
    slug: 'watches',
    name: 'Watches',
    description: 'Luxury and everyday watches.',
    itemCount: 0,
    subcategories: [],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug || c.id === slug);
}