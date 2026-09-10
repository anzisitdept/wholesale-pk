import { Category } from '@/types';
export type { Category };
export const CATEGORIES: Category[] = [
  {
    id: 'necklaces',
    slug: 'necklaces',
    name: 'Necklaces',
    urduName: 'ہار',
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
    urduName: 'انگوٹھی',
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
    id: 'earrings',
    slug: 'earrings',
    name: 'Earrings',
    urduName: 'بالیاں',
    description: 'Studs, drops, dangles, and hoops for everyday elegance.',
    itemCount: 0,
    subcategories: [
      {
        id: 'stud-earrings',
        slug: 'stud-earrings',
        name: 'Studs',
        itemCount: 0,
      },
      {
        id: 'drop-earrings',
        slug: 'drop-earrings',
        name: 'Drops & Dangles',
        itemCount: 0,
      },
      {
        id: 'hoop-earrings',
        slug: 'hoop-earrings',
        name: 'Hoops',
        itemCount: 0,
      },
    ],
  },
  {
    id: 'bracelets',
    slug: 'bracelets',
    name: 'Bracelets',
    urduName: 'چوڑیاں',
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
    id: 'jewelry-sets',
    slug: 'jewelry-sets',
    name: 'Jewelry Sets',
    urduName: 'جیولری سیٹس',
    description: 'Matching bridal and everyday jewelry sets for a complete look.',
    itemCount: 0,
    subcategories: [
      {
        id: 'bridal-sets',
        slug: 'bridal-sets',
        name: 'Bridal Sets',
        itemCount: 0,
      },
      {
        id: 'everyday-sets',
        slug: 'everyday-sets',
        name: 'Everyday Sets',
        itemCount: 0,
      },
    ],
  },
  {
    id: 'custom-design',
    slug: 'custom-design',
    name: 'Custom Design',
    urduName: 'کسٹم ڈیزائن',
    description: 'Bespoke jewelry made to your exact design and specifications.',
    itemCount: 0,
    subcategories: [],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug || c.id === slug);
}