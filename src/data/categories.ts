// ═══════════════════════════════════════════════════════════════
// NILKANTH MARBLE — Categories Data
// ═══════════════════════════════════════════════════════════════

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  emoji: string;
  color: string;          // Tailwind color class prefix
  accentColor: string;    // Hex for gradient
  image: string;
  productCount: number;
  route: string;
  groupName?: string;     // Parent group for categorization
}

export const categories: Category[] = [
  {
    id: 'marble',
    slug: 'marble',
    name: 'Marble',
    description: 'Premium Italian & Indian marble',
    longDescription: 'From iconic Carrara White to rare Portoro Gold — world-class marble varieties for luxury flooring, wall cladding, countertops and more.',
    emoji: '🪨',
    color: 'blue',
    accentColor: '#1C3A6B',
    image: '/marble-calacatta.png',
    productCount: 8,
    route: '/marble',
    groupName: 'Natural Stone',
  },
  {
    id: 'granite',
    slug: 'granite',
    name: 'Granite',
    description: 'Natural granite slabs',
    longDescription: 'Black Galaxy, Kashmir White, Tan Brown and other premium natural granites. Beautiful and durable natural stone slabs for kitchen countertops, flooring, and elevations.',
    emoji: '⬛',
    color: 'slate',
    accentColor: '#374151',
    image: '/natural-stone-hero.png',
    productCount: 4,
    route: '/granite',
    groupName: 'Natural Stone',
  },
  {
    id: 'kota-stone',
    slug: 'kota-stone',
    name: 'Kota Stone',
    description: 'Kota stone & outdoor flooring',
    longDescription: 'Kota blue and green limestone for outdoor use — pathways, pool sides, steps. Durable and slip-resistant natural limestone slabs.',
    emoji: '🟫',
    color: 'amber',
    accentColor: '#C8962E',
    image: '/natural-stone-hero.png',
    productCount: 3,
    route: '/kota-stone',
    groupName: 'Natural Stone',
  },
  {
    id: 'cladding-stone',
    slug: 'cladding-stone',
    name: 'Natural Cladding Stone',
    description: 'Wall cladding & roofing slate',
    longDescription: 'Premium natural cladding stone and slate varieties for feature walls, exterior elevations, and rustic roofing slate applications.',
    emoji: '🧱',
    color: 'amber',
    accentColor: '#C8962E',
    image: '/natural-stone-hero.png',
    productCount: 0,
    route: '/category/cladding-stone',
    groupName: 'Natural Stone',
  },
  {
    id: 'adhesives-chemicals',
    slug: 'adhesives-chemicals',
    name: 'Chemicals',
    description: 'Tile adhesives & construction chemicals',
    longDescription: 'High-performance polymer modified cement adhesives, white adhesives, epoxy grouts, and waterproofing chemicals by Roff (Pidilite), Laticrete, and Weber.',
    emoji: '🧪',
    color: 'emerald',
    accentColor: '#059669',
    image: '/adhesives-hero.png',
    productCount: 7,
    route: '/adhesives-chemicals',
    groupName: 'Chemicals',
  },
];

export const getCategoryById = (id: string): Category | undefined =>
  categories.find(c => c.id === id);

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find(c => c.slug === slug);
