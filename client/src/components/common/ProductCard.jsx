import { Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const NPR_TO_GBP = 0.0060;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const images = (() => {
    try { return JSON.parse(product.images); } catch { return [product.images]; }
  })();

  const gbpPrice = (parseFloat(product.priceNPR) * NPR_TO_GBP).toFixed(2);
  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product.id}`} className="card" style={{ display: 'block' }}>
      {/* Image */}
      <div className="product-img-wrap" style={{ height: '13rem', background: '#f3f4f6', position: 'relative' }}>
        <img
          src={images[0] || 'https://images.unsplash.com/photo-1524492914791-8a67e35b6f40?w=400&q=80'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1524492914791-8a67e35b6f40?w=400&q=80';
          }}
        />
        {/* Badges */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {product.isVerified && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
              background: '#16a34a', color: '#fff', fontSize: '0.65rem',
              padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600
            }}>
              <CheckCircle size={9} /> Verified
            </span>
          )}
          {product.stock <= 0 && (
            <span style={{
              background: '#374151', color: '#fff', fontSize: '0.65rem',
              padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600
            }}>
              Out of Stock
            </span>
          )}
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <span style={{
            position: 'absolute', top: '0.5rem', right: '0.5rem',
            background: '#d97706', color: '#fff', fontSize: '0.65rem',
            padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600
          }}>
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <span className="badge-category" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
          {product.category}
        </span>
        <h3 style={{
          color: '#111827', fontWeight: 600, fontSize: '0.9375rem',
          lineHeight: 1.3, marginBottom: '0.375rem',
          fontFamily: 'Inter, sans-serif',
          transition: 'color 0.2s',
        }}
          className="line-clamp-2"
        >
          {product.name}
        </h3>

        {/* Seller */}
        {product.seller && (
          <p style={{
            fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem',
            display: 'flex', alignItems: 'center', gap: '0.25rem'
          }}>
            By {product.seller.firstName} {product.seller.lastName}
            {product.seller.isVerified && <CheckCircle size={11} style={{ color: '#22c55e' }} />}
          </p>
        )}

        {/* Rating */}
        {avgRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <Star size={12} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{avgRating}</span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({product.reviews.length})</span>
          </div>
        )}

        {/* Price + Cart */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '0.75rem'
        }}>
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#b91c1c', lineHeight: 1 }}>
              £{gbpPrice}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>
              NPR {parseInt(product.priceNPR).toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            title="Add to Cart"
            style={{
              padding: '0.625rem',
              background: product.stock <= 0 ? '#d1d5db' : '#b91c1c',
              color: '#fff',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.background = '#991b1b'; }}
            onMouseLeave={e => { if (product.stock > 0) e.currentTarget.style.background = '#b91c1c'; }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
