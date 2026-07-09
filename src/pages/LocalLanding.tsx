import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

// ─── City configuration ───────────────────────────────────────────────────────
interface CityConfig {
  city: string;
  slug: string;
  state: string;
  lat: string;
  lng: string;
  intro: string;
  body: string;
  faqs: { q: string; a: string }[];
  nearbyAreas: string[];
}

const CITIES: Record<string, CityConfig> = {
  gujarat: {
    city: 'Gujarat',
    slug: 'marble-gujarat',
    state: 'Gujarat',
    lat: '22.2587',
    lng: '71.1924',
    intro: 'Nilkanth Marble is Gujarat\'s trusted natural stone partner — serving homes, offices and commercial projects across the state with premium marble, granite, kota stone, tiles and sanitary ware.',
    body: `
      <p>Located at N.H. No.8, Piplag Chokdi, Nadiad, Nilkanth Marble has served customers across Gujarat since 2003 — over two decades of quality stone supply and unmatched variety. Our 500+ product catalogue spans Italian and Indian marble, premium granite, kota stone, ceramic tiles, vitrified tiles, and complete sanitary ware collections.</p>
      <p>Whether you are renovating a family home in Ahmedabad, outfitting a commercial plaza in Surat, or building a new residential project in Vadodara, Nilkanth Marble offers the same premium quality with reliable delivery across the state of Gujarat.</p>
      <p>Our stone experts help you choose the right material — factoring in your budget, foot traffic, climate exposure, and design aesthetic. From pure white Carrara marble to bold black Nero Marquina, from durable vitrified tiles to natural kota stone, every product is quality-checked before it reaches you.</p>
      <p>We supply to architects, interior designers, contractors, real estate developers and direct homeowners. Bulk orders get special pricing. Call or WhatsApp us for a free quote.</p>
    `,
    faqs: [
      { q: 'Does Nilkanth Marble deliver across all of Gujarat?', a: 'Yes. We supply and deliver to Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Anand, Nadiad, and most cities/towns across Gujarat. Contact us for specific delivery terms for your area.' },
      { q: 'What types of marble are available in Gujarat from Nilkanth Marble?', a: 'We stock Italian marble (Carrara, Statuario, Calacatta, Nero Marquina), Indian marble (Makrana White, Indian White, Fantasy), and many more. Visit our showroom or browse our online catalogue.' },
      { q: 'Can I get a free sample before ordering?', a: 'Yes. We provide sample chips for most products. Contact us and we can arrange samples to be delivered or picked up from our showroom in Nadiad.' },
      { q: 'Do you offer installation services in Gujarat?', a: 'We supply the stone and tiles. For installation, we can recommend trusted contractors in your city. Call us for referrals.' },
      { q: 'What is the minimum order quantity?', a: 'There is no strict minimum for retail orders. For wholesale/bulk, contact us for special pricing and terms.' },
    ],
    nearbyAreas: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Anand', 'Nadiad', 'Bharuch', 'Junagadh', 'Bhavnagar'],
  },

  ahmedabad: {
    city: 'Ahmedabad',
    slug: 'marble-ahmedabad',
    state: 'Gujarat',
    lat: '23.0225',
    lng: '72.5714',
    intro: 'Looking for premium marble in Ahmedabad? Nilkanth Marble supplies high-quality marble, granite, tiles and sanitary ware to homes and businesses in Ahmedabad — with over 20 years of trusted service in Gujarat.',
    body: `
      <p>Ahmedabad is Gujarat's largest city and a hub of real estate development, home renovation, and commercial construction. Nilkanth Marble proudly serves Ahmedabad's growing demand for premium natural stone — delivering directly from our Nadiad showroom to your site anywhere in Ahmedabad city and surrounding areas.</p>
      <p>We supply a wide range of marble for Ahmedabad homes — from the elegant Carrara White and Calacatta Gold for living rooms and master bedrooms, to robust granite worktops for kitchens, and durable vitrified tiles for high-traffic floors. Our portfolio covers 500+ products to match any design vision and budget.</p>
      <p>Interior designers, architects, and builders in Ahmedabad regularly source stone from Nilkanth Marble because of our consistent quality, competitive pricing, and ability to handle both small residential orders and large commercial projects. We also stock premium sanitary ware brands to complete your bathroom and kitchen fitout.</p>
      <p>Our team is available 6 days a week to assist with material selection, quantity estimation, and delivery scheduling for your Ahmedabad project. Call us or visit our showroom near Piplag Chokdi, Nadiad — just 45 minutes from Ahmedabad.</p>
    `,
    faqs: [
      { q: 'Does Nilkanth Marble deliver marble to Ahmedabad?', a: 'Yes. We regularly deliver marble, granite and tiles to Ahmedabad. Delivery timelines vary by product and quantity — call +91 94084 61000 for a quote.' },
      { q: 'Which marble is best for Ahmedabad homes?', a: 'For Ahmedabad\'s hot climate, lighter marbles like Carrara White, Indian White, and Makrana White are popular for their heat-reflective properties. For kitchens, granite is recommended for its durability.' },
      { q: 'Can Ahmedabad-based architects place bulk orders?', a: 'Absolutely. We offer bulk pricing for architects, contractors and developers. Contact us with your project details for a customised quote.' },
      { q: 'How far is the Nilkanth Marble showroom from Ahmedabad?', a: 'Our showroom is at Piplag Chokdi, Nadiad — approximately 45–55 minutes drive from Ahmedabad via NH-48.' },
      { q: 'Do you have a catalogue I can view online?', a: 'Yes — browse all products at nilkanthmarble.com/products or download our PDF catalogues from the PDF Catalogs section.' },
    ],
    nearbyAreas: ['Satellite', 'Prahlad Nagar', 'Bopal', 'Gota', 'Chandkheda', 'Motera', 'Naranpura', 'Vastral', 'Nikol', 'Naroda', 'Gandhinagar'],
  },

  surat: {
    city: 'Surat',
    slug: 'marble-surat',
    state: 'Gujarat',
    lat: '21.1702',
    lng: '72.8311',
    intro: 'Searching for quality marble in Surat? Nilkanth Marble delivers premium marble, granite, kota stone and tiles to Surat — trusted by builders, architects and homeowners across South Gujarat.',
    body: `
      <p>Surat is one of India's fastest-growing cities, with booming real estate and a thriving interior design industry. Nilkanth Marble supplies premium natural stone to Surat's construction and renovation projects — from luxury residential apartments to commercial complexes and hospitality venues.</p>
      <p>Our Surat customers frequently choose Italian marble for their living rooms and master bedrooms — Statuario, Calacatta, and Botticino Classico are perennial favourites. For high-traffic commercial floors, our polished granite and vitrified tiles offer the perfect balance of elegance and durability.</p>
      <p>Kota stone remains a popular choice in Surat's traditional homes and outdoor areas — it's heat-resistant, low maintenance, and gives an authentic Indian look. We also stock a range of natural cladding stones for exterior walls and garden features.</p>
      <p>Whether you are a homeowner renovating your bathroom, a contractor finishing a 50-flat residential project, or a designer outfitting a boutique hotel in Surat, Nilkanth Marble has the inventory, expertise, and logistics to serve you reliably.</p>
    `,
    faqs: [
      { q: 'Does Nilkanth Marble supply marble to Surat?', a: 'Yes. We deliver to Surat and surrounding areas in South Gujarat. Contact us for delivery schedule and minimum quantities.' },
      { q: 'What marble is popular in Surat homes?', a: 'Statuario, Calacatta, and Indian White marble are popular for Surat homes. For kitchens and wet areas, granite is commonly preferred.' },
      { q: 'Can I visit the showroom from Surat?', a: 'Our showroom is in Nadiad, approximately 2.5 hours from Surat via NH-48. We recommend calling ahead so our team can prepare samples for your visit.' },
      { q: 'Do you offer kota stone for Surat projects?', a: 'Yes. We stock kota stone in multiple finishes — rough, machine cut, and polished. Suitable for floors, steps, and outdoor areas.' },
      { q: 'Is there a minimum order for delivery to Surat?', a: 'For delivery to Surat, we recommend a minimum quantity to make logistics cost-effective. Contact us for details.' },
    ],
    nearbyAreas: ['Adajan', 'Katargam', 'Vesu', 'Althan', 'Pal', 'Dumas', 'Piplod', 'Citylight', 'Udhna', 'Sachin', 'Bharuch', 'Navsari'],
  },

  vadodara: {
    city: 'Vadodara',
    slug: 'marble-vadodara',
    state: 'Gujarat',
    lat: '22.3072',
    lng: '73.1812',
    intro: 'Need marble in Vadodara? Nilkanth Marble supplies premium marble, granite, tiles and sanitary ware to Vadodara — a complete natural stone solution for homes, offices and commercial projects in Baroda.',
    body: `
      <p>Vadodara (Baroda) has a rich cultural heritage and a growing demand for premium interior finishes. Nilkanth Marble supplies quality natural stone to Vadodara's architects, builders, interior designers and homeowners — bringing the finest marble, granite and tiles within reach.</p>
      <p>Our product range suits Vadodara's diverse architecture — from traditional havelis requiring Indian Makrana marble or Kota stone to modern apartments calling for Italian marble or large-format vitrified tiles. We stock 500+ products across marble, granite, natural stone, tiles, adhesives and sanitary ware.</p>
      <p>Builders and developers working on residential projects in Gotri, Alkapuri, Harni and New Sama Road trust Nilkanth Marble for consistent quality and reliable supply. We can manage phased deliveries to align with your construction schedule.</p>
      <p>Our showroom in Nadiad is approximately one hour from Vadodara. Alternatively, our team can visit your project site in Vadodara for material selection consultations on large orders. Contact us to schedule a visit.</p>
    `,
    faqs: [
      { q: 'Does Nilkanth Marble deliver to Vadodara?', a: 'Yes. We supply and deliver marble, granite, tiles and sanitary ware to Vadodara. Call +91 94084 61000 for delivery terms and pricing.' },
      { q: 'Which marble is suitable for Vadodara\'s climate?', a: 'Light-coloured marbles like Makrana White, Carrara, and Indian White are well-suited to Vadodara\'s warm climate. They reflect heat and are easier to maintain.' },
      { q: 'Do you supply kota stone to Vadodara?', a: 'Yes. Kota stone is popular for outdoor areas, corridors, and commercial floors in Vadodara. We stock it in rough and polished finishes.' },
      { q: 'Can architects in Vadodara get samples?', a: 'Yes. We send samples for most products. Contact us with your address in Vadodara and required sample types.' },
      { q: 'Is granite available for Vadodara kitchen projects?', a: 'Absolutely. We stock a wide range of granite — Black Galaxy, Kashmir White, Rajasthan Black and more — ideal for kitchen countertops and floors.' },
    ],
    nearbyAreas: ['Alkapuri', 'Gotri', 'Manjalpur', 'Gorwa', 'Waghodia', 'Harni', 'Sama', 'Akota', 'Subhanpura', 'Anand', 'Nadiad'],
  },

  nadiad: {
    city: 'Nadiad',
    slug: 'marble-nadiad',
    state: 'Gujarat',
    lat: '22.6916',
    lng: '72.8634',
    intro: 'Nilkanth Marble\'s home — located at N.H. 8, Piplag Chokdi, Nadiad, Gujarat. Visit our showroom for the widest selection of marble, granite, kota stone, tiles and sanitary ware in the Kheda district.',
    body: `
      <p>Nilkanth Marble has been Nadiad's premier stone supplier since 2003. Our showroom at N.H. No.8, Piplag Chokdi (near Nadiad) displays hundreds of marble, granite, natural stone, and tile options — the most comprehensive stone showroom in the Kheda district.</p>
      <p>Customers from Nadiad, Anand, Kheda, Petlad, Borsad and surrounding towns visit us regularly to choose stone for their homes, offices, shops, and new construction projects. Our knowledgeable staff walks you through the options — helping you find the right stone for your specific requirement, style and budget.</p>
      <p>We carry Italian marble (Carrara, Statuario, Calacatta, Nero Marquina, Rosso Verona), Indian marble (Makrana, Indian White, Green Marble), granite in over 30 varieties, kota stone, natural cladding stone, adhesives, vitrified and ceramic tiles, and a full sanitary ware collection.</p>
      <p>Located just off the national highway, our Nadiad showroom is conveniently accessible from Anand (20 min), Ahmedabad (50 min), and Vadodara (60 min). Open Monday to Saturday, 9 AM to 7 PM.</p>
    `,
    faqs: [
      { q: 'Where is Nilkanth Marble located in Nadiad?', a: 'We are located at N.H. No.8, Piplag Chokdi, At. Piplag, Nadiad — 387355. Easily accessible from the national highway.' },
      { q: 'What are the showroom timings?', a: 'Our showroom is open Monday to Saturday, 9:00 AM to 7:00 PM. Closed on Sundays (or by appointment).' },
      { q: 'Do I need an appointment to visit?', a: 'No appointment needed for regular visits. For large project consultations, calling ahead ensures our experts are available to assist you.' },
      { q: 'Do you offer home delivery in Nadiad?', a: 'Yes. We offer direct delivery to your project site in Nadiad and surrounding areas like Anand, Kheda, Petlad and Borsad.' },
      { q: 'What products does Nilkanth Marble showroom carry?', a: 'Our showroom carries marble (Italian and Indian), granite, kota stone, natural cladding stone, ceramic tiles, vitrified tiles, adhesives, chemicals, and a full sanitary ware range — 500+ products in total.' },
    ],
    nearbyAreas: ['Anand', 'Kheda', 'Petlad', 'Borsad', 'Mahemdabad', 'Dakor', 'Kapadvanj', 'Thasra', 'Matar'],
  },
};

