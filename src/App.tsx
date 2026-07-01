import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Marble from './pages/Marble';
import Granite from './pages/Granite';
import KotaStone from './pages/KotaStone';
import SanitaryWare from './pages/SanitaryWare';
import TilesCatalog from './pages/TilesCatalog';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin — full-screen, no layout navbar/footer */}
        <Route path="/admin" element={<Admin />} />

        {/* Main website with Layout (navbar + footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="marble" element={<Marble />} />
          <Route path="granite" element={<Granite />} />
          <Route path="kota-stone" element={<KotaStone />} />
          <Route path="sanitary-ware" element={<SanitaryWare />} />
          <Route path="tiles-catalog" element={<TilesCatalog />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="granite/:stoneId" element={<Granite />} />
          <Route path="product/:productId" element={<ProductDetail />} />
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
