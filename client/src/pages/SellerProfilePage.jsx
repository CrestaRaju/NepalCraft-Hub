import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, MapPin, Phone, ArrowLeft, Star, ShoppingBag, BadgeCheck } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SellerProfilePage = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await api.get(`/users/seller/${id}`);
        setSeller(res.data.seller);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading artisan profile..." />;
  if (!seller) return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
      <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Seller profile not found</p>
      <Link to="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Back to Shop</Link>
    </div>
  );

  const totalReviews = seller.products?.reduce((sum, p) => sum + (p.reviews?.length || 0), 0) || 0;
  const allRatings = seller.products?.flatMap(p => p.reviews?.map(r => r.rating) || []) || [];
  const avgRating = allRatings.length ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : null;

  const s = {
    avatar: {
      width: '6rem',
      height: '6rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #b91c1c 0%, #f59e0b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#fff',
      boxShadow: '0 8px 16px rgba(185, 28, 28, 0.15)',
      flexShrink: 0,
    },
    headerCard: {
      background: '#fff',
      borderRadius: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #f3f4f6',
      padding: '3rem 2rem',
      marginBottom: '3rem',
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
    },
    badgeVerified: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem',
      background: '#ecfdf5',
      color: '#059669',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: 700,
      marginTop: '0.50rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem' }} className="hover-red">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        {/* Profile Header */}
        <div style={s.headerCard}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
            <div style={s.avatar}>
              {seller.firstName?.[0]?.toUpperCase()}
            </div>
            
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                {seller.firstName} {seller.lastName}
              </h1>
              {seller.isVerified && (
                <span style={s.badgeVerified}>
                  <BadgeCheck size={14} /> VERIFIED ARTISAN
                </span>
              )}
              {seller.address && (
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', color: '#6b7280', fontSize: '0.9375rem', marginTop: '0.75rem' }}>
                  <MapPin size={16} style={{ color: '#b91c1c' }} /> {seller.address}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '2rem', width: '100%', maxWidth: '30rem' }}>
              <div style={s.statItem}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{seller.products?.length || 0}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Handicrafts</span>
              </div>
              <div style={s.statItem}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{totalReviews}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reviews</span>
              </div>
              {avgRating && (
                <div style={s.statItem}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={18} fill="#b91c1c" /> {avgRating}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</span>
                </div>
              )}
            </div>
          </div>

          {/* Story */}
          {seller.provenanceStory && (
            <div style={{ marginTop: '3rem', background: '#fcfaf7', borderRadius: '1.25rem', padding: '2.5rem', border: '1px solid #f3f2ee' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#111827', marginBottom: '1.25rem' }}>Our Heritage & Story</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1.0625rem', margin: 0, whiteSpace: 'pre-line' }}>
                {seller.provenanceStory}
              </p>
            </div>
          )}
        </div>

        {/* Catalog */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <ShoppingBag size={24} style={{ color: '#b91c1c' }} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Collection by {seller.firstName}
            </h2>
          </div>
          
          {seller.products?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', background: '#fff', borderRadius: '1.25rem', border: '1px dotted #e5e7eb' }}>
              <p style={{ color: '#9ca3af' }}>This artisan hasn't listed any products yet.</p>
            </div>
          ) : (
            <div style={s.grid}>
              {seller.products?.map(product => (
                <ProductCard key={product.id} product={{ ...product, seller: { firstName: seller.firstName, lastName: seller.lastName, isVerified: seller.isVerified } }} />
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .hover-red:hover { color: #b91c1c !important; }
      `}</style>
    </div>
  );
};

export default SellerProfilePage;
