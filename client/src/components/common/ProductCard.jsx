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
    <Link to={`/products/${product.id}`} className="card group block">
      {/* Image */}
      <div className="product-img-wrap h-52 bg-gray-100 relative">
        <img
          src={images[0] || 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400';
          }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isVerified && (
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              <CheckCircle size={10} /> Verified
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="badge-category mb-2 inline-block">{product.category}</span>
        <h3 className="text-gray-900 font-semibold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-red-700 transition-colors">
          {product.name}
        </h3>

        {/* Seller */}
        {product.seller && (
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            By {product.seller.firstName} {product.seller.lastName}
            {product.seller.isVerified && <CheckCircle size={11} className="text-green-500" />}
          </p>
        )}

        {/* Rating */}
        {avgRating && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700">{avgRating}</span>
            <span className="text-xs text-gray-400">({product.reviews.length})</span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-lg font-bold text-red-700">£{gbpPrice}</p>
            <p className="text-xs text-gray-400">NPR {parseInt(product.priceNPR).toLocaleString()}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
