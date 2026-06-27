export type Category = 'marble' | 'vitrified' | 'ceramic' | 'outdoor' | 'adhesive';
export type Finish = 'polished' | 'matt' | 'satin' | 'structured' | 'glossy';

export interface Brand {
  id: string;
  name: string;
  category: string;
  colorAccent: string;
  origin: string;
  priority: number;
  productCount: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  category: Category;
  finish: Finish;
  dimensions: string;
  thickness: string;
  usage: string[];
  imageUrl: string;
  isFeatured: boolean;
  isAvailable: boolean;
  origin?: string;
  description?: string;
}

export type MarbleType = {
  id: string;
  name: string;
  origin: string;
  color: string;
  description: string;
  imageUrl: string;
  finish: string;
  tag: string;
};

export const marbleTypes: MarbleType[] = [
  {
    id: 'carrara',
    name: 'Carrara White',
    origin: 'Italy',
    color: '#F5F5F0',
    description: 'Soft white or bluish-grey base with delicate feathery grey veining. A timeless classic from the Carrara region.',
    imageUrl: '/marble-carrara.png',
    finish: 'Polished',
    tag: 'Classic',
  },
  {
    id: 'calacatta',
    name: 'Calacatta Gold',
    origin: 'Italy',
    color: '#F8F4E8',
    description: 'Bright pure white background with bold dramatic gold and grey veins. Rarer and more luxurious than Carrara.',
    imageUrl: '/marble-calacatta.png',
    finish: 'Polished',
    tag: 'Luxury',
  },
  {
    id: 'statuario',
    name: 'Statuario',
    origin: 'Italy',
    color: '#FAFAFA',
    description: 'Highly prized for its bright white field and striking dark grey or gold veins. Used in the most prestigious projects.',
    imageUrl: '/marble-statuario.png',
    finish: 'Polished',
    tag: 'Prestige',
  },
  {
    id: 'nero-marquina',
    name: 'Nero Marquina',
    origin: 'Spain',
    color: '#1A1A1A',
    description: 'Deep black background with crisp fine white veins. The most dramatic of all black marbles.',
    imageUrl: '/marble-nero.png',
    finish: 'Polished',
    tag: 'Bold',
  },
  {
    id: 'portoro',
    name: 'Portoro Gold',
    origin: 'Italy',
    color: '#0D0D0D',
    description: 'Intense black decorated with dramatic gold and grey veins. The ultimate luxury statement stone.',
    imageUrl: '/marble-portoro.png',
    finish: 'Polished',
    tag: 'Exclusive',
  },
  {
    id: 'emperador',
    name: 'Emperador Dark',
    origin: 'Spain',
    color: '#3D2B1F',
    description: 'Rich earthy brown tones accented with dramatic white or gold veining. Adds warmth and sophistication.',
    imageUrl: '/marble-emperador.png',
    finish: 'Polished',
    tag: 'Warm',
  },
  {
    id: 'crema-marfil',
    name: 'Crema Marfil',
    origin: 'Spain',
    color: '#F0E6C8',
    description: 'Classic beige/cream marble with delicate veining. Known for creating a warm, inviting atmosphere.',
    imageUrl: '/marble-crema.png',
    finish: 'Polished',
    tag: 'Inviting',
  },
  {
    id: 'verde-guatemala',
    name: 'Verde Guatemala',
    origin: 'Guatemala',
    color: '#2D5A27',
    description: 'Intense lush green with dramatic white veining. A rare and striking natural stone for bold interiors.',
    imageUrl: '/marble-verde.png',
    finish: 'Polished',
    tag: 'Rare',
  },
  {
    id: 'rosso-verona',
    name: 'Rosso Verona',
    origin: 'Italy',
    color: '#8B2020',
    description: 'Rich dramatic red-rose tones with white and cream veining. A bold choice for luxury statement designs.',
    imageUrl: '/marble-rosso.png',
    finish: 'Polished',
    tag: 'Statement',
  },
  {
    id: 'onyx-white',
    name: 'White Onyx',
    origin: 'Iran',
    color: '#FFF8F0',
    description: 'Translucent creamy white with flowing banded patterns. Creates a glowing backlit effect — truly magical.',
    imageUrl: '/marble-onyx.png',
    finish: 'Polished',
    tag: 'Translucent',
  },
  {
    id: 'makrana',
    name: 'Makrana White',
    origin: 'India',
    color: '#FFFFFF',
    description: 'World-renowned pure white Indian marble famous for its exceptional quality and historical monuments.',
    imageUrl: '/marble-makrana.png',
    finish: 'Polished',
    tag: 'Heritage',
  },
  {
    id: 'fantasy-brown',
    name: 'Fantasy Brown',
    origin: 'India',
    color: '#C4A882',
    description: 'Beautiful blend of brown and beige tones with flowing white and cream veins. A warm, natural choice.',
    imageUrl: '/marble-fantasy.png',
    finish: 'Polished',
    tag: 'Natural',
  },
];

