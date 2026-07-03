// ═══════════════════════════════════════════════════════════════
// NILKANTH MARBLE — Product Data
// Structure matches Supabase schema for easy backend migration
// ═══════════════════════════════════════════════════════════════

export type ProductCategory =
  | 'marble'
  | 'granite'
  | 'kota-stone'
  | 'cladding-stone'
  | 'adhesives-chemicals';

export type KotaSubcategory = 'kota-stone';
export type CladdingSubcategory = 'roofing-slate' | 'wall-cladding';

export interface NProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: ProductCategory;
  subcategory?: string;
  priceRange?: string;
  origin?: string;
  thicknessOptions?: string[];
  sizeOptions?: string[];
  finishOptions?: string[];
  colors?: string[];       // Hex codes or color names
  colorNames?: string[];   // Display names for colors
  application?: string[];
  brand?: string;
  modelNumber?: string;
  material?: string;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];        // First image = primary
  viewCount?: number;
  isCatalog?: boolean;
  pdfUrl?: string;
}

// ─── MARBLE PRODUCTS ─────────────────────────────────────────
const marbleProducts: NProduct[] = [
  {
    id: 'p-1',
    slug: 'carrara-white-marble',
    name: 'Carrara White Marble',
    description: 'Soft white base with delicate grey feathery veining. A timeless classic from the Carrara mountains of Italy. Perfect for flooring and wall cladding in luxury homes and hotels.',
    category: 'marble',
    priceRange: '₹85 – ₹180 per sq.ft',
    origin: 'Italy',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', '4×4 ft', 'Custom'],
    finishOptions: ['Polished', 'Honed', 'Brushed'],
    colors: ['#F5F5F0', '#E8E8E3'],
    colorNames: ['White', 'Light Grey'],
    application: ['Flooring', 'Wall Cladding', 'Counter Top', 'Staircase'],
    isFeatured: true,
    isActive: true,
    images: ['/marble-carrara.png'],
  },
  {
    id: 'p-2',
    slug: 'calacatta-gold-marble',
    name: 'Calacatta Gold Marble',
    description: 'Bright pure white background with bold dramatic gold and grey veins. Rarer and more luxurious than Carrara. The signature of prestige interiors worldwide.',
    category: 'marble',
    priceRange: '₹120 – ₹280 per sq.ft',
    origin: 'Italy',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', '4×4 ft', 'Custom'],
    finishOptions: ['Polished', 'Honed'],
    colors: ['#F8F4E8', '#D4AF37'],
    colorNames: ['Ivory White', 'Gold Vein'],
    application: ['Flooring', 'Wall Cladding', 'Counter Top', 'Bathroom'],
    isFeatured: true,
    isActive: true,
    images: ['/marble-calacatta.png'],
  },
  {
    id: 'p-3',
    slug: 'statuario-marble',
    name: 'Statuario Marble',
    description: 'Highly prized for its bright white field and striking dark grey or gold veins. Used in the most prestigious architectural projects across the globe.',
    category: 'marble',
    priceRange: '₹100 – ₹250 per sq.ft',
    origin: 'Italy',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', 'Custom'],
    finishOptions: ['Polished', 'Matte'],
    colors: ['#FAFAFA', '#666666'],
    colorNames: ['Pure White', 'Grey Vein'],
    application: ['Flooring', 'Wall Cladding', 'Elevation', 'Pool Side'],
    isFeatured: true,
    isActive: true,
    images: ['/marble-statuario.png'],
  },
  {
    id: 'p-4',
    slug: 'nero-marquina-black-marble',
    name: 'Nero Marquina Black Marble',
    description: 'Deep jet-black background with crisp fine white veins. The most dramatic of all black marbles. Makes a bold statement in any space.',
    category: 'marble',
    priceRange: '₹90 – ₹200 per sq.ft',
    origin: 'Spain',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', '4×4 ft', 'Custom'],
    finishOptions: ['Polished', 'Honed'],
    colors: ['#1A1A1A', '#FFFFFF'],
    colorNames: ['Jet Black', 'White Vein'],
    application: ['Flooring', 'Wall Cladding', 'Bathroom', 'Counter Top'],
    isFeatured: true,
    isActive: true,
    images: ['/marble-nero.png'],
  },
  {
    id: 'p-5',
    slug: 'portoro-gold-marble',
    name: 'Portoro Gold Marble',
    description: 'Intense black base decorated with dramatic gold and grey veins. The ultimate luxury statement stone for high-end residential and commercial spaces.',
    category: 'marble',
    priceRange: '₹150 – ₹320 per sq.ft',
    origin: 'Italy',
    thicknessOptions: ['18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', 'Custom'],
    finishOptions: ['Polished'],
    colors: ['#0D0D0D', '#D4AF37'],
    colorNames: ['Black', 'Gold Vein'],
    application: ['Wall Cladding', 'Counter Top', 'Bathroom', 'Elevation'],
    isFeatured: false,
    isActive: true,
    images: ['/marble-portoro.png'],
  },
  {
    id: 'p-6',
    slug: 'emperador-dark-marble',
    name: 'Emperador Dark Marble',
    description: 'Rich earthy brown tones accented with dramatic white or gold veining. Adds warmth and sophisticated elegance to any interior.',
    category: 'marble',
    priceRange: '₹75 – ₹160 per sq.ft',
    origin: 'Spain',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', 'Custom'],
    finishOptions: ['Polished', 'Honed'],
    colors: ['#3D2B1F', '#B8860B'],
    colorNames: ['Dark Brown', 'Gold Vein'],
    application: ['Flooring', 'Wall Cladding', 'Counter Top'],
    isFeatured: false,
    isActive: true,
    images: ['/marble-emperador.png'],
  },
  {
    id: 'p-7',
    slug: 'crema-marfil-marble',
    name: 'Crema Marfil Marble',
    description: 'Creamy beige tones with subtle golden veining. One of the most sought-after marbles for creating warm, inviting interiors.',
    category: 'marble',
    priceRange: '₹70 – ₹150 per sq.ft',
    origin: 'Spain',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', '4×4 ft', 'Custom'],
    finishOptions: ['Polished', 'Honed', 'Brushed'],
    colors: ['#F5E6C8', '#D4B896'],
    colorNames: ['Cream', 'Beige'],
    application: ['Flooring', 'Wall Cladding', 'Steps', 'Pool Side'],
    isFeatured: true,
    isActive: true,
    images: ['/marble-crema.png'],
  },
  {
    id: 'p-8',
    slug: 'makrana-white-marble',
    name: 'Makrana White Marble',
    description: 'India\'s finest white marble from Rajasthan — the same stone used in the Taj Mahal. Pure white with a silky sheen and subtle translucency.',
    category: 'marble',
    priceRange: '₹45 – ₹120 per sq.ft',
    origin: 'Rajasthan, India',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', '4×4 ft', 'Custom'],
    finishOptions: ['Polished', 'Honed'],
    colors: ['#FFFFFF', '#F8F8F6'],
    colorNames: ['Pure White', 'Milky White'],
    application: ['Flooring', 'Wall Cladding', 'Statues', 'Counter Top'],
    isFeatured: true,
    isActive: true,
    images: ['/marble-makrana.png'],
  },
];

