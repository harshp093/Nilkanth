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
  },
  {
    id: 'stone',
    slug: 'stone',
    name: 'Stone',
    description: 'Natural & artificial engineered stones',
    longDescription: 'Premium natural stone varieties and engineered quartz slabs. High performance, elegant surfaces for countertops, kitchens, vanities, and wall cladding.',
    emoji: '🪨',
    color: 'amber',
    accentColor: '#C8962E',
    image: '/artificial-stone-hero.png',
    productCount: 2,
    route: '/stone',
  },
  {
    id: 'kota-others',
    slug: 'kota-others',
    name: 'Kota & Others',
    description: 'Kota stone, slate & natural stone',
    longDescription: 'Kota blue and green limestone for outdoor use — pathways, pool sides, steps. Also natural roofing slate and other specialty stones.',
    emoji: '🟫',
    color: 'amber',
    accentColor: '#C8962E',
    image: '/natural-stone-hero.png',
    productCount: 3,
    route: '/kota-stone',
  },
  {
    id: 'sanitary-ware',
    slug: 'sanitary-ware',
    name: 'Sanitary Ware',
    description: 'Complete bathroom solutions',
    longDescription: 'Water closets, wash basins, faucets, shower systems, bathtubs and accessories. Everything for your perfect bathroom from trusted brands.',
    emoji: '🚿',
    color: 'cyan',
    accentColor: '#0E7490',
    image: '/tile-hero.png',
    productCount: 8,
    route: '/sanitary-ware',
  },
  {
    id: 'tiles-catalog',
    slug: 'tiles-catalog',
    name: 'Tiles Catalog',
    description: 'ColorTiles PDF catalogs',
    longDescription: 'Browse our complete ColorTiles collection — floor tiles, wall tiles, bathroom tiles, designer tiles and vitrified tiles. Download PDF catalogs.',
    emoji: '🔲',
    color: 'violet',
    accentColor: '#7C3AED',
    image: '/tile-hero.png',
    productCount: 12,
    route: '/tiles-catalog',
  },
  {
    id: 'adhesives-chemicals',
    slug: 'adhesives-chemicals',
    name: 'Adhesives & Chemicals',
    description: 'Tile adhesives, stone fixing & construction chemicals',
    longDescription: 'High-performance polymer modified cement adhesives, white adhesives, epoxy grouts, and waterproofing chemicals by Roff (Pidilite), Laticrete, and Weber.',
    emoji: '🧪',
    color: 'emerald',
    accentColor: '#059669',
    image: '/adhesives-hero.png',
    productCount: 7,
    route: '/adhesives-chemicals',
  },
];

export const getCategoryById = (id: string): Category | undefined =>
  categories.find(c => c.id === id);

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find(c => c.slug === slug);
