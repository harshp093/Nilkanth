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
