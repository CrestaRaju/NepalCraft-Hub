import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, CheckCircle, Truck, RefreshCw, Info, User } from 'lucide-react';
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
    <div className="text-center py-20">
      <p className="text-xl text-gray-500">Product not found</p>
      <Link to="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link>
    </div>
  );

  const images = (() => { try { return JSON.parse(product.images); } catch { return [product.images]; } })();
  const gbpPrice = (parseFloat(product.priceNPR) * NPR_TO_GBP).toFixed(2);
  const vatAmount = (parseFloat(gbpPrice) * quantity * UK_VAT).toFixed(2);
  const totalLanded = (parseFloat(gbpPrice) * quantity + parseFloat(vatAmount) + SHIPPING_FEE).toFixed(2);
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
      // Refresh product data
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-red-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-red-700">Shop</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=600'; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-red-700' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-category">{product.category}</span>
              {product.isVerified && (
                <span className="badge-verified"><CheckCircle size={12} /> Verified Authentic</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={parseFloat(avgRating)} />
                <span className="text-sm font-medium text-gray-700">{avgRating}</span>
                <span className="text-sm text-gray-400">({product.reviews?.length} reviews)</span>
              </div>
            )}

            {/* Seller */}
            {product.seller && (
              <Link to={`/seller/${product.sellerId}`} className="flex items-center gap-2 mb-5 group">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <User size={14} className="text-red-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-red-700 transition-colors">
                    {product.seller.firstName} {product.seller.lastName}
                    {product.seller.isVerified && <CheckCircle size={12} className="inline ml-1 text-green-500" />}
                  </p>
                  <p className="text-xs text-gray-400">Verified Artisan</p>
                </div>
              </Link>
            )}

            {/* Pricing */}
            <div className="bg-stone-50 rounded-xl p-5 mb-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl font-bold text-red-700">£{gbpPrice}</span>
                <span className="text-sm text-gray-400">per item</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">NPR {parseInt(product.priceNPR).toLocaleString()} (Nepali Rupees)</p>

              {/* Landed Cost Breakdown */}
              <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({quantity} × £{gbpPrice})</span>
                  <span>£{(parseFloat(gbpPrice) * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>UK VAT (20%)</span>
                  <span>£{vatAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping to UK</span>
                  <span>£{SHIPPING_FEE}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total Landed Cost</span>
                  <span>£{totalLanded}</span>
                </div>
              </div>
            </div>

            {/* Quantity + Cart */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                >−</button>
                <span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Stock info */}
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-amber-600 text-sm mb-4 font-medium">⚡ Only {product.stock} left in stock</p>
            )}

            {/* Shipping info */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              <div className="flex flex-col items-center gap-1">
                <Truck size={18} className="text-red-700" />
                <span>DHL Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={18} className="text-red-700" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Info size={18} className="text-red-700" />
                <span>VAT Included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-0 border-b border-gray-200 mb-8">
            {['description', 'provenance', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviews?.length || 0})` : tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-3xl text-gray-700 leading-relaxed">{product.description}</div>
          )}

          {activeTab === 'provenance' && (
            <div className="max-w-3xl">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-amber-600" /> Artisan Provenance Story
                </h3>
                <p className="text-amber-800 leading-relaxed">{product.provenanceStory || 'Provenance story coming soon.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl">
              {/* Review Form */}
              {user && user.role === 'buyer' && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
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
                      placeholder="Share your experience with this product..."
                      className="input-field h-28 resize-none mb-4"
                      required
                    />
                    <button type="submit" disabled={submittingReview} className="btn-primary">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              {product.reviews?.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-5">
                  {product.reviews?.map(review => (
                    <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-sm font-bold">
                            {review.user?.firstName?.[0] || 'A'}
                          </div>
                          <span className="font-medium text-sm text-gray-900">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