// ─── GRANITE PRODUCTS ────────────────────────────────────────
const graniteProducts: NProduct[] = [
  {
    id: 'g-1',
    slug: 'black-galaxy-granite',
    name: 'Black Galaxy Granite',
    description: 'Deep black base with shimmering golden specks — one of the most popular granites globally. Quarried exclusively in Andhra Pradesh, India.',
    category: 'granite',
    priceRange: '₹55 – ₹130 per sq.ft',
    origin: 'Andhra Pradesh, India',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', '4×4 ft', 'Custom'],
    finishOptions: ['Polished', 'Flamed', 'Brushed'],
    colors: ['#1A1A1A', '#D4AF37'],
    colorNames: ['Black', 'Gold Flecks'],
    application: ['Flooring', 'Counter Top', 'Wall Cladding', 'Steps'],
    isFeatured: true,
    isActive: true,
    images: ['/natural-stone-hero.png'],
  },
  {
    id: 'g-2',
    slug: 'kashmir-white-granite',
    name: 'Kashmir White Granite',
    description: 'Light grey/white base with black spots and burgundy garnets. A versatile and elegant granite for both residential and commercial use.',
    category: 'granite',
    priceRange: '₹60 – ₹140 per sq.ft',
    origin: 'Tamil Nadu, India',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', 'Custom'],
    finishOptions: ['Polished', 'Honed'],
    colors: ['#E8E8E0', '#4A4A4A'],
    colorNames: ['White/Grey', 'Black Spots'],
    application: ['Counter Top', 'Flooring', 'Wall Cladding'],
    isFeatured: true,
    isActive: true,
    images: ['/natural-stone-hero.png'],
  },
  {
    id: 'g-3',
    slug: 'tan-brown-granite',
    name: 'Tan Brown Granite',
    description: 'Warm brown base with dark brown and black crystals and burgundy clusters. A classic choice for kitchen countertops and bathroom vanities.',
    category: 'granite',
    priceRange: '₹50 – ₹120 per sq.ft',
    origin: 'Andhra Pradesh, India',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', 'Custom'],
    finishOptions: ['Polished', 'Flamed'],
    colors: ['#6B4226', '#3D2B1F'],
    colorNames: ['Brown', 'Dark Brown'],
    application: ['Counter Top', 'Flooring', 'Steps'],
    isFeatured: false,
    isActive: true,
    images: ['/natural-stone-hero.png'],
  },
  {
    id: 'g-4',
    slug: 'absolute-black-granite',
    name: 'Absolute Black Granite',
    description: 'Uniform jet-black granite with no visible veining. Perfect for contemporary minimalist designs and sleek kitchen countertops.',
    category: 'granite',
    priceRange: '₹65 – ₹150 per sq.ft',
    origin: 'Karnataka, India',
    thicknessOptions: ['16mm', '18mm', '20mm'],
    sizeOptions: ['2×2 ft', '4×2 ft', '4×4 ft', 'Custom'],
    finishOptions: ['Polished', 'Flamed', 'Brushed'],
    colors: ['#0A0A0A'],
    colorNames: ['Pure Black'],
    application: ['Counter Top', 'Flooring', 'Wall Cladding', 'Pool Side'],
    isFeatured: true,
    isActive: true,
    images: ['/natural-stone-hero.png'],
  },
];