export const brands: Brand[] = [
  { id: 'kalingastone', name: 'KalingaStone', category: 'Italian Design Stone', colorAccent: '#C0392B', origin: 'Italy', priority: 1, productCount: 120, description: 'Premium engineered marble and quartz from Italy.' },
  { id: 'donato', name: 'Donato', category: 'Multi Charged Vitrified Tiles', colorAccent: '#1B6CA8', origin: 'India', priority: 2, productCount: 85, description: 'High-quality multi-charged vitrified tiles.' },
  { id: 'colortile', name: 'Colortile', category: 'Ceramics & Innovation', colorAccent: '#1A1A1A', origin: 'India', priority: 3, productCount: 150, description: 'Innovative ceramic solutions for modern spaces.' },
  { id: 'latigres', name: 'Latigres', category: 'Tiles Studio', colorAccent: '#2E9E8A', origin: 'India', priority: 4, productCount: 90, description: 'Creative tile designs from Latigres studio.' },
  { id: 'marfil', name: 'Marfil Tiles', category: 'Premium Tiles', colorAccent: '#2C2C2A', origin: 'India', priority: 5, productCount: 65, description: 'Luxurious premium tiles for elegant interiors.' },
  { id: 'roff', name: 'Roff (Pidilite)', category: 'Tile & Stone Fixing', colorAccent: '#6DBE45', origin: 'India', priority: 6, productCount: 15, description: 'Reliable tile and stone fixing solutions.' },
];

