import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Granite from './pages/Granite';
import TilesCatalog from './pages/TilesCatalog';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
// SeedDatabase removed from public routes — run `node seedSupabase.js` locally instead
import Brands from './pages/Brands';
import Catalog from './pages/Catalog';
import Tiles from './pages/Tiles';
import Gallery from './pages/Gallery';
import DynamicCategoryPage from './pages/DynamicCategoryPage';
import LocalLanding from './pages/LocalLanding';
import Reviews from './pages/Reviews';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin — full-screen, no layout navbar/footer */}
        <Route path="/admin" element={<Admin />} />
        {/* /seed route removed — seeding is CLI-only (node seedSupabase.js) */}

        {/* Main website with Layout (navbar + footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="marble" element={<DynamicCategoryPage categoryId="marble" />} />
          <Route path="granite" element={<DynamicCategoryPage categoryId="granite" />} />
          <Route path="cladding-stone" element={<DynamicCategoryPage categoryId="cladding-stone" />} />
          <Route path="adhesives-chemicals" element={<DynamicCategoryPage categoryId="adhesives-chemicals" />} />
          <Route path="kota-stone" element={<DynamicCategoryPage categoryId="kota-stone" />} />
          <Route path="tiles-catalog" element={<TilesCatalog />} />
          <Route path="catalogs" element={<TilesCatalog />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/:brandId" element={<Catalog />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="tiles" element={<Tiles />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="category/:categorySlug" element={<DynamicCategoryPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="granite/:stoneId" element={<Granite />} />
          <Route path="product/:productId" element={<ProductDetail />} />

          {/* ── Local SEO landing pages ── */}
          <Route path="marble-gujarat" element={<LocalLanding cityKey="gujarat" />} />
          <Route path="marble-ahmedabad" element={<LocalLanding cityKey="ahmedabad" />} />
          <Route path="marble-surat" element={<LocalLanding cityKey="surat" />} />
          <Route path="marble-vadodara" element={<LocalLanding cityKey="vadodara" />} />
          <Route path="marble-nadiad" element={<LocalLanding cityKey="nadiad" />} />

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div>
                  <div className="text-8xl mb-4">🪨</div>
                  <h1 className="text-3xl font-heading font-black text-gray-900 mb-2">Page Not Found</h1>
                  <p className="text-gray-500 mb-6">This page doesn't exist. Browse our products instead.</p>
                  <a href="/" className="btn-primary inline-flex">← Back to Home</a>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