// ─── STONE PRODUCTS ──────────────────────────────────────────
const stoneProducts: NProduct[] = [
  {
    id: 'g-5',
    slug: 'calacatta-artificial-stone',
    name: 'Calacatta Engineered Quartz',
    description: 'Engineered quartz with Calacatta marble appearance — non-porous, stain-proof, and consistent colour. Zero maintenance. Perfect for busy kitchens.',
    category: 'granite', // Map to granite as fallback, but set inactive
    subcategory: 'artificial-stone',
    priceRange: '₹80 – ₹200 per sq.ft',
    origin: 'Engineered',
    thicknessOptions: ['18mm', '20mm'],
    sizeOptions: ['Slab: 3200×1600mm', '4×2 ft', 'Custom'],
    finishOptions: ['Polished', 'Matte'],
    colors: ['#F8F4E8', '#888888'],
    colorNames: ['White', 'Grey Vein'],
    application: ['Counter Top', 'Kitchen Slab', 'Bathroom Vanity'],
    isFeatured: true,
    isActive: false, // Inactive since Artificial Stone is PDF-only
    images: ['/artificial-stone-hero.png'],
  },
  {
    id: 'g-6',
    slug: 'statuario-artificial-stone',
    name: 'Statuario Engineered Quartz',
    description: 'Statuario look engineered quartz with ultra-consistent white base and fine grey veining. Scratch-resistant, heat-resistant and completely non-porous.',
    category: 'granite', // Map to granite as fallback, but set inactive
    subcategory: 'artificial-stone',
    priceRange: '₹90 – ₹220 per sq.ft',
    origin: 'Engineered',
    thicknessOptions: ['18mm', '20mm'],
    sizeOptions: ['Slab: 3200×1600mm', 'Custom'],
    finishOptions: ['Polished'],
    colors: ['#FAFAFA', '#555555'],
    colorNames: ['Pure White', 'Grey Vein'],
    application: ['Counter Top', 'Kitchen Slab', 'Bathroom Vanity'],
    isFeatured: false,
    isActive: false, // Inactive since Artificial Stone is PDF-only
    images: ['/artificial-stone-hero.png'],
  },
];