export const products: Product[] = [
  // Kalingastone — Marble
  {
    id: 'p-1',
    name: 'Statuario Classico',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall'],
    imageUrl: '/marble-statuario.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'Italy',
    description: 'Bright white field with striking dark grey veins — the pinnacle of Italian marble prestige.',
  },
  {
    id: 'p-2',
    name: 'Nero Marquina Slab',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall', 'bathroom'],
    imageUrl: '/marble-nero.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'Spain',
    description: 'Deep black marble with crisp white veins — drama and elegance in one stone.',
  },
  {
    id: 'p-3',
    name: 'Calacatta Gold Slab',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall', 'countertop'],
    imageUrl: '/marble-calacatta.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'Italy',
    description: 'Pure white background with bold gold veins — the most luxurious Italian marble.',
  },
  {
    id: 'p-4',
    name: 'Carrara Classic',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall', 'bathroom'],
    imageUrl: '/marble-carrara.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'Italy',
    description: 'The timeless Carrara white marble — delicate feathery grey veining on a soft white canvas.',
  },
  {
    id: 'p-5',
    name: 'Portoro Luxe',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['wall', 'feature'],
    imageUrl: '/marble-portoro.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'Italy',
    description: 'Intense black with dramatic gold veining — an exclusive statement material for luxury projects.',
  },
  {
    id: 'p-6',
    name: 'Emperador Dark',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall'],
    imageUrl: '/marble-emperador.png',
    isFeatured: false,
    isAvailable: true,
    origin: 'Spain',
    description: 'Rich brown marble with dramatic white veining — warmth and sophistication in one slab.',
  },
  {
    id: 'p-7',
    name: 'Verde Guatemala',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['wall', 'feature'],
    imageUrl: '/marble-verde.png',
    isFeatured: false,
    isAvailable: true,
    origin: 'Guatemala',
    description: 'Lush green marble with striking white veins — a rare gem for bold interior statements.',
  },
  {
    id: 'p-8',
    name: 'Crema Marfil Classic',
    brandId: 'marfil',
    category: 'marble',
    finish: 'polished',
    dimensions: '1200x600 mm',
    thickness: '15 mm',
    usage: ['floor', 'wall'],
    imageUrl: '/marble-crema.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'Spain',
    description: 'Warm beige/cream marble with delicate veining — creates an inviting, sophisticated atmosphere.',
  },
  {
    id: 'p-9',
    name: 'Rosso Verona',
    brandId: 'marfil',
    category: 'marble',
    finish: 'polished',
    dimensions: '1200x600 mm',
    thickness: '15 mm',
    usage: ['wall', 'feature', 'floor'],
    imageUrl: '/marble-rosso.png',
    isFeatured: false,
    isAvailable: true,
    origin: 'Italy',
    description: 'Rich red-rose Italian marble — makes a bold statement in any luxury interior.',
  },
  {
    id: 'p-10',
    name: 'White Onyx Backlit',
    brandId: 'marfil',
    category: 'marble',
    finish: 'polished',
    dimensions: '2400x1200 mm',
    thickness: '18 mm',
    usage: ['wall', 'feature'],
    imageUrl: '/marble-onyx.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'Iran',
    description: 'Translucent white onyx with flowing bands — creates a magical glowing backlit effect.',
  },
  {
    id: 'p-11',
    name: 'Makrana Heritage',
    brandId: 'marfil',
    category: 'marble',
    finish: 'polished',
    dimensions: '1200x600 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall', 'outdoor'],
    imageUrl: '/marble-makrana.png',
    isFeatured: false,
    isAvailable: true,
    origin: 'India',
    description: 'The iconic Indian marble that built the Taj Mahal — pure white, exceptional quality.',
  },
  {
    id: 'p-12',
    name: 'Fantasy Brown Natural',
    brandId: 'marfil',
    category: 'marble',
    finish: 'polished',
    dimensions: '1200x600 mm',
    thickness: '15 mm',
    usage: ['floor', 'wall'],
    imageUrl: '/marble-fantasy.png',
    isFeatured: true,
    isAvailable: true,
    origin: 'India',
    description: 'Beautiful blend of brown and beige with flowing white veins — natural warmth for any space.',
  },
  // Donato — Vitrified
  {
    id: 'p-13',
    name: 'Onyx Pearl Vitrified',
    brandId: 'donato',
    category: 'vitrified',
    finish: 'glossy',
    dimensions: '800x1600 mm',
    thickness: '9 mm',
    usage: ['floor'],
    imageUrl: 'https://images.unsplash.com/photo-1546252934-8c8137cd88ee?auto=format&fit=crop&q=80',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'p-14',
    name: 'Terrazzo Bianco',
    brandId: 'donato',
    category: 'vitrified',
    finish: 'matt',
    dimensions: '600x600 mm',
    thickness: '10 mm',
    usage: ['floor', 'outdoor'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    isFeatured: true,
    isAvailable: true,
  },
  // Colortile — Ceramic
  {
    id: 'p-15',
    name: 'Cementum Grey',
    brandId: 'colortile',
    category: 'ceramic',
    finish: 'matt',
    dimensions: '600x1200 mm',
    thickness: '10 mm',
    usage: ['floor', 'outdoor'],
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80',
    isFeatured: false,
    isAvailable: true,
  },
  // Latigres — Ceramic
  {
    id: 'p-16',
    name: 'Woodland Oak',
    brandId: 'latigres',
    category: 'ceramic',
    finish: 'satin',
    dimensions: '200x1200 mm',
    thickness: '9 mm',
    usage: ['floor', 'wall'],
    imageUrl: 'https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&q=80',
    isFeatured: true,
    isAvailable: true,
  },
  // Roff — Adhesive
  {
    id: 'p-17',
    name: 'Roff Master Fix',
    brandId: 'roff',
    category: 'adhesive',
    finish: 'matt',
    dimensions: '20 Kg',
    thickness: 'N/A',
    usage: ['floor', 'wall', 'outdoor'],
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80',
    isFeatured: false,
    isAvailable: true,
  },
];