// ─── Structured data builders ─────────────────────────────────────────────────
function buildCitySchema(cfg: CityConfig) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://www.nilkanthmarble.com/${cfg.slug}`,
      name: 'Nilkanth Marble',
      description: cfg.intro,
      url: `https://www.nilkanthmarble.com/${cfg.slug}`,
      telephone: ['+91-94084-61000', '+91-99741-42777'],
      email: 'nilkanth1marble@gmail.com',
      logo: 'https://www.nilkanthmarble.com/logo-512.png',
      image: 'https://www.nilkanthmarble.com/og-image.jpg',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'N.H. No.8, Piplag Chokdi, At. Piplag',
        addressLocality: 'Nadiad',
        addressRegion: 'Gujarat',
        postalCode: '387355',
        addressCountry: 'IN',
      },
      geo: { '@type': 'GeoCoordinates', latitude: '22.6916', longitude: '72.8634' },
      areaServed: { '@type': cfg.city === 'Gujarat' ? 'State' : 'City', name: cfg.city },
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      }],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cfg.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.nilkanthmarble.com/' },
        { '@type': 'ListItem', position: 2, name: `Marble in ${cfg.city}`, item: `https://www.nilkanthmarble.com/${cfg.slug}` },
      ],
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  cityKey: string;
}