// ─── KOTA & OTHERS ───────────────────────────────────────────
const kotaProducts: NProduct[] = [
  {
    id: 'k-1',
    slug: 'kota-blue-stone',
    name: 'Kota Blue Stone',
    description: 'Natural fine-grained limestone from Kota, Rajasthan. Blue-grey colour with excellent durability for outdoor and commercial applications. Non-slip surface.',
    category: 'kota-stone',
    subcategory: 'kota-stone',
    priceRange: '₹25 – ₹55 per sq.ft',
    origin: 'Kota, Rajasthan',
    thicknessOptions: ['18mm', '20mm', '25mm'],
    sizeOptions: ['Custom cut', '2×2 ft', '2×1 ft'],
    finishOptions: ['Natural', 'Machine Cut', 'Polished'],
    colors: ['#5B8BB0', '#4A7090'],
    colorNames: ['Blue Grey', 'Dark Blue'],
    application: ['Flooring', 'Steps', 'Pool Side', 'Driveway', 'Outdoor'],
    isFeatured: true,
    isActive: true,
    images: ['/natural-stone-hero.png'],
  },
  {
    id: 'k-2',
    slug: 'kota-green-stone',
    name: 'Kota Green Stone',
    description: 'Green-toned natural limestone from Kota. Harder than blue variety, ideal for areas with heavy foot traffic. Perfect for gardens, paths and commercial spaces.',
    category: 'kota-stone',
    subcategory: 'kota-stone',
    priceRange: '₹28 – ₹60 per sq.ft',
    origin: 'Kota, Rajasthan',
    thicknessOptions: ['18mm', '20mm', '25mm'],
    sizeOptions: ['Custom cut', '2×2 ft', '2×1 ft'],
    finishOptions: ['Natural', 'Machine Cut', 'Polished'],
    colors: ['#4A7A5A', '#3D6B4E'],
    colorNames: ['Green', 'Dark Green'],
    application: ['Flooring', 'Steps', 'Pool Side', 'Outdoor', 'Garden'],
    isFeatured: false,
    isActive: true,
    images: ['/natural-stone-hero.png'],
  },
  {
    id: 'k-3',
    slug: 'roofing-slate',
    name: 'Natural Roofing Slate',
    description: 'Premium natural slate for roofing, cladding and landscaping. Available in charcoal, rustic green and multicolour varieties. Exceptionally durable.',
    category: 'cladding-stone',
    subcategory: 'roofing-slate',
    priceRange: '₹35 – ₹80 per sq.ft',
    origin: 'Himachal Pradesh, India',
    thicknessOptions: ['6mm', '8mm', '10mm'],
    sizeOptions: ['Random', '30×30cm', 'Custom'],
    finishOptions: ['Natural Cleft', 'Honed'],
    colors: ['#404040', '#2D4A2D'],
    colorNames: ['Charcoal', 'Green'],
    application: ['Roofing', 'Wall Cladding', 'Garden', 'Landscaping'],
    isFeatured: false,
    isActive: true,
    images: ['/natural-stone-hero.png'],
  },
];

// ─── SANITARY WARE ───────────────────────────────────────────
const sanitaryProducts: NProduct[] = [];

