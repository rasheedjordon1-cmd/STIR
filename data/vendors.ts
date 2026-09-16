import type { Vendor } from '@/types';

/* ==========================================================================
   SPICEMART — local vendors
   Prototype businesses. Place names are real Grenadian geography; the trading
   names are invented for the prototype and must be replaced with signed
   vendor records before launch.
   ========================================================================== */

export const VENDORS: Vendor[] = [
  {
    id: 'v-concord-spice',
    name: 'Concord Valley Spice Co.',
    parish: 'St. John',
    category: 'Spice & seasoning',
    blurb: 'Nutmeg, mace and cinnamon dried and milled in the Concord valley.',
    accent: 'cocoa',
    sellsOnline: true,
  },
  {
    id: 'v-sagesse-farm',
    name: 'La Sagesse Farm',
    parish: 'St. David',
    category: 'Produce',
    blurb: 'Leafy greens, tomato and sweet pepper, cut to order twice a week.',
    accent: 'signal',
    sellsOnline: true,
  },
  {
    id: 'v-gouyave-catch',
    name: 'Gouyave Sea Catch',
    parish: 'St. John',
    category: 'Fish & seafood',
    blurb: 'Line-caught tuna and jacks from the Gouyave fishing fleet.',
    accent: 'teal',
    sellsOnline: true,
  },
  {
    id: 'v-victoria-cocoa',
    name: 'Victoria Cocoa Works',
    parish: 'St. Mark',
    category: 'Cocoa & chocolate',
    blurb: 'Cocoa balls, roasted nibs and drinking chocolate from tree to bar.',
    accent: 'cocoa',
    sellsOnline: true,
  },
  {
    id: 'v-sauteurs-bakehouse',
    name: 'Sauteurs Bakehouse',
    parish: 'St. Patrick',
    category: 'Bakery',
    blurb: 'Hard dough bread, coconut rolls and bakes, baked before five.',
    accent: 'turmeric',
    sellsOnline: true,
  },
  {
    id: 'v-levera-honey',
    name: 'Levera Apiary',
    parish: 'St. Patrick',
    category: 'Honey & preserves',
    blurb: 'Raw honey from hives on the north coast, bottled unfiltered.',
    accent: 'turmeric',
    sellsOnline: true,
  },
  {
    id: 'v-petite-anse-preserves',
    name: 'Petite Anse Preserves',
    parish: 'St. Patrick',
    category: 'Preserves',
    blurb: 'Guava jelly, nutmeg syrup and pepper sauce in small batches.',
    accent: 'nutmeg',
    sellsOnline: true,
  },
  {
    id: 'v-woburn-coconut',
    name: 'Woburn Coconut Works',
    parish: 'St. George',
    category: 'Oils & coconut',
    blurb: 'Cold-pressed coconut oil and coconut water, pressed in Woburn.',
    accent: 'leaf',
    sellsOnline: true,
  },
  {
    id: 'v-grand-etang-roasters',
    name: 'Grand Etang Roasters',
    parish: 'St. Andrew',
    category: 'Coffee & cocoa tea',
    blurb: 'Small-batch roasting, ground for a cafetière or a coffee pot.',
    accent: 'cocoa',
    sellsOnline: true,
  },
  {
    id: 'v-carriacou-salt',
    name: 'Carriacou Salt & Sea',
    parish: 'Carriacou',
    category: 'Salt & seasoning',
    blurb: 'Hand-harvested sea salt and salted fish from the sister isle.',
    accent: 'teal',
    sellsOnline: true,
  },
  {
    id: 'v-mt-moritz',
    name: 'Mt. Moritz Provisions',
    parish: 'St. George',
    category: 'Ground provisions',
    blurb: 'Dasheen, yam, sweet potato and green fig from the hillside plots.',
    accent: 'leaf',
    sellsOnline: true,
  },
  {
    id: 'v-true-blue-juice',
    name: 'True Blue Juice Co.',
    parish: 'St. George',
    category: 'Juice & drinks',
    blurb: 'Cold-pressed golden apple, sorrel and ginger, no added water.',
    accent: 'nutmeg',
    sellsOnline: true,
  },
  {
    id: 'v-belle-isle-soap',
    name: 'Belle Isle Soapworks',
    parish: 'St. David',
    category: 'Personal care',
    blurb: 'Coconut and cocoa butter soap, cured for six weeks.',
    accent: 'signal',
    sellsOnline: true,
  },
  {
    id: 'v-marquis-craft',
    name: 'Marquis Craft Collective',
    parish: 'St. Andrew',
    category: 'Craft & home',
    blurb: 'Screw-pine baskets and woven mats from the Marquis makers.',
    accent: 'turmeric',
    sellsOnline: false,
  },
  {
    id: 'v-river-antoine-kitchen',
    name: 'River Road Kitchen',
    parish: "St. George",
    category: 'Prepared food',
    blurb: 'Oil down, roti and saltfish bakes, cooked on site at the fair.',
    accent: 'nutmeg',
    sellsOnline: false,
  },
  {
    id: 'v-morne-fendue-plants',
    name: 'Morne Fendue Plant Stall',
    parish: 'St. Patrick',
    category: 'Garden',
    blurb: 'Seedlings, herbs and potted fruit trees for the home garden.',
    accent: 'leaf',
    sellsOnline: false,
  },
];

export const getVendor = (id: string): Vendor | undefined => VENDORS.find((v) => v.id === id);

export const getVendorByName = (name: string): Vendor | undefined =>
  VENDORS.find((v) => v.name === name);
