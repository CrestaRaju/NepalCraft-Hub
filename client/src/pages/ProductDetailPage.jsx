import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, CheckCircle, Truck, RefreshCw, Info, User, Star } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const NPR_TO_GBP = 0.0060;
const UK_VAT = 0.20;
const SHIPPING_FEE = 12.99;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (!product) return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
      <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Product not found</p>
      <Link to="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
        Back to Shop
      </Link>
    </div>
  );

  const images = (() => { try { return JSON.parse(product.images); } catch { return [product.images]; } })();
  const gbpPrice = (parseFloat(product.priceNPR) * NPR_TO_GBP).toFixed(2);
  const subtotal = (parseFloat(gbpPrice) * quantity).toFixed(2);
  const vatAmount = (parseFloat(subtotal) * UK_VAT).toFixed(2);
  const totalLanded = (parseFloat(subtotal) + parseFloat(vatAmount) + SHIPPING_FEE).toFixed(2);
  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error(`Only ${product.stock} in stock`);
      return;
    }
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to review'); return; }
    setSubmittingReview(true);
    try {
      await api.post('/reviews', { productId: product.id, ...reviewForm });
      toast.success('Review submitted!');
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const s = {
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '3rem',
      marginBottom: '3rem',
    },
    imageSection: {
      flex: 1,
    },
    mainImage: {
      width: '100%',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: '1.5rem',
      backgroundColor: '#f3f4f6',
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    thumb: (isActive) => ({
      width: '4rem',
      height: '4rem',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      border: `2px solid ${isActive ? '#b91c1c' : 'transparent'}`,
      cursor: 'pointer',
      padding: 0,
      background: 'none',
    }),
    badgeCategory: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      background: '#fef2f2',
      color: '#b91c1c',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
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
      fontWeight: 600,
    },
    priceBox: {
      background: '#f9f8f6',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      border: '1px solid #f3f2ee',
    },
    breakdownRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
    },
    qtyWrap: {
      display: 'flex',
      alignItems: 'center',
      border: '1.5px solid #e5e7eb',
      borderRadius: '0.75rem',
      overflow: 'hidden',
    },
    tabsWrap: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '2rem',
    },
    tabBtn: (isActive) => ({
      padding: '1rem 1.5rem',
      background: 'none',
      border: 'none',
      borderBottom: `2px solid ${isActive ? '#b91c1c' : 'transparent'}`,
      color: isActive ? '#b91c1c' : '#6b7280',
      fontWeight: 600,
      fontSize: '0.9375rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    })
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl" style={{ padding: '2rem 1.5rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: '#9ca3af', textDecoration: 'none' }}>Shop</Link>
          <span>/</span>
          <span style={{ color: '#374151', fontWeight: 500 }} className="line-clamp-1">{product.name}</span>
        </nav>

        <div className="product-detail-grid" style={s.grid}>
          {/* Photos */}
          <div style={s.imageSection}>
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
              style={s.mainImage}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600'; }}
            />
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} style={s.thumb(selectedImage === i)}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={s.badgeCategory}>{product.category}</span>
              {product.isVerified && (
                <span style={s.badgeVerified}><CheckCircle size={14} /> Verified Authentic</span>
              )}
            </div>

            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <StarRating rating={parseFloat(avgRating)} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{avgRating}</span>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>({product.reviews?.length} reviews)</span>
              </div>
            )}

            {/* Seller */}
            {product.seller && (
              <Link to={`/seller/${product.sellerId}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                marginBottom: '2rem', textDecoration: 'none', padding: '0.5rem',
                borderRadius: '0.75rem', border: '1px solid #f3f4f6', width: 'fit-content'
              }} className="seller-card-hover">
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  background: '#fef2f2', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#b91c1c'
                }}>
                  <User size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {product.seller.firstName} {product.seller.lastName}
                    {product.seller.isVerified && <CheckCircle size={12} style={{ marginLeft: '4px', color: '#10b981', display: 'inline' }} />}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Verified Artisan</p>
                </div>
              </Link>
            )}

            {/* Pricing Card */}
            <div style={s.priceBox}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 700, color: '#b91c1c' }}>£{gbpPrice}</span>
                <span style={{ fontSize: '0.9375rem', color: '#6b7280' }}>per item</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
                approx. NPR {parseInt(product.priceNPR).toLocaleString()}
              </p>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={s.breakdownRow}>
                  <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span>£{subtotal}</span>
                </div>
                <div style={s.breakdownRow}>
                  <span>UK VAT (20%)</span>
                  <span>£{vatAmount}</span>
                </div>
                <div style={s.breakdownRow}>
                  <span>DHL Express Shipping</span>
                  <span>£{SHIPPING_FEE}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', fontWeight: 700,
                  fontSize: '1rem', color: '#111827', marginTop: '0.75rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem'
                }}>
                  <span>Total Landed Cost</span>
                  <span>£{totalLanded}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div style={s.qtyWrap}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#6b7280' }}
                >−</button>
                <span style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#111827', minWidth: '2.5rem', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#6b7280' }}
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <ShoppingCart size={20} />
                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Status Info */}
            {product.stock > 0 && product.stock <= 10 && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#d97706', marginBottom: '1.5rem' }}>
                ⚡ Only {product.stock} left in stock
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              {[
                { icon: <Truck size={20} />, label: 'Fast DHL Express' },
                { icon: <RefreshCw size={20} />, label: '30-Day Returns' },
                { icon: <Info size={20} />, label: 'UK VAT Included' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                  <div style={{ color: '#b91c1c' }}>{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div style={{ marginTop: '4rem' }}>
          <div style={s.tabsWrap}>
            {['description', 'provenance', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={s.tabBtn(activeTab === tab)}>
                {tab === 'reviews' ? `Reviews (${product.reviews?.length || 0})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: '48rem', minHeight: '200px' }}>
            {activeTab === 'description' && (
              <div style={{ color: '#4b5563', lineHeight: 1.75, fontSize: '1.0625rem', whiteSpace: 'pre-line' }}>
                {product.description}
              </div>
            )}

            {activeTab === 'provenance' && (
              <div style={{
                background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '1.25rem', padding: '2rem'
              }}>
                <h3 style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#92400e',
                  marginBottom: '1rem', fontSize: '1.125rem'
                }}>
                  <CheckCircle size={20} style={{ color: '#d97706' }} /> Artisan Provenance Story
                </h3>
                <p style={{ color: '#b45309', margin: 0, lineHeight: 1.8 }}>
                  {product.provenanceStory || "This authentic piece was handcrafted using traditional techniques passed down through generations. Supporting local Nepali artisans preserves cultural heritage and provides sustainable livelihoods."}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {user && user.role === 'buyer' && (
                  <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2rem' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Write a Review</h4>
                    <form onSubmit={handleSubmitReview}>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ ...s.label, marginBottom: '0.5rem' }}>Rating</label>
                        <StarRating
                          rating={reviewForm.rating}
                          interactive
                          onChange={(r) => setReviewForm(f => ({ ...f, rating: r }))}
                          size={24}
                        />
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                        placeholder="Share your thoughts on this handicraft..."
                        className="input-field"
                        style={{ height: '100px', marginBottom: '1rem' }}
                        required
                      />
                      <button type="submit" disabled={submittingReview} className="btn-primary">
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>
                  </div>
                )}

                {product.reviews?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                    <Star size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {product.reviews?.map(rev => (
                      <div key={rev.id} style={{
                        padding: '1.5rem', background: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                              background: '#f3f4f6', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontWeight: 700, color: '#6b7280'
                            }}>
                              {rev.user?.firstName?.[0] || 'A'}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>
                                {rev.user?.firstName} {rev.user?.lastName}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                                {new Date(rev.createdAt).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={rev.rating} size={14} />
                        </div>
                        <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        .seller-card-hover:hover {
          border-color: #fca5a5 !important;
          background-color: #fffafb !important;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