// ─── ADHESIVES & CHEMICALS PRODUCTS ───────────────────────────
const chemicalProducts: NProduct[] = [
  {
    id: 'chem-1',
    slug: 'roff-vitrofix-t03',
    name: 'Roff Vitrofix T03 Tile Adhesive',
    description: 'Pidilite Roff Vitrofix T03 is a high-performance polymer-modified cement-based tile adhesive. Suitable for fixing vitrified tiles, marble, granite, and stones of any size on internal/external floor and wall. Provides superior bond strength, high open time, and high initial grab. Conforms to IS 15477:2019 Type II T & EN 12004 C2TE.',
    category: 'adhesives-chemicals',
    subcategory: 'tile-adhesives',
    priceRange: '₹350 – ₹950 per 20kg bag',
    brand: 'Pidilite Roff',
    material: 'Cementitious polymer modified',
    finishOptions: ['Grey', 'White'],
    colors: ['#888888', '#FAFAFA'],
    colorNames: ['Grey', 'White'],
    application: ['Floor', 'Wall', 'Bathroom', 'Kitchen', 'Elevation'],
    isFeatured: true,
    isActive: true,
    images: ['/adhesives-hero.png'],
  },
  {
    id: 'chem-2',
    slug: 'roff-nsa-t02',
    name: 'Roff NSA T02 Non-Skid Adhesive',
    description: 'Pidilite Roff NSA Grey T02 is a premium non-skid, polymer-modified tile adhesive designed for fixing medium-sized ceramic, vitrified tiles, and natural stones on walls and floors. Features high bond strength and tile-on-tile application properties with zero slip.',
    category: 'adhesives-chemicals',
    subcategory: 'tile-adhesives',
    priceRange: '₹280 – ₹720 per 20kg bag',
    brand: 'Pidilite Roff',
    material: 'Cementitious modified adhesive',
    finishOptions: ['Grey'],
    colors: ['#888888'],
    colorNames: ['Grey'],
    application: ['Floor', 'Wall', 'Bathroom', 'Kitchen'],
    isFeatured: true,
    isActive: true,
    images: ['/adhesives-hero.png'],
  },
  {
    id: 'chem-3',
    slug: 'roff-nca-t01',
    name: 'Roff NCA T01 New Construction Adhesive',
    description: 'Pidilite Roff NCA Grey T01 is a cement-based tile adhesive formulated for general flooring work in new construction projects. Saves time and labor compared to traditional sand-cement mortars. Prevents hollow sounds and cracking under tiles.',
    category: 'adhesives-chemicals',
    subcategory: 'tile-adhesives',
    priceRange: '₹180 – ₹450 per 20kg bag',
    brand: 'Pidilite Roff',
    material: 'Cement based adhesive',
    finishOptions: ['Grey'],
    colors: ['#888888'],
    colorNames: ['Grey'],
    application: ['Floor', 'Indoor Pavers'],
    isFeatured: false,
    isActive: true,
    images: ['/adhesives-hero.png'],
  },
  {
    id: 'chem-4',
    slug: 'roff-nsa-t09',
    name: 'Roff NSA White T09 Adhesive',
    description: 'Pidilite Roff NSA White T09 is a white cement-based, high-bond non-skid adhesive. Specially formulated for fixing translucent marble slabs, glass mosaic tiles, and light-colored natural stones on walls or swimming pools without causing discoloration.',
    category: 'adhesives-chemicals',
    subcategory: 'stone-adhesives',
    priceRange: '₹600 – ₹1,400 per 20kg bag',
    brand: 'Pidilite Roff',
    material: 'White cement based modified',
    finishOptions: ['White'],
    colors: ['#FAFAFA'],
    colorNames: ['White'],
    application: ['Floor', 'Wall', 'Bathroom', 'Swimming Pool', 'Glass Cladding'],
    isFeatured: true,
    isActive: true,
    images: ['/adhesives-hero.png'],
  },
  {
    id: 'chem-5',
    slug: 'roff-vitrofix-t04',
    name: 'Roff Vitrofix T04 White Adhesive',
    description: 'Pidilite Roff Vitrofix T04 White is a high-performance white cementitious adhesive with exceptional elasticity. Ideal for heavy-duty claddings, large format stones, granite slabs, and glass mosaics on high deflection surfaces like drywall or high-rise elevations.',
    category: 'adhesives-chemicals',
    subcategory: 'stone-adhesives',
    priceRange: '₹750 – ₹1,850 per 20kg bag',
    brand: 'Pidilite Roff',
    material: 'High-deformation white adhesive',
    finishOptions: ['White'],
    colors: ['#FAFAFA'],
    colorNames: ['White'],
    application: ['Floor', 'Wall', 'Elevation', 'Swimming Pool', 'Heavy Cladding'],
    isFeatured: false,
    isActive: true,
    images: ['/adhesives-hero.png'],
  },
  {
    id: 'chem-6',
    slug: 'myk-laticrete-307',
    name: 'MYK Laticrete 307 Floor & Wall Adhesive',
    description: 'MYK Laticrete 307 is a smooth, creamy polymer-fortified thin-set adhesive for installing ceramic tiles, vitrified tiles, and natural stones on concrete surfaces. Offers high strength and superior workability.',
    category: 'adhesives-chemicals',
    subcategory: 'tile-adhesives',
    priceRange: '₹320 – ₹850 per 20kg bag',
    brand: 'MYK Laticrete',
    material: 'Cementitious polymer fortified',
    finishOptions: ['Grey'],
    colors: ['#888888'],
    colorNames: ['Grey'],
    application: ['Floor', 'Wall', 'Bathroom', 'Kitchen'],
    isFeatured: false,
    isActive: true,
    images: ['/adhesives-hero.png'],
  },
  {
    id: 'chem-7',
    slug: 'webercol-fix-tile-adhesive',
    name: 'Saint-Gobain Weber Webercol Fix',
    description: 'Saint-Gobain Weber Webercol Fix is a ready-mix cementitious mortar containing special polymers for thin-bed tile installation. Ideal for vitrified, ceramic tiles on floors in high-load areas.',
    category: 'adhesives-chemicals',
    subcategory: 'tile-adhesives',
    priceRange: '₹290 – ₹780 per 20kg bag',
    brand: 'Saint-Gobain Weber',
    material: 'Polymer modified cement base',
    finishOptions: ['Grey'],
    colors: ['#888888'],
    colorNames: ['Grey'],
    application: ['Floor', 'Kitchen', 'Hallways'],
    isFeatured: false,
    isActive: true,
    images: ['/adhesives-hero.png'],
  },
];

