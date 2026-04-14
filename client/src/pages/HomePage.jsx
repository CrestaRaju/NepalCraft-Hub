import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Package, Truck, Star, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = [
  { name: 'Paintings & Art', icon: '🎨' },
  { name: 'Textiles & Fabrics', icon: '🧵' },
  { name: 'Meditation & Wellness', icon: '🔮' },
  { name: 'Sculptures & Statues', icon: '🏺' },
  { name: 'Stationery & Paper Crafts', icon: '📜' },
];

const FEATURES = [
  {
    icon: <Shield size={24} style={{ color: '#b91c1c' }} />,
    title: 'Authentic & Verified',
    desc: 'Every product is vetted by our team for quality and authenticity.'
  },
  {
    icon: <Truck size={24} style={{ color: '#b91c1c' }} />,
    title: 'Shipped to UK',
    desc: 'Reliable DHL shipping from Nepal to your UK address.'
  },
  {
    icon: <Package size={24} style={{ color: '#b91c1c' }} />,
    title: 'Fair Trade',
    desc: 'Supporting artisans with fair wages and ethical practices.'
  },
  {
    icon: <Star size={24} style={{ color: '#b91c1c' }} />,
    title: 'Buyer Reviews',
    desc: 'Real reviews from UK buyers to help you choose with confidence.'
  },
];

const STATS = [
  { value: '200+', label: 'Artisans' },
  { value: '500+', label: 'Products' },
  { value: '2,800+', label: 'UK Buyers' },
  { value: '4.9★', label: 'Avg. Rating' },
];

const HERO_IMAGES = [
  {
    img: 'https://images.unsplash.com/photo-1524492914791-8a67e35b6f40?w=400&q=80',
    label: 'Thangka Paintings',
  },
  {
    img: 'https://images.unsplash.com/photo-1585136917228-db2d4146f6d0?w=400&q=80',
    label: 'Pashmina Shawls',
  },
  {
    img: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=400&q=80',
    label: 'Singing Bowls',
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    label: 'Bronze Statues',
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setFeaturedProducts((res.data.products || []).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-wrapper">

      {/* ── Hero Section ────────────────────────────────── */}
      <section className="hero-gradient">
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1
        }}>
          <div style={{
            position: 'absolute', top: '3rem', right: '5rem',
            width: '22rem', height: '22rem', borderRadius: '50%',
            background: 'rgba(185,28,28,0.12)', filter: 'blur(60px)'
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: '3rem',
            width: '18rem', height: '18rem', borderRadius: '50%',
            background: 'rgba(217,119,6,0.10)', filter: 'blur(60px)'
          }} />
        </div>

        <div className="hero-container">
          <div className="hero-inner">
            {/* Left: Copy */}
            <div className="animate-slide-up">
              <div className="hero-badge">
                🇳🇵 Direct from Nepali Artisans to UK
              </div>

              <h1 className="hero-heading">
                Authentic
                <span className="hero-heading-accent"> Nepali</span>
                <br />Handicrafts
              </h1>

              <p className="hero-description">
                Discover handcrafted treasures from the Himalayan kingdom — Thangka paintings,
                Pashmina shawls, singing bowls, and more. Shipped directly to the United Kingdom.
              </p>

              <div className="hero-cta">
                <Link to="/products" className="btn-secondary">
                  Explore Shop <ArrowRight size={18} />
                </Link>
                <Link to="/register?role=seller" className="btn-ghost-white">
                  Sell Your Craft
                </Link>
              </div>

              <div className="hero-trust">
                {['100% Authentic', 'UK VAT Included', 'Tracked Shipping'].map(text => (
                  <span key={text} className="hero-trust-item">
                    <CheckCircle size={14} className="hero-trust-icon" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Image Grid (desktop only) */}
            <div className="hero-image-grid">
              {HERO_IMAGES.map((item, i) => (
                <div key={i} className="hero-image-item">
                  <img
                    src={item.img}
                    alt={item.label}
                    onError={(e) => {
                      // Fallback to a Nepal-related image
                      e.target.src = `https://picsum.photos/seed/nepal${i}/400/300`;
                    }}
                  />
                  <div className="hero-image-overlay" />
                  <p className="hero-image-label">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────── */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          {STATS.map((s, i) => (
            <div key={i}>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: '2rem' }}>
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our curated collections of authentic Nepali handicrafts</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="category-card"
            >
              <span className="category-icon">{cat.icon}</span>
              <p className="category-name">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle" style={{ marginTop: '0.25rem' }}>Handpicked by our curators</p>
          </div>
          <Link to="/products" className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            View All
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <LoadingSpinner />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
            <p style={{ fontSize: '1rem' }}>No products available yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* ── Why NepalCraft Hub ──────────────────────────── */}
      <section className="features-section">
        <div className="features-inner">
          <div className="section-header">
            <h2 className="section-title">Why NepalCraft Hub?</h2>
            <p className="section-subtitle">We make it easy to discover and own authentic Nepali art</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artisan CTA Banner ──────────────────────────── */}
      <section className="artisan-banner">
        <div className="artisan-banner-inner">
          <p className="artisan-label">For Artisans</p>
          <h2 className="section-title">Sell Your Handicrafts to the UK</h2>
          <p className="artisan-desc">
            Join hundreds of Nepali artisans already selling on NepalCraft Hub. We handle UK customs,
            VAT, and shipping logistics so you can focus on what you do best — creating beautiful things.
          </p>
          <Link to="/register?role=seller" className="btn-primary">
            Become a Seller <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
