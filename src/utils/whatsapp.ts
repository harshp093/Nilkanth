// ═══════════════════════════════════════════════════════════════
// NILKANTH MARBLE — WhatsApp Utility Functions
// ═══════════════════════════════════════════════════════════════

const WA_NUMBER = '919974142777'; // Hitesh Shah — +91 99741 42777
const SITE_URL = 'https://www.nilkanthmarble.com';
const BUSINESS_NAME = 'Nilkanth Marble';

export type ProductForWA = {
  name: string;
  slug: string;
  category?: string;
  priceRange?: string;
};

export type CatalogForWA = {
  title: string;
  id: string;
};

/**
 * Product enquiry — sends message TO the business
 */
export function productEnquiryWhatsApp(product: ProductForWA, customMessage?: string): string {
  const message = encodeURIComponent(
    `Hi Hitesh Shah! 👋\n\n` +
    `I am interested in the following product:\n` +
    `📦 *${product.name}*\n` +
    (product.category ? `🏷️ Category: ${product.category}\n` : '') +
    (product.priceRange ? `💰 Price: ${product.priceRange}\n` : '') +
    `🔗 Link: ${SITE_URL}/product/${product.slug}\n\n` +
    (customMessage ? `💬 My Message:\n${customMessage}\n\n` : '') +
    `Please share more details, pricing and availability.`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}

/**
 * Product share — allows user to share to ANYONE (no phone number)
 */
export function shareProductWhatsApp(product: ProductForWA): string {
  const message = encodeURIComponent(
    `Check out this product from ${BUSINESS_NAME}! 🏠\n\n` +
    `📦 *${product.name}*\n` +
    `🔗 ${SITE_URL}/product/${product.slug}\n\n` +
    `Contact: +91 94084 61000`
  );
  return `https://wa.me/?text=${message}`;
}

/**
 * Catalog enquiry — about a specific PDF catalog
 */
export function catalogEnquiryWhatsApp(catalog: CatalogForWA, customMessage?: string): string {
  const message = encodeURIComponent(
    `Hi Hitesh Shah! 👋\n\n` +
    `I viewed the "*${catalog.title}*" catalog on your website.\n` +
    `🔗 Link: ${SITE_URL}/tiles-catalog\n\n` +
    (customMessage ? `💬 My Message:\n${customMessage}\n\n` : '') +
    `Please share more details and pricing.`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}

/**
 * General enquiry
 */
export function generalEnquiryWhatsApp(): string {
  const message = encodeURIComponent(
    `Hi Hitesh Shah! 👋\n\n` +
    `I would like to enquire about your products.\n` +
    `Please share more information.`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
}

/**
 * Call link
 */
export const CALL_LINK = 'tel:+919974142777';
export const CALL_LINK_PRIMARY = 'tel:+919408461000';

export { WA_NUMBER, SITE_URL };
