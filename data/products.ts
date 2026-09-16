import type {
  CategoryHandle,
  FulfillmentMethod,
  InventoryStatus,
  Product,
  ProductMotif,
} from '@/types';

/* ==========================================================================
   SPICEMART — prototype catalogue
   Sample assortment weighted the way a Grenadian weekly shop actually is:
   local staples and produce first, regional and imported essentials beside
   them. Prices are EC$ and are illustrative only.

   Written through a compact seed so the file stays readable; `toProduct`
   applies the defaults (fulfilment eligibility, unit pricing, currency).
   ========================================================================== */

type Tint = 'leaf' | 'turmeric' | 'nutmeg' | 'teal' | 'cocoa' | 'signal';

interface Seed {
  h: string;
  t: string;
  v: string;
  c: CategoryHandle;
  /** Price in EC cents. */
  p: number;
  /** Compare-at price in EC cents. */
  was?: number;
  unit: string;
  /** [price in cents, per-unit label] — shown when it helps comparison. */
  up?: [number, string];
  m: ProductMotif;
  tint: Tint;
  tags: string[];
  local?: boolean;
  fresh?: boolean;
  stock?: InventoryStatus;
  ff?: FulfillmentMethod[];
  d: string;
  det?: string;
  st?: string;
  /** [quantity, total price in cents, label] */
  mb?: [number, number, string];
}

const ALL: FulfillmentMethod[] = ['delivery', 'pickup', 'spice-fair-pickup'];
/** Cold chain cannot be staged at an outdoor fair tent. */
const COLD: FulfillmentMethod[] = ['delivery', 'pickup'];

