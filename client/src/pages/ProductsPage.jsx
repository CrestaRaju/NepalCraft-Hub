import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = [
  'All',
  'Paintings & Art',
  'Textiles & Fabrics',
  'Meditation & Wellness',
  'Sculptures & Statues',
  'Stationery & Paper Crafts',
];

const SORT_OPTIONS = [
  { value: 'new', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('new');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (sort === 'price_asc') result.sort((a, b) => a.priceNPR - b.priceNPR);
    else if (sort === 'price_desc') result.sort((a, b) => b.priceNPR - a.priceNPR);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFiltered(result);
  }, [products, search, category, sort]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '2rem 1.5rem' }}>
        <div className="container-xl">
          <h1 className="section-title" style={{ marginBottom: '0.375rem' }}>
            Shop Nepali Handicrafts
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Handmade with love, shipped to the United Kingdom</p>
        </div>
      </div>

      <div className="container-xl" style={{ padding: '2rem 1.5rem' }}>
        {/* Search & Sort Bar */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search
              size={17}
              style={{
                position: 'absolute', left: '0.875rem',
                top: '50%', transform: 'translateY(-50%)',
                color: '#9ca3af', pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search handicrafts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem', paddingRight: search ? '2.5rem' : undefined }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none', border: 'none',
                  cursor: 'pointer', color: '#9ca3af', padding: '0.1rem',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '11rem', cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'none', // will be overridden at mobile by inline media query workaround
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1rem',
              border: '2px solid #b91c1c',
              borderRadius: '0.5rem',
              color: '#b91c1c',
              background: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
            className="filter-mobile-btn"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside style={{
            width: '13rem',
            flexShrink: 0,
            display: showFilters ? 'block' : undefined,
          }} className="products-sidebar">
            <div style={{
              background: '#fff',
              borderRadius: '0.875rem',
              padding: '1.25rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              border: '1px solid #f3f4f6',
              position: 'sticky',
              top: '5rem',
            }}>
              <h3 style={{
                fontSize: '0.75rem', fontWeight: 700, color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem'
              }}>
                Category
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategoryChange(cat)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.15s',
                        background: category === cat ? '#b91c1c' : 'transparent',
                        color: category === cat ? '#fff' : '#374151',
                        fontWeight: category === cat ? 600 : 400,
                      }}
                      onMouseEnter={e => {
                        if (category !== cat) e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={e => {
                        if (category !== cat) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
              {loading ? '' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
            </p>

            {loading ? (
              <LoadingSpinner />
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏺</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  No products found
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  {products.length === 0
                    ? 'Products will appear here once the database is connected.'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}>
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .products-sidebar {
            display: ${showFilters ? 'block' : 'none'} !important;
            width: 100% !important;
          }
          .filter-mobile-btn {
            display: flex !important;
          }
        }
        @media (min-width: 768px) {
          .products-sidebar {
            display: block !important;
          }
          .filter-mobile-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;
