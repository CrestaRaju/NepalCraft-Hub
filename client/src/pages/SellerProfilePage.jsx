import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, MapPin, Phone, ArrowLeft } from 'lucide-react';
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

  if (loading) return <LoadingSpinner message="Loading seller profile..." />;
  if (!seller) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Seller not found</p>
      <Link to="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link>
    </div>
  );

  const totalReviews = seller.products?.reduce((sum, p) => sum + (p.reviews?.length || 0), 0) || 0;
  const allRatings = seller.products?.flatMap(p => p.reviews?.map(r => r.rating) || []) || [];
  const avgRating = allRatings.length ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : null;

  return (
    <div className="page-wrapper">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        {/* Seller Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {seller.firstName?.[0]}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {seller.firstName} {seller.lastName}
                </h1>
                {seller.isVerified && (
                  <span className="badge-verified"><CheckCircle size={12} /> Verified Artisan</span>
                )}
              </div>

              {seller.address && (
                <p className="text-gray-500 text-sm flex items-center gap-1 justify-center sm:justify-start mb-3">
                  <MapPin size={14} /> {seller.address}
                </p>
              )}

              <div className="flex flex-wrap gap-5 justify-center sm:justify-start text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900">{seller.products?.length || 0}</p>
                  <p className="text-gray-400 text-xs">Products</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{totalReviews}</p>
                  <p className="text-gray-400 text-xs">Reviews</p>
                </div>
                {avgRating && (
                  <div className="text-center">
                    <p className="font-bold text-gray-900">⭐ {avgRating}</p>
                    <p className="text-gray-400 text-xs">Avg Rating</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Provenance Story */}
          {seller.provenanceStory && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-900 mb-2">About This Artisan</h3>
              <p className="text-amber-800 text-sm leading-relaxed">{seller.provenanceStory}</p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Products by {seller.firstName}
          </h2>
          {seller.products?.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No products listed yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {seller.products?.map(product => (
                <ProductCard key={product.id} product={{ ...product, seller: { firstName: seller.firstName, lastName: seller.lastName, isVerified: seller.isVerified } }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfilePage;