export const getBrands = () => brands.sort((a, b) => a.priority - b.priority);
export const getBrandById = (id: string) => brands.find(b => b.id === id);
export const getProducts = () => products;
export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getProductsByBrand = (brandId: string) => products.filter(p => p.brandId === brandId);
export const getProductById = (id: string) => products.find(p => p.id === id);
export const getMarbleTypes = () => marbleTypes;

// ── Tiles ────────────────────────────────────────────────────────────────
export interface TileVariant {
  id: string;
  name: string;
  colorDescription: string;
  imageHighGloss: string;
  imageHighGlossSinker?: string;
  swatchColor: string;
  surfaces: string[];
  patterns: string;
  priceLabel: string;
  isFeatured?: boolean;
}

export interface TileCollection {
  id: string;
  brandId: string;
  name: string;
  tagline: string;
  description: string;
  size: string;
  thickness?: string;
  finish: string[];
  coverImage: string;
  variants: TileVariant[];
  tag?: string;
}

const tileCollections: TileCollection[] = [
  {
    id: 'genesis',
    brandId: 'colortile',
    name: 'Genesis Collection',
    tagline: 'GVT / PGVT',
    description: 'A revolutionary premium high-gloss tile collection mimicking the finest global stones with cutting edge sinker technology.',
    size: '600x1200mm',
    thickness: '9mm',
    finish: ['High Gloss', 'High Gloss Sinker'],
    coverImage: '/tile-hero.png',
    tag: 'New Arrival',
    variants: [
      { id: 'patagonia-cool', name: 'Patagonia Cool', colorDescription: 'Cool Grey & White', swatchColor: '#E2E8F0', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', isFeatured: true },
      { id: 'patagonia-warm', name: 'Patagonia Warm', colorDescription: 'Warm Beige & Gold', swatchColor: '#FDF6E3', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1596207198758-a89c3ecda842?auto=format&fit=crop&q=80' },
      { id: 'diamond-jade', name: 'Diamond Grain Jade', colorDescription: 'Jade Green', swatchColor: '#A7F3D0', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80' },
      { id: 'diamond-grey', name: 'Diamond Grain Grey', colorDescription: 'Silver Grey', swatchColor: '#CBD5E1', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1598928506311-c55dd713b1f5?auto=format&fit=crop&q=80' },
      { id: 'midnight-nero', name: 'Midnight Stone Nero', colorDescription: 'Deep Black', swatchColor: '#1E293B', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 2', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', isFeatured: true },
      { id: 'neo-teal', name: 'Neo Amazonite Teal', colorDescription: 'Teal Blue', swatchColor: '#14B8A6', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1596207198758-a89c3ecda842?auto=format&fit=crop&q=80' },
      { id: 'neo-cherry', name: 'Neo Amazonite Cherry', colorDescription: 'Cherry Red', swatchColor: '#F43F5E', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80' },
      { id: 'fineflow-rust', name: 'Fineflow Rust', colorDescription: 'Rust Orange', swatchColor: '#EA580C', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1598928506311-c55dd713b1f5?auto=format&fit=crop&q=80' },
      { id: 'fineflow-aqua', name: 'Fineflow Aqua', colorDescription: 'Aqua Blue', swatchColor: '#0EA5E9', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80' },
      { id: 'ember-natural', name: 'Ember Natural', colorDescription: 'Earthy Brown', swatchColor: '#B45309', surfaces: ['High Gloss', 'High Gloss Sinker'], patterns: 'Random 8', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1596207198758-a89c3ecda842?auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'aurora',
    brandId: 'donato',
    name: 'Aurora Series',
    tagline: 'Premium Slab',
    description: 'Extra large slabs for seamless living spaces.',
    size: '800x1600mm',
    thickness: '9mm',
    finish: ['Polished', 'Matt'],
    coverImage: 'https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&q=80',
    tag: 'Premium',
    variants: [
      { id: 'aurora-1', name: 'Aurora Bianco', colorDescription: 'White', swatchColor: '#FFFFFF', surfaces: ['Polished'], patterns: 'Random 4', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80', isFeatured: true }
    ]
  },
  {
    id: 'woodland',
    brandId: 'latigres',
    name: 'Woodland Collection',
    tagline: 'Wood Look',
    description: 'Natural wood aesthetics with the durability of porcelain.',
    size: '200x1200mm',
    thickness: '9mm',
    finish: ['Matt'],
    coverImage: 'https://images.unsplash.com/photo-1598928506311-c55dd713b1f5?auto=format&fit=crop&q=80',
    tag: 'Bestseller',
    variants: [
      { id: 'wood-1', name: 'Oak Natural', colorDescription: 'Light Oak', swatchColor: '#D4A373', surfaces: ['Matt'], patterns: 'Random 6', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 'royal',
    brandId: 'marfil',
    name: 'Royal Essence Series',
    tagline: 'Luxury Slabs',
    description: 'Massive format tiles for elite commercial spaces.',
    size: '1200x2400mm',
    thickness: '9mm',
    finish: ['High Gloss'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    tag: 'Exclusive',
    variants: [
      { id: 'royal-1', name: 'Royal Gold', colorDescription: 'Gold', swatchColor: '#FACC15', surfaces: ['High Gloss'], patterns: 'Random 3', priceLabel: 'Get Best Price', imageHighGloss: 'https://images.unsplash.com/photo-1596207198758-a89c3ecda842?auto=format&fit=crop&q=80', isFeatured: true }
    ]
  }
];

export const getTileCollections = () => tileCollections;
export const getTileCollectionById = (id: string) => tileCollections.find(c => c.id === id);


// ── Granite ─────────────────────────────────────────────────────────────
export type GraniteSubcategory = 'natural-stone' | 'artificial-stone';

export interface GraniteVariant {
  id: string;
  name: string;
  subcategory: GraniteSubcategory;
  origin: string;
  color: string;
  swatchColor: string;
  description: string;
  imageUrl: string;
  finishes: string[];
  thickness: string;
  sizes: string[];
  usage: string[];
  priceLabel: string;
  pricePerSqFt?: string;
  tag?: string;
}

const graniteVariants: GraniteVariant[] = [
  // Natural Stones
  {
    id: 'black-galaxy',
    name: 'Black Galaxy',
    subcategory: 'natural-stone',
    origin: 'India',
    color: 'Deep Black with Golden Flecks',
    swatchColor: '#1A1A1A',
    description: 'A highly durable and stain-resistant black granite with golden specks, perfect for countertops.',
    imageUrl: '/natural-stone-hero.png',
    finishes: ['Polished', 'Leathered'],
    thickness: '18mm - 20mm',
    sizes: ['10ft x 3ft', 'Custom'],
    usage: ['countertop', 'floor', 'wall'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 120–180/sq ft',
    tag: 'Bestseller'
  },
  {
    id: 'kashmir-white',
    name: 'Kashmir White',
    subcategory: 'natural-stone',
    origin: 'India',
    color: 'White & Grey',
    swatchColor: '#E2E8F0',
    description: 'Elegant white granite with subtle grey and garnet veining.',
    imageUrl: 'https://images.unsplash.com/photo-1596207198758-a89c3ecda842?auto=format&fit=crop&q=80',
    finishes: ['Polished'],
    thickness: '18mm',
    sizes: ['8ft x 3ft'],
    usage: ['countertop', 'floor'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 95–140/sq ft'
  },
  {
    id: 'tan-brown',
    name: 'Tan Brown',
    subcategory: 'natural-stone',
    origin: 'India',
    color: 'Brown & Black',
    swatchColor: '#8B4513',
    description: 'Dark brown background with black and red flecks, very popular globally.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
    finishes: ['Polished', 'Flamed'],
    thickness: '18mm',
    sizes: ['9ft x 3ft'],
    usage: ['outdoor', 'countertop'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 80–120/sq ft'
  },
  {
    id: 'absolute-black',
    name: 'Absolute Black',
    subcategory: 'natural-stone',
    origin: 'India',
    color: 'Solid Black',
    swatchColor: '#000000',
    description: 'Pure, pitch-black granite that offers a sleek, modern look.',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55dd713b1f5?auto=format&fit=crop&q=80',
    finishes: ['Polished', 'Honed', 'Leathered'],
    thickness: '20mm',
    sizes: ['10ft x 3ft'],
    usage: ['countertop', 'floor', 'bathroom'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 150–220/sq ft',
    tag: 'Premium'
  },
  // Artificial Stones
  {
    id: 'calacatta-quartz',
    name: 'Calacatta Quartz',
    subcategory: 'artificial-stone',
    origin: 'Engineered',
    color: 'White with Grey Veins',
    swatchColor: '#F8FAFC',
    description: 'Stunning artificial quartz designed to mimic the luxurious Calacatta marble with zero maintenance.',
    imageUrl: '/artificial-stone-hero.png',
    finishes: ['Polished'],
    thickness: '15mm - 20mm',
    sizes: ['10ft x 4ft', 'Jumbo'],
    usage: ['countertop', 'vanity', 'feature'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 250–400/sq ft',
    tag: 'Luxury'
  },
  {
    id: 'statuario-quartz',
    name: 'Statuario Quartz',
    subcategory: 'artificial-stone',
    origin: 'Engineered',
    color: 'White with Fine Veins',
    swatchColor: '#F1F5F9',
    description: 'Elegant white quartz with subtle, striking veins.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    finishes: ['Polished'],
    thickness: '20mm',
    sizes: ['10ft x 4ft'],
    usage: ['countertop', 'bathroom'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 280–450/sq ft'
  },
  {
    id: 'nero-black',
    name: 'Nero Black Quartz',
    subcategory: 'artificial-stone',
    origin: 'Engineered',
    color: 'Solid Black',
    swatchColor: '#171717',
    description: 'A deep, consistent black engineered stone that is highly resistant to stains and scratches.',
    imageUrl: 'https://images.unsplash.com/photo-1596207198758-a89c3ecda842?auto=format&fit=crop&q=80',
    finishes: ['Polished', 'Suede'],
    thickness: '20mm',
    sizes: ['10ft x 4ft'],
    usage: ['countertop', 'wall'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 200–350/sq ft'
  },
  {
    id: 'vanilla-beige',
    name: 'Vanilla Beige Quartz',
    subcategory: 'artificial-stone',
    origin: 'Engineered',
    color: 'Beige',
    swatchColor: '#FEF3C7',
    description: 'Warm, neutral tones perfect for creating an inviting, airy space.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
    finishes: ['Polished'],
    thickness: '15mm',
    sizes: ['10ft x 4ft'],
    usage: ['countertop', 'floor'],
    priceLabel: 'Get Best Price',
    pricePerSqFt: '₹ 180–300/sq ft'
  }
];

export const getGraniteVariants = () => graniteVariants;
export const getGraniteById = (id: string) => graniteVariants.find(g => g.id === id);
