// ═══════════════════════════════════════════════════════════════
// NILKANTH MARBLE — Tiles PDF Catalogs Data
// ColorTiles Company Catalogs
// ═══════════════════════════════════════════════════════════════

// CatalogType is now open-ended — any string is a valid sub-type.
// The rigid union is replaced by a string so admins can define new types freely.
export type CatalogType = string;

// Parent tab groups — the broad sections on the PDF catalog page.
export type ParentTab = 'tiles' | 'sanitary' | 'stone' | 'artificial-stone' | 'other' | string;

export interface TilesCatalog {
  id: string;
  title: string;
  company: string;
  description: string;
  pdfUrl?: string;
  thumbnailUrl: string;
  catalogType: CatalogType;       // specific sub-type e.g. "floor-tiles", "wooden-tiles"
  catalogTypeLabel?: string;      // human-readable label e.g. "Wooden Floor Tiles"
  parentTab?: ParentTab;          // parent section e.g. "tiles", "sanitary", "stone"
  tags: string[];
  pageCount?: number;
  viewCount: number;
  downloadCount: number;
  isActive: boolean;
  isFeatured?: boolean;
  application?: string[];
}

export const tilesCatalogs: TilesCatalog[] = [
  {
    id: 'ct-001',
    title: 'ColorTiles Floor Collection 2024',
    company: 'ColorTiles',
    description: 'Complete range of premium floor tiles — vitrified, polished, matte and anti-skid finishes. Sizes from 2×2 ft to 4×8 ft.',
    pdfUrl: undefined,
    thumbnailUrl: '/tile-hero.webp',
    catalogType: 'floor-tiles',
    tags: ['Floor', 'Vitrified', 'Polished', 'Anti-Skid'],
    pageCount: 48,
    viewCount: 245,
    downloadCount: 82,
    isActive: true,
  },
  {
    id: 'ct-002',
    title: 'ColorTiles Wall Collection 2024',
    company: 'ColorTiles',
    description: 'Elegant wall tile designs for kitchens and bathrooms. Subway, metro, textured and relief patterns.',
    pdfUrl: undefined,
    thumbnailUrl: '/tile-hero.webp',
    catalogType: 'wall-tiles',
    tags: ['Wall', 'Kitchen', 'Bathroom', 'Subway', 'Metro'],
    pageCount: 36,
    viewCount: 189,
    downloadCount: 61,
    isActive: true,
  },
  {
    id: 'ct-003',
    title: 'ColorTiles Bathroom Tiles 2024',
    company: 'ColorTiles',
    description: 'Dedicated bathroom tile collection — moisture-resistant, slip-proof, with matching floor and wall sets.',
    pdfUrl: undefined,
    thumbnailUrl: '/tile-hero.webp',
    catalogType: 'bathroom-tiles',
    tags: ['Bathroom', 'Anti-Slip', 'Moisture Resistant', 'Sets'],
    pageCount: 28,
    viewCount: 312,
    downloadCount: 105,
    isActive: true,
  },
  {
    id: 'ct-004',
    title: 'ColorTiles Designer Collection',
    company: 'ColorTiles',
    description: 'Exclusive designer tiles — geometric patterns, 3D textures, encaustic prints and artisan finishes.',
    pdfUrl: undefined,
    thumbnailUrl: '/tile-hero.webp',
    catalogType: 'designer-tiles',
    tags: ['Designer', 'Geometric', '3D', 'Encaustic', 'Artisan'],
    pageCount: 52,
    viewCount: 421,
    downloadCount: 143,
    isActive: true,
  },
  {
    id: 'ct-005',
    title: 'ColorTiles Vitrified Premium 2024',
    company: 'ColorTiles',
    description: 'Top-grade vitrified tiles with GVT and PGVT technology. Double charged and full body vitrified options.',
    pdfUrl: undefined,
    thumbnailUrl: '/tile-hero.webp',
    catalogType: 'vitrified',
    tags: ['Vitrified', 'GVT', 'PGVT', 'Double Charged', 'Full Body'],
    pageCount: 44,
    viewCount: 284,
    downloadCount: 97,
    isActive: true,
  },
  {
    id: 'ct-006',
    title: 'ColorTiles Outdoor & Exterior',
    company: 'ColorTiles',
    description: 'Heavy-duty outdoor tiles for terraces, driveways, gardens and pool sides. Frost-resistant and UV-stable.',
    pdfUrl: undefined,
    thumbnailUrl: '/tile-hero.webp',
    catalogType: 'floor-tiles',
    tags: ['Outdoor', 'Terrace', 'Driveway', 'Pool Side', 'Frost Resistant'],
    pageCount: 32,
    viewCount: 156,
    downloadCount: 48,
    isActive: true,
  },
];

export const getCatalogById = (id: string): TilesCatalog | undefined =>
  tilesCatalogs.find(c => c.id === id);

export const getCatalogsByType = (type: CatalogType): TilesCatalog[] => {
  if (type === 'all') return tilesCatalogs.filter(c => c.isActive);
  return tilesCatalogs.filter(c => c.catalogType === type && c.isActive);
};