export default function LocalLanding({ cityKey }: Props) {
  const cfg = CITIES[cityKey];
  if (!cfg) return <div className="min-h-screen flex items-center justify-center"><p>Page not found.</p></div>;

  useSEO({
    title: `Marble in ${cfg.city} | Premium Marble & Granite Supplier — Nilkanth Marble`,
    description: cfg.intro.slice(0, 160),
    keywords: `marble ${cfg.city.toLowerCase()}, granite ${cfg.city.toLowerCase()}, marble supplier ${cfg.city.toLowerCase()}, kota stone ${cfg.city.toLowerCase()}, tiles ${cfg.city.toLowerCase()}, natural stone ${cfg.city.toLowerCase()}, marble dealer Gujarat, Nilkanth Marble`,
    canonical: `https://www.nilkanthmarble.com/${cfg.slug}`,
    jsonLd: buildCitySchema(cfg),
  });

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#1C3A6B] to-[#0f2247] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#C8962E] uppercase tracking-widest text-sm font-semibold mb-3">
            Nilkanth Marble — {cfg.state}
          </p>
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 leading-tight">
            Marble in {cfg.city}
          </h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
            {cfg.intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919408461000"
              id={`cta-call-${cfg.slug}`}
              className="bg-[#C8962E] hover:bg-[#b07a1e] text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              📞 Call: +91 94084 61000
            </a>
            <a
              href="https://wa.me/919974142777"
              id={`cta-whatsapp-${cfg.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Products we supply ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-[#1C3A6B] mb-2 text-center">
            What We Supply in {cfg.city}
          </h2>
          <p className="text-gray-500 text-center mb-10">500+ products across 6 categories</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Italian & Indian Marble', icon: '🏛️', link: '/marble' },
              { label: 'Premium Granite', icon: '🪨', link: '/granite' },
              { label: 'Kota Stone', icon: '🧱', link: '/kota-stone' },
              { label: 'Natural Cladding Stone', icon: '🌿', link: '/cladding-stone' },
              { label: 'Tiles & Vitrified', icon: '🔲', link: '/tiles' },
              { label: 'Sanitary Ware', icon: '🚿', link: '/products' },
            ].map(item => (
              <Link
                key={item.label}
                to={item.link}
                className="group border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center hover:border-[#C8962E] hover:shadow-md transition-all"
              >
                <span className="text-4xl mb-2">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1C3A6B]">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              id={`browse-products-${cfg.slug}`}
              className="bg-[#1C3A6B] hover:bg-[#0f2247] text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Browse All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Body content ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-[#1C3A6B] mb-6">
            About Nilkanth Marble — Serving {cfg.city}
          </h2>
          <div
            className="prose prose-lg text-gray-700 space-y-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cfg.body }}
          />
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-[#1C3A6B] mb-8 text-center">
            Why {cfg.city === 'Gujarat' ? 'Gujarat' : cfg.city} Chooses Nilkanth Marble
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '✅', title: '20+ Years Experience', desc: 'Trusted since 2003 with deep product knowledge and industry expertise.' },
              { icon: '🏆', title: '500+ Products', desc: 'Italian marble, Indian granite, kota stone, tiles, and sanitary ware all in one place.' },
              { icon: '🚚', title: 'State-wide Delivery', desc: 'We deliver reliably across Gujarat — to your site, on schedule.' },
              { icon: '💰', title: 'Competitive Pricing', desc: 'Factory-direct sourcing means better rates for retail and wholesale buyers.' },
            ].map(f => (
              <div key={f.title} className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-[#1C3A6B] mb-1">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby areas served ── */}
      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-heading font-bold text-[#1C3A6B] mb-4 text-center">
            Areas We Serve Near {cfg.city}
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {cfg.nearbyAreas.map(area => (
              <span key={area} className="bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-[#1C3A6B] mb-8 text-center">
            Frequently Asked Questions — Marble in {cfg.city}
          </h2>
          <div className="space-y-4">
            {cfg.faqs.map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-xl p-5 group">
                <summary className="font-semibold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-[#C8962E] group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="py-16 px-6 bg-[#1C3A6B] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-3">
            Get a Free Quote for {cfg.city}
          </h2>
          <p className="text-white/70 mb-8">
            Call, WhatsApp, or fill in the contact form. Our team responds within 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919408461000"
              id={`cta-call-bottom-${cfg.slug}`}
              className="bg-[#C8962E] hover:bg-[#b07a1e] text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              📞 +91 94084 61000
            </a>
            <Link
              to="/contact"
              id={`cta-contact-${cfg.slug}`}
              className="border-2 border-white hover:bg-white hover:text-[#1C3A6B] text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Fill Inquiry Form
            </Link>
          </div>
          <p className="mt-6 text-white/50 text-sm">
            📍 Showroom: N.H. No.8, Piplag Chokdi, Nadiad, Gujarat — 387355
          </p>
        </div>
      </section>
    </main>
  );
}
