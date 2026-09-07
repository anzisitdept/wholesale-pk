export interface SubCategory {
  id: string;
  slug: string;             // e.g. "tea-coffee"
  name: string;             // e.g. "Tea & Coffee"
  urduName?: string;        // e.g. "چائے اور کافی"
  description?: string;
  image?: string;           // Direct image URL for the dropdown thumbnail (36x36)
  itemCount?: number;
}

export interface Category {
  id: string;
  slug: string;             // e.g. "beverages"
  name: string;             // e.g. "Beverages"
  urduName?: string;        // e.g. "مشروبات"
  description?: string;
  image?: string;           // Banner or main category icon
  itemCount?: number;
  subcategories?: SubCategory[]; // Nested array of sub-categories
}
