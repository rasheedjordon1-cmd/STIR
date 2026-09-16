import type { Category, CategoryHandle } from '@/types';

/* ==========================================================================
   SPICEMART — merchandising taxonomy
   "local" and "deals" are merchandising systems layered over the product
   categories, not physical aisles: products carry local/compareAtPrice flags
   and are collected into these two shelves by the adapter.
   ========================================================================== */

export const CATEGORIES: Category[] = [
  {
    handle: 'groceries',
    title: 'Groceries',
    icon: 'Groceries',
    blurb: 'Rice, flour, oil, milk, eggs — the weekly shop.',
    accent: 'leaf',
    inMainNav: true,
  },
  {
    handle: 'fresh-produce',
    title: 'Fresh Produce',
    icon: 'FreshProduce',
    blurb: 'Picked from Grenadian growers, packed the same morning.',
    accent: 'signal',
    inMainNav: true,
  },
  {
    handle: 'household',
    title: 'Household',
    icon: 'Household',
    blurb: 'Cleaning, laundry, paper goods and kitchen basics.',
    accent: 'teal',
    inMainNav: true,
  },
  {
    handle: 'personal-care',
    title: 'Personal Care',
    icon: 'PersonalCare',
    blurb: 'Soap, oral care, hair, skin and baby.',
    accent: 'nutmeg',
    inMainNav: true,
  },
  {
    handle: 'drinks',
    title: 'Drinks',
    icon: 'Drinks',
    blurb: 'Water, juice, malt, cocoa tea and local sorrel.',
    accent: 'turmeric',
    inMainNav: true,
  },
  {
    handle: 'pantry',
    title: 'Pantry',
    icon: 'Pantry',
    blurb: 'Seasoning, spice, tinned goods and baking.',
    accent: 'cocoa',
    inMainNav: false,
  },
  {
    handle: 'frozen-chilled',
    title: 'Frozen & Chilled',
    icon: 'FrozenChilled',
    blurb: 'Fish, chicken, butter and ice. Delivery routes only.',
    accent: 'teal',
    inMainNav: false,
  },
  {
    handle: 'local',
    title: 'Local',
    icon: 'LocalVendors',
    blurb: 'Grown, made and packed in Grenada.',
    accent: 'leaf',
    inMainNav: true,
  },
  {
    handle: 'deals',
    title: 'Deals',
    icon: 'Deals',
    blurb: 'Reduced prices and multibuys, with the unit price shown.',
    accent: 'nutmeg',
    inMainNav: true,
  },
];

/** The eight tiles on the homepage, in merchandising priority order. */
export const HOME_CATEGORY_ORDER: CategoryHandle[] = [
  'groceries',
  'fresh-produce',
  'household',
  'personal-care',
  'drinks',
  'pantry',
  'local',
  'deals',
];

export const getCategory = (handle: string): Category | undefined =>
  CATEGORIES.find((c) => c.handle === handle);

/** Shelves are computed, not stored — a product is never filed under "deals". */
export const SHELF_HANDLES: CategoryHandle[] = ['local', 'deals'];
export const isShelf = (handle: string) => SHELF_HANDLES.includes(handle as CategoryHandle);
