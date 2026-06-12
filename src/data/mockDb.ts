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
}

export const brands: Brand[] = [
  { id: 'kalingastone', name: 'KalingaStone', category: 'Italian Design Stone', colorAccent: '#C0392B', origin: 'Italy', priority: 1, productCount: 120, description: 'Premium engineered marble and quartz from Italy.' },
  { id: 'donato', name: 'Donato', category: 'Multi Charged Vitrified Tiles', colorAccent: '#1B6CA8', origin: 'India', priority: 2, productCount: 85, description: 'High-quality multi-charged vitrified tiles.' },
  { id: 'colortile', name: 'Colortile', category: 'Ceramics & Innovation', colorAccent: '#1A1A1A', origin: 'India', priority: 3, productCount: 150, description: 'Innovative ceramic solutions for modern spaces.' },
  { id: 'latigres', name: 'Latigres', category: 'Tiles Studio', colorAccent: '#2E9E8A', origin: 'India', priority: 4, productCount: 90, description: 'Creative tile designs from Latigres studio.' },
  { id: 'marfil', name: 'Marfil Tiles', category: 'Premium Tiles', colorAccent: '#2C2C2A', origin: 'India', priority: 5, productCount: 65, description: 'Luxurious premium tiles for elegant interiors.' },
  { id: 'roff', name: 'Roff (Pidilite)', category: 'Tile & Stone Fixing', colorAccent: '#6DBE45', origin: 'India', priority: 6, productCount: 15, description: 'Reliable tile and stone fixing solutions.' },
];

export const products: Product[] = [
  {
    id: 'p-1',
    name: 'Statuario Classico',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall'],
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'p-2',
    name: 'Nero Marquina',
    brandId: 'kalingastone',
    category: 'marble',
    finish: 'polished',
    dimensions: '3040x1240 mm',
    thickness: '18 mm',
    usage: ['floor', 'wall', 'bathroom'],
    imageUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850d0a1?auto=format&fit=crop&q=80',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'p-3',
    name: 'Onyx Pearl',
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
    id: 'p-4',
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
  {
    id: 'p-5',
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
  {
    id: 'p-6',
    name: 'Calacatta Gold',
    brandId: 'marfil',
    category: 'vitrified',
    finish: 'polished',
    dimensions: '1200x1200 mm',
    thickness: '10 mm',
    usage: ['floor', 'wall'],
    imageUrl: 'https://images.unsplash.com/photo-1584804561081-36ba906f3590?auto=format&fit=crop&q=80',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'p-7',
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
  {
    id: 'p-8',
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
  }
];

export const getBrands = () => brands.sort((a, b) => a.priority - b.priority);
export const getBrandById = (id: string) => brands.find(b => b.id === id);
export const getProducts = () => products;
export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getProductsByBrand = (brandId: string) => products.filter(p => p.brandId === brandId);
export const getProductById = (id: string) => products.find(p => p.id === id);