const SEEDS: Seed[] = [
  /* ================= GROCERIES ========================================== */
  { h: 'parboiled-rice-10lb', t: 'Parboiled Rice', v: 'Spicemart Everyday', c: 'groceries', p: 3295, unit: '10 lb bag', up: [726, 'kg'], m: 'sack', tint: 'turmeric', tags: ['rice', 'staple', 'bulk'], d: 'Long-grain parboiled rice that holds its shape for pelau and rice and peas. The size most households buy for the month.', det: 'Ingredients: parboiled long-grain rice. Packed in a resealable woven bag.', st: 'Store in a cool, dry place. Once opened, keep sealed against weevils.' },
  { h: 'all-purpose-flour-2kg', t: 'All-Purpose Flour', v: 'Caribbean Mills', c: 'groceries', p: 1195, unit: '2 kg', up: [598, 'kg'], m: 'sack', tint: 'cocoa', tags: ['flour', 'baking', 'staple'], d: 'Soft all-purpose flour for bakes, dumplings and bread. Mills to a fine, even grind.', det: 'Ingredients: wheat flour, niacin, iron, thiamine, riboflavin, folic acid.', st: 'Cool and dry. Use within three months of opening.' },
  { h: 'brown-sugar-2kg', t: 'Brown Sugar', v: 'Spicemart Everyday', c: 'groceries', p: 1450, was: 1690, unit: '2 kg', up: [725, 'kg'], m: 'sack', tint: 'cocoa', tags: ['sugar', 'baking', 'staple'], d: 'Soft, damp brown sugar. Regional cane, milled and packed for the weekly shop.', st: 'Keep sealed. Hardens if it takes on air.' },
  { h: 'coconut-oil-750ml', t: 'Cold-Pressed Coconut Oil', v: 'Woburn Coconut Works', c: 'groceries', p: 2850, unit: '750 ml', up: [3800, 'L'], m: 'bottle', tint: 'leaf', tags: ['oil', 'cooking', 'coconut'], local: true, d: 'Pressed in Woburn from mature nuts, unrefined and unbleached. Solid below 24°C, which is normal.', det: 'Ingredients: 100% cold-pressed coconut oil.', st: 'Room temperature, out of direct sun.' },
  { h: 'vegetable-oil-1-8l', t: 'Vegetable Oil', v: 'Spicemart Everyday', c: 'groceries', p: 2295, unit: '1.8 L', up: [1275, 'L'], m: 'bottle', tint: 'turmeric', tags: ['oil', 'frying', 'staple'], d: 'Neutral soya oil for frying and everyday cooking. The size that lasts a family a month.', st: 'Cool, dry cupboard.' },
  { h: 'evaporated-milk-410g', t: 'Evaporated Milk', v: 'Spicemart Everyday', c: 'groceries', p: 495, unit: '410 g tin', m: 'can', tint: 'teal', tags: ['milk', 'tinned', 'staple', 'tea'], mb: [4, 1790, '4 for EC$17.90'], d: 'Unsweetened evaporated milk for tea, cocoa tea and porridge.', det: 'Ingredients: evaporated milk, vitamin D3. 410 g net.', st: 'Refrigerate after opening and use within three days.' },
  { h: 'whole-milk-powder-900g', t: 'Whole Milk Powder', v: 'Spicemart Everyday', c: 'groceries', p: 4250, unit: '900 g tin', up: [4722, 'kg'], m: 'can', tint: 'teal', tags: ['milk', 'powder', 'staple'], d: 'Full-cream milk powder. Keeps without refrigeration, which matters when current goes.', st: 'Reseal the tin. Use within four weeks of opening.' },
  { h: 'eggs-tray-30', t: 'Local Eggs, Tray of 30', v: 'Mt. Moritz Provisions', c: 'groceries', p: 3600, unit: 'tray of 30', up: [120, 'egg'], m: 'egg', tint: 'turmeric', tags: ['eggs', 'protein', 'breakfast'], local: true, fresh: true, stock: 'low-stock', d: 'Brown eggs from layers in the Mt. Moritz hills, collected the morning of delivery.', st: 'Refrigerate on arrival. Best within 21 days of lay.' },
  { h: 'hard-dough-bread', t: 'Hard Dough Bread', v: 'Sauteurs Bakehouse', c: 'groceries', p: 950, unit: '800 g loaf', m: 'loaf', tint: 'turmeric', tags: ['bread', 'bakery', 'breakfast'], local: true, fresh: true, d: 'Dense, slightly sweet hard dough, baked before five and sliced on request.', det: 'Ingredients: wheat flour, water, sugar, yeast, salt, butter.', st: 'Keeps three days wrapped. Freezes well sliced.' },
  { h: 'macaroni-500g', t: 'Elbow Macaroni', v: 'Spicemart Everyday', c: 'groceries', p: 625, unit: '500 g', up: [1250, 'kg'], m: 'box', tint: 'turmeric', tags: ['pasta', 'macaroni pie', 'staple'], mb: [3, 1700, '3 for EC$17.00'], d: 'The short elbow used for macaroni pie. Holds sauce without going soft.', st: 'Cool, dry place.' },
  { h: 'split-peas-1kg', t: 'Yellow Split Peas', v: 'Spicemart Everyday', c: 'groceries', p: 1150, unit: '1 kg', m: 'pouch', tint: 'turmeric', tags: ['peas', 'soup', 'staple', 'protein'], d: 'For Saturday soup and dhal. Cooks down in about forty minutes without soaking.', st: 'Sealed, cool and dry.' },
  { h: 'red-kidney-beans-tin', t: 'Red Kidney Beans', v: 'Spicemart Everyday', c: 'groceries', p: 445, unit: '400 g tin', m: 'can', tint: 'nutmeg', tags: ['beans', 'tinned', 'rice and peas'], mb: [4, 1600, '4 for EC$16.00'], d: 'Cooked kidney beans in water. Drain and add to rice and peas.', st: 'Refrigerate after opening.' },
  { h: 'oats-1kg', t: 'Rolled Oats', v: 'Spicemart Everyday', c: 'groceries', p: 1495, was: 1750, unit: '1 kg', m: 'box', tint: 'cocoa', tags: ['oats', 'breakfast', 'porridge'], d: 'Whole rolled oats for porridge and oat drinks. Not instant.', st: 'Airtight after opening.' },
  { h: 'saltfish-400g', t: 'Salted Cod', v: 'Carriacou Salt & Sea', c: 'groceries', p: 3250, unit: '400 g', up: [8125, 'kg'], m: 'fish', tint: 'teal', tags: ['saltfish', 'protein', 'bakes', 'local'], local: true, d: 'Boneless salted cod, cut for saltfish bakes and buljol. Soak twice before cooking.', st: 'Cool and dry; refrigerate once soaked.' },

  /* ================= FRESH PRODUCE ====================================== */
  { h: 'green-fig-bunch', t: 'Green Fig', v: 'Mt. Moritz Provisions', c: 'fresh-produce', p: 850, unit: 'bunch, approx. 1.5 kg', up: [567, 'kg'], m: 'bunch', tint: 'signal', tags: ['provision', 'green banana', 'boil'], local: true, fresh: true, d: 'Green bananas for boiling, cut the morning of delivery. Sold by the bunch.', st: 'Keep out of the fridge until cooked.' },
  { h: 'dasheen-2kg', t: 'Dasheen', v: 'Mt. Moritz Provisions', c: 'fresh-produce', p: 1200, unit: 'approx. 2 kg', up: [600, 'kg'], m: 'root', tint: 'cocoa', tags: ['provision', 'ground provision', 'soup'], local: true, fresh: true, d: 'Firm dasheen for oil down and Saturday soup. Skin on, brushed of field soil.', st: 'Cool, dark, airy. Do not refrigerate.' },
  { h: 'sweet-potato-2kg', t: 'Sweet Potato', v: 'La Sagesse Farm', c: 'fresh-produce', p: 1150, unit: 'approx. 2 kg', up: [575, 'kg'], m: 'root', tint: 'nutmeg', tags: ['provision', 'ground provision'], local: true, fresh: true, d: 'White-fleshed local sweet potato. Firm, sweet and good for roasting or boiling.', st: 'Cool and dark. Two weeks unwashed.' },
  { h: 'callaloo-bundle', t: 'Callaloo Bush', v: 'La Sagesse Farm', c: 'fresh-produce', p: 700, unit: 'bundle', m: 'leaf', tint: 'leaf', tags: ['greens', 'callaloo', 'soup'], local: true, fresh: true, stock: 'low-stock', d: 'Young dasheen leaf, cut and bundled for callaloo. Cut Tuesday and Friday.', st: 'Fridge, wrapped. Use within two days.' },
  { h: 'tomatoes-1kg', t: 'Tomatoes', v: 'La Sagesse Farm', c: 'fresh-produce', p: 1395, unit: '1 kg', m: 'citrus', tint: 'nutmeg', tags: ['vegetable', 'salad', 'seasoning'], local: true, fresh: true, d: 'Field tomatoes, picked at the turn so they arrive firm and ripen on the counter.', st: 'Counter, not fridge, until fully ripe.' },
  { h: 'sweet-pepper-500g', t: 'Sweet Peppers', v: 'La Sagesse Farm', c: 'fresh-produce', p: 1250, unit: '500 g', up: [2500, 'kg'], m: 'pod', tint: 'signal', tags: ['vegetable', 'seasoning', 'green seasoning'], local: true, fresh: true, d: 'Mixed green and red sweet peppers for green seasoning and stews.', st: 'Fridge drawer. About a week.' },
  { h: 'seasoning-peppers-250g', t: 'Seasoning Peppers', v: 'La Sagesse Farm', c: 'fresh-produce', p: 800, unit: '250 g', m: 'pod', tint: 'nutmeg', tags: ['seasoning', 'pepper', 'green seasoning'], local: true, fresh: true, d: 'Aromatic seasoning peppers — the flavour of a scotch bonnet without the burn.', st: 'Fridge. Freezes whole.' },
  { h: 'golden-apples-1kg', t: 'Golden Apples', v: 'Mt. Moritz Provisions', c: 'fresh-produce', p: 900, unit: '1 kg', m: 'citrus', tint: 'turmeric', tags: ['fruit', 'juice', 'snack'], local: true, fresh: true, d: 'Firm golden apples for eating green with salt and pepper, or for juice.', st: 'Counter. Ripens over three days.' },
  { h: 'limes-500g', t: 'Limes', v: 'Mt. Moritz Provisions', c: 'fresh-produce', p: 750, unit: '500 g', up: [1500, 'kg'], m: 'citrus', tint: 'signal', tags: ['fruit', 'citrus', 'seasoning'], local: true, fresh: true, d: 'Thin-skinned local limes for washing meat, seasoning fish and juice.', st: 'Counter a week, fridge a fortnight.' },
  { h: 'mango-julie-4', t: 'Julie Mangoes', v: 'Mt. Moritz Provisions', c: 'fresh-produce', p: 1200, unit: 'pack of 4', up: [300, 'each'], m: 'citrus', tint: 'turmeric', tags: ['fruit', 'mango', 'seasonal'], local: true, fresh: true, stock: 'low-stock', d: 'Julie mangoes in season, picked firm. Seasonal — availability moves with the trees.', st: 'Counter until soft at the stem.' },
  { h: 'cucumber-each', t: 'Cucumber', v: 'La Sagesse Farm', c: 'fresh-produce', p: 375, unit: 'each', m: 'pod', tint: 'leaf', tags: ['vegetable', 'salad'], local: true, fresh: true, d: 'Straight field cucumber for salad and cucumber water.', st: 'Fridge drawer.' },
  { h: 'onions-2kg', t: 'Yellow Onions', v: 'Spicemart Everyday', c: 'fresh-produce', p: 1450, was: 1690, unit: '2 kg net', up: [725, 'kg'], m: 'bulb', tint: 'cocoa', tags: ['vegetable', 'seasoning', 'staple'], fresh: true, d: 'Imported yellow onions — the reliable base for everything. Sold in a net bag.', st: 'Cool, dark, airy. Never in a sealed bag.' },

  /* ================= HOUSEHOLD ========================================== */
  { h: 'laundry-powder-4kg', t: 'Laundry Powder', v: 'Spicemart Everyday', c: 'household', p: 4995, was: 5695, unit: '4 kg', up: [1249, 'kg'], m: 'box', tint: 'teal', tags: ['laundry', 'cleaning', 'bulk'], d: 'High-suds laundry powder for hand and machine wash. Rinses clean in hard water.', det: 'Keep out of reach of children. Not for use on wool or silk.' },
  { h: 'bleach-2l', t: 'Household Bleach', v: 'Spicemart Everyday', c: 'household', p: 895, unit: '2 L', up: [448, 'L'], m: 'bottle', tint: 'teal', tags: ['cleaning', 'disinfectant'], d: 'Standard sodium hypochlorite bleach for floors, whites and tanks.', det: 'Do not mix with ammonia or acidic cleaners.', st: 'Out of sun. Loses strength in heat.' },
  { h: 'dish-liquid-1l', t: 'Dish Liquid', v: 'Spicemart Everyday', c: 'household', p: 1095, unit: '1 L', m: 'bottle', tint: 'signal', tags: ['cleaning', 'kitchen'], mb: [2, 1900, '2 for EC$19.00'], d: 'Concentrated dish liquid. Cuts oil down and coconut oil without stripping hands.' },
  { h: 'toilet-tissue-12', t: 'Toilet Tissue, 12 Rolls', v: 'Spicemart Everyday', c: 'household', p: 3450, unit: '12 rolls', up: [288, 'roll'], m: 'roll', tint: 'turmeric', tags: ['paper', 'bathroom', 'bulk'], d: 'Two-ply tissue, 12 rolls to the pack. The pack most households reorder.' },
  { h: 'paper-towel-6', t: 'Paper Towels, 6 Rolls', v: 'Spicemart Everyday', c: 'household', p: 2895, unit: '6 rolls', up: [483, 'roll'], m: 'roll', tint: 'leaf', tags: ['paper', 'kitchen'], d: 'Absorbent two-ply kitchen towel with a perforated half-sheet.' },
  { h: 'garbage-bags-30', t: 'Garbage Bags', v: 'Spicemart Everyday', c: 'household', p: 1650, unit: '30 bags, 13 gal', m: 'box', tint: 'cocoa', tags: ['cleaning', 'kitchen'], d: 'Drawstring kitchen bags that hold a full bin without splitting.' },
  { h: 'all-purpose-cleaner-1l', t: 'Pine All-Purpose Cleaner', v: 'Spicemart Everyday', c: 'household', p: 1250, unit: '1 L', m: 'bottle', tint: 'leaf', tags: ['cleaning', 'floor'], d: 'Pine-scented cleaner for floors and surfaces. Dilute for everyday mopping.' },
  { h: 'matches-10', t: 'Safety Matches', v: 'Spicemart Everyday', c: 'household', p: 495, unit: '10 boxes', m: 'box', tint: 'nutmeg', tags: ['kitchen', 'essentials', 'storm'], d: 'Ten boxes of safety matches. Worth keeping in the storm shelf.' },
  { h: 'candles-8', t: 'Household Candles', v: 'Spicemart Everyday', c: 'household', p: 995, unit: '8 candles', m: 'tube', tint: 'turmeric', tags: ['storm', 'essentials', 'power cut'], d: 'Eight-hour white candles. Stocked year-round for current cuts and hurricane season.' },
  { h: 'mosquito-coils-10', t: 'Mosquito Coils', v: 'Spicemart Everyday', c: 'household', p: 850, unit: '10 coils', m: 'box', tint: 'signal', tags: ['insect', 'outdoor', 'evening'], d: 'Slow-burning coils for the veranda in the evening. Roughly seven hours each.', det: 'Burn in a ventilated space. Keep away from curtains.' },

  /* ================= PERSONAL CARE ====================================== */
  { h: 'coconut-cocoa-soap', t: 'Coconut & Cocoa Butter Soap', v: 'Belle Isle Soapworks', c: 'personal-care', p: 1450, unit: 'bar, 120 g', m: 'bar', tint: 'signal', tags: ['soap', 'bath', 'handmade'], local: true, d: 'Cold-process soap cured six weeks in St. David. Coconut oil for lather, cocoa butter for skin.', det: 'Ingredients: saponified coconut oil, cocoa butter, water, lye, nutmeg essential oil.' },
  { h: 'bath-soap-4pack', t: 'Bath Soap, 4 Pack', v: 'Spicemart Everyday', c: 'personal-care', p: 1395, unit: '4 × 90 g', up: [349, 'bar'], m: 'bar', tint: 'teal', tags: ['soap', 'bath', 'bulk'], d: 'Everyday deodorant soap, four to the pack.' },
  { h: 'toothpaste-150ml', t: 'Fluoride Toothpaste', v: 'Spicemart Everyday', c: 'personal-care', p: 1195, was: 1395, unit: '150 ml', m: 'tube', tint: 'teal', tags: ['oral care', 'family'], d: 'Family fluoride toothpaste in the large tube.' },
  { h: 'toothbrush-4pack', t: 'Toothbrushes, 4 Pack', v: 'Spicemart Everyday', c: 'personal-care', p: 1250, unit: '4 brushes', m: 'tube', tint: 'nutmeg', tags: ['oral care', 'family'], d: 'Soft-bristle brushes, four colours so nobody argues.' },
  { h: 'shampoo-400ml', t: 'Everyday Shampoo', v: 'Spicemart Everyday', c: 'personal-care', p: 1895, unit: '400 ml', up: [4738, 'L'], m: 'bottle', tint: 'turmeric', tags: ['hair', 'bath'], d: 'Gentle daily shampoo for all hair types.' },
  { h: 'coconut-hair-oil-250ml', t: 'Coconut Hair Oil', v: 'Woburn Coconut Works', c: 'personal-care', p: 2250, unit: '250 ml', up: [9000, 'L'], m: 'bottle', tint: 'leaf', tags: ['hair', 'coconut', 'handmade'], local: true, d: 'Cold-pressed coconut oil infused with rosemary, bottled for hair and scalp.' },
  { h: 'body-lotion-500ml', t: 'Cocoa Butter Body Lotion', v: 'Spicemart Everyday', c: 'personal-care', p: 2150, unit: '500 ml', m: 'bottle', tint: 'cocoa', tags: ['skin', 'lotion'], d: 'Cocoa butter lotion for dry skin. Absorbs without sitting on the surface.' },
  { h: 'deodorant-roll-on', t: 'Roll-On Deodorant', v: 'Spicemart Everyday', c: 'personal-care', p: 1150, unit: '50 ml', m: 'tube', tint: 'teal', tags: ['deodorant', 'daily'], d: 'Unscented 24-hour roll-on.' },
  { h: 'baby-wipes-80', t: 'Baby Wipes', v: 'Spicemart Everyday', c: 'personal-care', p: 1395, unit: '80 wipes', up: [17, 'wipe'], m: 'pouch', tint: 'signal', tags: ['baby', 'family'], mb: [3, 3600, '3 for EC$36.00'], d: 'Fragrance-free wipes with a resealable lid.' },
  { h: 'sanitary-pads-16', t: 'Sanitary Pads', v: 'Spicemart Everyday', c: 'personal-care', p: 1450, unit: '16 pads', m: 'pouch', tint: 'nutmeg', tags: ['feminine care', 'essentials'], d: 'Regular absorbency with wings, 16 to the pack.' },

  /* ================= DRINKS ============================================= */
  { h: 'still-water-6x1-5l', t: 'Still Water, 6 Pack', v: 'Spicemart Everyday', c: 'drinks', p: 1850, unit: '6 × 1.5 L', up: [206, 'L'], m: 'bottle', tint: 'teal', tags: ['water', 'bulk', 'storm'], mb: [2, 3400, '2 packs for EC$34.00'], d: 'Six 1.5 litre bottles. The pack people keep two of in hurricane season.' },
  { h: 'coconut-water-1l', t: 'Coconut Water', v: 'Woburn Coconut Works', c: 'drinks', p: 1450, unit: '1 L', m: 'carton', tint: 'leaf', tags: ['coconut', 'juice', 'chilled'], local: true, fresh: true, ff: COLD, d: 'Water from mature nuts, bottled the day it is opened. Nothing added.', st: 'Keep chilled. Drink within four days of opening.' },
  { h: 'sorrel-drink-750ml', t: 'Sorrel Drink', v: 'True Blue Juice Co.', c: 'drinks', p: 1650, unit: '750 ml', up: [2200, 'L'], m: 'bottle', tint: 'nutmeg', tags: ['sorrel', 'juice', 'local'], local: true, d: 'Steeped sorrel with clove and ginger, lightly sweetened. Stocked year-round, not only at Christmas.', st: 'Refrigerate. Five days once opened.' },
  { h: 'golden-apple-juice-1l', t: 'Golden Apple Juice', v: 'True Blue Juice Co.', c: 'drinks', p: 1850, unit: '1 L', m: 'bottle', tint: 'turmeric', tags: ['juice', 'cold pressed', 'local'], local: true, fresh: true, ff: COLD, d: 'Cold-pressed golden apple with a little lime. No water, no concentrate.', st: 'Chilled. Three days once opened.' },
  { h: 'malt-drink-6pack', t: 'Malt Drink, 6 Pack', v: 'Spicemart Everyday', c: 'drinks', p: 2250, unit: '6 × 330 ml', up: [375, 'bottle'], m: 'can', tint: 'cocoa', tags: ['malt', 'soft drink', 'bulk'], d: 'Non-alcoholic malt in the small bottle, six to a pack.' },
  { h: 'ginger-beer-4pack', t: 'Ginger Beer, 4 Pack', v: 'True Blue Juice Co.', c: 'drinks', p: 1950, unit: '4 × 300 ml', up: [488, 'bottle'], m: 'bottle', tint: 'turmeric', tags: ['ginger', 'soft drink', 'local'], local: true, d: 'Hot with fresh ginger, brewed in small batches and lightly carbonated.' },
  { h: 'cocoa-tea-balls', t: 'Cocoa Tea Balls', v: 'Victoria Cocoa Works', c: 'drinks', p: 1850, unit: '6 balls, 300 g', up: [6167, 'kg'], m: 'bar', tint: 'cocoa', tags: ['cocoa', 'cocoa tea', 'breakfast', 'local'], local: true, d: 'Roasted, ground and rolled cocoa with bay leaf and cinnamon. Grate into boiling water for cocoa tea.', det: 'Ingredients: 100% Grenadian cocoa, bay leaf, cinnamon.', st: 'Airtight, cool and dry. Keeps a year.' },
  { h: 'ground-coffee-340g', t: 'Ground Coffee', v: 'Grand Etang Roasters', c: 'drinks', p: 3450, unit: '340 g', up: [10147, 'kg'], m: 'pouch', tint: 'cocoa', tags: ['coffee', 'breakfast', 'local'], local: true, d: 'Medium roast ground for a cafetière or a drip pot. Roasted weekly in St. Andrew.', st: 'Airtight, away from the stove.' },
  { h: 'mauby-syrup-500ml', t: 'Mauby Syrup', v: 'Petite Anse Preserves', c: 'drinks', p: 1550, unit: '500 ml', m: 'bottle', tint: 'cocoa', tags: ['mauby', 'syrup', 'local'], local: true, d: 'Concentrated mauby bark syrup. Dilute one to eight and chill hard.', st: 'Cupboard. Refrigerate once opened.' },
  { h: 'tea-bags-100', t: 'Black Tea Bags', v: 'Spicemart Everyday', c: 'drinks', p: 1195, unit: '100 bags', up: [12, 'bag'], m: 'box', tint: 'turmeric', tags: ['tea', 'breakfast'], d: 'Everyday black tea, a hundred to the box.' },

  /* ================= PANTRY ============================================= */
  { h: 'whole-nutmeg-100g', t: 'Whole Nutmeg', v: 'Concord Valley Spice Co.', c: 'pantry', p: 1650, unit: '100 g', up: [16500, 'kg'], m: 'jar', tint: 'cocoa', tags: ['nutmeg', 'spice', 'local', 'baking'], local: true, d: 'Sun-dried whole nutmeg in the shell-less form, graded for the kitchen. Grate fresh.', det: 'Ingredients: whole nutmeg (Myristica fragrans). Product of Grenada.', st: 'Airtight jar. Whole nutmeg keeps its oil for years.' },
  { h: 'ground-mace-50g', t: 'Ground Mace', v: 'Concord Valley Spice Co.', c: 'pantry', p: 1950, unit: '50 g', up: [39000, 'kg'], m: 'jar', tint: 'nutmeg', tags: ['mace', 'spice', 'local'], local: true, stock: 'low-stock', d: 'The lace around the nutmeg, dried and milled. Warmer and lighter than the seed.', st: 'Airtight, out of light.' },
  { h: 'cinnamon-sticks-50g', t: 'Cinnamon Sticks', v: 'Concord Valley Spice Co.', c: 'pantry', p: 1250, unit: '50 g', m: 'bar', tint: 'cocoa', tags: ['cinnamon', 'spice', 'local'], local: true, d: 'Rolled bark cut into short quills for cocoa tea, porridge and stews.' },
  { h: 'green-seasoning-350ml', t: 'Green Seasoning', v: 'Petite Anse Preserves', c: 'pantry', p: 1450, unit: '350 ml', m: 'jar', tint: 'leaf', tags: ['seasoning', 'chive', 'local', 'everyday'], local: true, d: 'Blended chive, thyme, seasoning pepper and garlic. The jar that saves twenty minutes on a weeknight.', det: 'Ingredients: chive, thyme, seasoning pepper, garlic, celery, salt, vinegar.', st: 'Refrigerate after opening.' },
  { h: 'pepper-sauce-200ml', t: 'Pepper Sauce', v: 'Petite Anse Preserves', c: 'pantry', p: 1150, unit: '200 ml', m: 'bottle', tint: 'nutmeg', tags: ['pepper sauce', 'hot', 'local'], local: true, d: 'Scotch bonnet, mustard and vinegar. Hot, but you can still taste the food.', st: 'Cupboard. Refrigerate once opened.' },
  { h: 'nutmeg-syrup-375ml', t: 'Nutmeg Syrup', v: 'Petite Anse Preserves', c: 'pantry', p: 2450, unit: '375 ml', m: 'bottle', tint: 'turmeric', tags: ['nutmeg', 'syrup', 'local', 'gift'], local: true, d: 'Nutmeg pericarp cooked down with cane sugar. For ice cream, rum punch and pancakes.', st: 'Refrigerate after opening.' },
  { h: 'guava-jelly-330g', t: 'Guava Jelly', v: 'Petite Anse Preserves', c: 'pantry', p: 1850, unit: '330 g', up: [5606, 'kg'], m: 'jar', tint: 'nutmeg', tags: ['jam', 'preserve', 'local', 'breakfast'], local: true, d: 'Set with the fruit’s own pectin, so it is firm rather than syrupy.', st: 'Refrigerate after opening. Four weeks.' },
  { h: 'raw-honey-500g', t: 'Raw Honey', v: 'Levera Apiary', c: 'pantry', p: 3250, unit: '500 g', up: [6500, 'kg'], m: 'jar', tint: 'turmeric', tags: ['honey', 'local', 'breakfast'], local: true, d: 'Unfiltered honey from north-coast hives. It will crystallise — that is the proof it is raw.', st: 'Cupboard. Warm the jar gently if it sets.' },
  { h: 'sea-salt-400g', t: 'Sea Salt', v: 'Carriacou Salt & Sea', c: 'pantry', p: 950, unit: '400 g', up: [2375, 'kg'], m: 'jar', tint: 'teal', tags: ['salt', 'local', 'seasoning'], local: true, d: 'Hand-harvested and dried on Carriacou. Coarse crystals for the grinder.' },
  { h: 'tomato-paste-tin', t: 'Tomato Paste', v: 'Spicemart Everyday', c: 'pantry', p: 325, unit: '170 g tin', m: 'can', tint: 'nutmeg', tags: ['tinned', 'cooking', 'staple'], mb: [5, 1450, '5 for EC$14.50'], d: 'Double-concentrated paste for stews and sauces.' },
  { h: 'tuna-tin-3pack', t: 'Tuna in Oil, 3 Pack', v: 'Spicemart Everyday', c: 'pantry', p: 1550, was: 1795, unit: '3 × 142 g', up: [517, 'tin'], m: 'can', tint: 'teal', tags: ['tinned', 'protein', 'lunch'], d: 'Chunk light tuna in soya oil, three tins to the sleeve.' },
  { h: 'baking-powder-450g', t: 'Baking Powder', v: 'Spicemart Everyday', c: 'pantry', p: 995, unit: '450 g', m: 'can', tint: 'turmeric', tags: ['baking', 'staple'], d: 'Double-acting baking powder in the resealable tin.', st: 'Dry cupboard. Clumps if it takes on damp.' },

  /* ================= FROZEN & CHILLED =================================== */
  { h: 'chicken-whole-frozen', t: 'Whole Chicken, Frozen', v: 'Spicemart Everyday', c: 'frozen-chilled', p: 3450, unit: 'approx. 1.8 kg', up: [1917, 'kg'], m: 'box', tint: 'teal', tags: ['chicken', 'protein', 'frozen', 'sunday'], ff: COLD, d: 'Grade A whole chicken, frozen hard. Cut to order on request in the notes.', st: 'Keep frozen at −18°C. Thaw in the fridge overnight.' },
  { h: 'chicken-leg-quarters-2kg', t: 'Chicken Leg Quarters', v: 'Spicemart Everyday', c: 'frozen-chilled', p: 2950, was: 3395, unit: '2 kg', up: [1475, 'kg'], m: 'box', tint: 'teal', tags: ['chicken', 'protein', 'frozen', 'bulk'], ff: COLD, d: 'Leg quarters in a 2 kg bag — the weekday protein most baskets repeat.', st: 'Frozen. Do not refreeze once thawed.' },
  { h: 'yellowfin-tuna-steaks', t: 'Yellowfin Tuna Steaks', v: 'Gouyave Sea Catch', c: 'frozen-chilled', p: 4250, unit: '2 steaks, approx. 500 g', up: [8500, 'kg'], m: 'fish', tint: 'teal', tags: ['fish', 'protein', 'local', 'chilled'], local: true, fresh: true, ff: COLD, stock: 'low-stock', d: 'Line-caught off Gouyave, cut into steaks and chilled on ice the same day.', st: 'Chilled. Cook within 24 hours or freeze on arrival.' },
  { h: 'jacks-fresh-1kg', t: 'Fresh Jacks', v: 'Gouyave Sea Catch', c: 'frozen-chilled', p: 2650, unit: '1 kg', m: 'fish', tint: 'teal', tags: ['fish', 'protein', 'local', 'fry'], local: true, fresh: true, ff: COLD, d: 'Whole jacks, scaled and gutted, ready to season and fry.', st: 'Chilled. Same-day cooking.' },
  { h: 'butter-454g', t: 'Salted Butter', v: 'Spicemart Everyday', c: 'frozen-chilled', p: 2250, unit: '454 g', up: [4956, 'kg'], m: 'box', tint: 'turmeric', tags: ['butter', 'baking', 'chilled'], ff: COLD, d: 'Salted block butter for baking and bread.', st: 'Fridge. Freezes for three months.' },
  { h: 'cheddar-block-500g', t: 'Cheddar Block', v: 'Spicemart Everyday', c: 'frozen-chilled', p: 3250, unit: '500 g', up: [6500, 'kg'], m: 'box', tint: 'turmeric', tags: ['cheese', 'macaroni pie', 'chilled'], ff: COLD, d: 'Mature cheddar in a block. Grates properly for macaroni pie.', st: 'Fridge, wrapped.' },
  { h: 'ice-cream-1-8l', t: 'Nutmeg Ice Cream', v: 'Victoria Cocoa Works', c: 'frozen-chilled', p: 3850, unit: '1.8 L', up: [2139, 'L'], m: 'carton', tint: 'cocoa', tags: ['ice cream', 'frozen', 'local', 'dessert'], local: true, ff: COLD, d: 'Nutmeg and cinnamon custard base, churned in Victoria.', st: 'Freezer. Softens quickly in the car — pack it last.' },
  { h: 'ice-bag-5kg', t: 'Bagged Ice', v: 'Spicemart Everyday', c: 'frozen-chilled', p: 850, unit: '5 kg', m: 'pouch', tint: 'teal', tags: ['ice', 'frozen', 'party'], ff: ['delivery'], stock: 'out-of-stock', d: 'Cube ice in a 5 kg bag. Delivery only, and only on same-day routes.', st: 'Freezer immediately.' },
];

