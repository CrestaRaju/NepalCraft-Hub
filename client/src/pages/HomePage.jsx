import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Package, Truck, Star, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = [
  { name: 'Paintings & Art', icon: '🎨', color: 'bg-red-50 hover:bg-red-100' },
  { name: 'Textiles & Fabrics', icon: '🧵', color: 'bg-amber-50 hover:bg-amber-100' },
  { name: 'Meditation & Wellness', icon: '🔮', color: 'bg-purple-50 hover:bg-purple-100' },
  { name: 'Sculptures & Statues', icon: '🏺', color: 'bg-stone-50 hover:bg-stone-100' },
  { name: 'Stationery & Paper Crafts', icon: '📜', color: 'bg-green-50 hover:bg-green-100' },
];

const FEATURES = [
  { icon: <Shield size={24} className="text-red-700" />, title: 'Authentic & Verified', desc: 'Every product is vetted by our team for quality and authenticity.' },
  { icon: <Truck size={24} className="text-red-700" />, title: 'Shipped to UK', desc: 'Reliable DHL shipping from Nepal to your UK address.' },
  { icon: <Package size={24} className="text-red-700" />, title: 'Fair Trade', desc: 'Supporting artisans with fair wages and ethical practices.' },
  { icon: <Star size={24} className="text-red-700" />, title: 'Buyer Reviews', desc: 'Real reviews from UK buyers to help you choose with confidence.' },
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
      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-red-500 blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-amber-500 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-2 bg-red-700/30 text-red-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-red-700/30">
                🇳🇵 Direct from Nepali Artisans to UK
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Authentic
                <span className="text-amber-400"> Nepali</span>
                <br />Handicrafts
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                Discover handcrafted treasures from the Himalayan kingdom — Thangka paintings, Pashmina shawls, singing bowls, and more. Shipped directly to the United Kingdom.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="inline-flex items-center gap-2 btn-secondary">
                  Explore Shop <ArrowRight size={18} />
                </Link>
                <Link to="/register?role=seller" className="inline-flex items-center gap-2 border-2 border-gray-400 text-gray-300 hover:border-white hover:text-white font-semibold py-2.5 px-6 rounded-lg transition-all">
                  Sell Your Craft
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-400">
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-400" /> 100% Authentic</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-400" /> UK VAT Included</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-400" /> Tracked Shipping</span>
              </div>
            </div>

            {/* Hero Product Preview */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=300', label: 'Thangka Paintings' },
                { img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300', label: 'Pashmina Shawls' },
                { img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300', label: 'Singing Bowls' },
                { img: 'https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=300', label: 'Bronze Statues' },
              ].map((item, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden ${i === 1 ? 'mt-6' : ''} ${i === 3 ? 'mt-6' : ''}`}>
                  <img src={item.img} alt={item.label} className="w-full h-36 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <p className="absolute bottom-2 left-3 text-white text-xs font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-red-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '200+', label: 'Artisans' },
            { value: '500+', label: 'Products' },
            { value: '2,800+', label: 'UK Buyers' },
            { value: '4.9★', label: 'Avg. Rating' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-red-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-gray-500">Browse our curated collections of authentic Nepali handicrafts</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`${cat.color} rounded-xl px-6 py-4 text-center transition-all duration-200 hover:shadow-md group min-w-[140px]`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-gray-500">Handpicked by our curators</p>
          </div>
          <Link to="/products" className="btn-outline text-sm py-2 px-4">
            View All
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Why NepalCraft Hub?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="text-center p-6 rounded-xl hover:bg-red-50 transition-colors">
                <div className="flex justify-center mb-4 p-3 bg-red-50 rounded-full w-14 h-14 mx-auto items-center">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Banner */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-red-700 uppercase tracking-widest mb-3">For Artisans</p>
          <h2 className="section-title mb-4">Sell Your Handicrafts to the UK</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of Nepali artisans already selling on NepalCraft Hub. We handle UK customs, VAT, and shipping logistics so you can focus on what you do best — creating beautiful things.
          </p>
          <Link to="/register?role=seller" className="btn-primary inline-flex items-center gap-2">
            Become a Seller <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