// ─── ALL PRODUCTS ─────────────────────────────────────────────
export const allProducts: NProduct[] = [
  ...marbleProducts,
  ...graniteProducts,
  ...stoneProducts,
  ...kotaProducts,
  ...sanitaryProducts,
  ...chemicalProducts,
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────
export const getProductBySlug = (slug: string): NProduct | undefined =>
  allProducts.find(p => p.slug === slug);

export const getProductsByCategory = (category: ProductCategory): NProduct[] =>
  allProducts.filter(p => p.category === category && p.isActive);

export const getProductsBySubcategory = (
  category: ProductCategory,
  subcategory: string
): NProduct[] =>
  allProducts.filter(
    p => p.category === category && p.subcategory === subcategory && p.isActive
  );

export const getFeaturedProducts = (limit = 8): NProduct[] =>
  allProducts.filter(p => p.isFeatured && p.isActive).slice(0, limit);

export const searchProducts = (query: string): NProduct[] => {
  const q = query.toLowerCase();
  return allProducts.filter(
    p =>
      p.isActive &&
      (p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.origin?.toLowerCase().includes(q) ||
        p.colorNames?.some(c => c.toLowerCase().includes(q)) ||
        p.application?.some(a => a.toLowerCase().includes(q)))
  );
};

export const getRelatedProducts = (product: NProduct, limit = 4): NProduct[] =>
  allProducts
    .filter(p => p.id !== product.id && p.category === product.category && p.isActive)
    .slice(0, limit);

export const COLOR_FILTER_MAP: Record<string, string[]> = {
  White: ['#FFFFFF', '#FAFAFA', '#F5F5F0', '#F8F4E8', '#F8F8F6'],
  Beige: ['#F5E6C8', '#D4B896', '#F5F0E8'],
  Black: ['#0A0A0A', '#1A1A1A', '#0D0D0D', '#2A2A2A'],
  Grey: ['#888888', '#666666', '#555555', '#E8E8E0'],
  Brown: ['#3D2B1F', '#6B4226', '#B8860B'],
  Blue: ['#5B8BB0', '#4A7090', '#1C3A6B'],
  Green: ['#4A7A5A', '#2D4A2D', '#3D6B4E'],
};