const money = (amount: number) => ({ amount, currency: 'XCD' as const });

const toProduct = (s: Seed, i: number): Product => ({
  id: `p-${String(i + 1).padStart(3, '0')}`,
  handle: s.h,
  title: s.t,
  vendor: s.v,
  description: s.d,
  details: s.det,
  storage: s.st,
  category: s.c,
  images: [
    { motif: s.m, tint: s.tint, alt: `${s.t}, ${s.unit}` },
    { motif: s.m, tint: s.tint, alt: `${s.t} — pack information panel` },
  ],
  price: money(s.p),
  compareAtPrice: s.was ? money(s.was) : undefined,
  unit: s.unit,
  unitPrice: s.up ? { ...money(s.up[0]), per: s.up[1] } : undefined,
  inventoryStatus: s.stock ?? 'in-stock',
  tags: s.tags,
  local: s.local ?? false,
  fresh: s.fresh ?? false,
  fulfillmentMethods: s.ff ?? ALL,
  multibuy: s.mb ? { quantity: s.mb[0], price: money(s.mb[1]), label: s.mb[2] } : undefined,
});

export const PRODUCTS: Product[] = SEEDS.map(toProduct);

export const getProduct = (handle: string): Product | undefined =>
  PRODUCTS.find((p) => p.handle === handle);

export const getProductById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);
