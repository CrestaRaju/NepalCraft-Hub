import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import SellerProfilePage from './pages/SellerProfilePage';
import AboutPage from './pages/AboutPage';

// Seller pages
import SellerProductsPage from './pages/seller/SellerProductsPage';

// Admin pages
import AdminPage from './pages/admin/AdminPage';

// Pages that should NOT have Navbar/Footer (auth pages)
const AUTH_ROUTES = ['/login', '/register'];

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                fontSize: '14px'
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
            }}
          />
          <Routes>
            {/* Auth routes (no Navbar/Footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* All other routes with Navbar/Footer */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/seller/:id" element={<Layout><SellerProfilePage /></Layout>} />

            {/* Protected: any logged-in user */}
            <Route path="/checkout" element={
              <Layout>
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/orders" element={
              <Layout>
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </Layout>
            } />

            {/* Protected: sellers only */}
            <Route path="/seller/products" element={
              <Layout>
                <ProtectedRoute roles={['seller', 'admin']}>
                  <SellerProductsPage />
                </ProtectedRoute>
              </Layout>
            } />

            {/* Protected: admin only */}
            <Route path="/admin" element={
              <Layout>
                <ProtectedRoute roles={['admin']}>
                  <AdminPage />
                </ProtectedRoute>
              </Layout>
            } />

            {/* 404 */}
            <Route path="*" element={
              <Layout>
                <div className="text-center py-20">
                  <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
                  <p className="text-gray-500 mb-6">Page not found</p>
                  <a href="/" className="btn-primary inline-block">Go Home</a>
                </div>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
