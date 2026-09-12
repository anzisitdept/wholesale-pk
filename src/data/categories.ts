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
    id: 'firefighters',
    slug: 'firefighters',
    name: 'Firefighters',
    urduName: 'فائر فائٹرز',
    description: 'Premium firefighters equipment and essentials.',
    itemCount: 0,
    subcategories: [
      {
        id: 'firefighter-equipment',
        slug: 'firefighter-equipment',
        name: 'Equipment & Gear',
        itemCount: 0,
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug || c.id === slug);
}