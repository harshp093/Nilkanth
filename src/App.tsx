import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Brands from './pages/Brands';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Tiles from './pages/Tiles';
import TileCollectionDetail from './pages/TileCollectionDetail';
import Granite from './pages/Granite';
import GraniteDetail from './pages/GraniteDetail';

function App() {
  return (
    <Router>
      {/* Fixes "page opens from bottom" — scrolls to top on every route change */}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/:brandId" element={<Catalog />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:productId" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="gallery" element={<Gallery />} />
          {/* ── Tiles ────────────────────────────────────────────────────────── */}
          <Route path="tiles" element={<Tiles />} />
          <Route path="tiles/:brandId/:collectionId" element={<TileCollectionDetail />} />
          {/* ── Granite ──────────────────────────────────────────────────────── */}
          <Route path="granite" element={<Granite />} />
          <Route path="granite/:stoneId" element={<GraniteDetail />} />
          {/* ── About ────────────────────────────────────────────────────────── */}
          <Route path="about" element={<div className="min-h-screen p-20 text-center"><h1 className="text-4xl font-heading">About Us</h1><p className="mt-4 text-gray-600">Details coming soon.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
