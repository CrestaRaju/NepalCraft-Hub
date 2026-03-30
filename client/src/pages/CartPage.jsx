import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartCount, subtotalGBP, vatGBP, totalGBP, shippingFeeGBP, subtotalNPR } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Discover authentic Nepali handicrafts and add them to your cart.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const images = (() => { try { return JSON.parse(item.images); } catch { return [item.images]; } })();
              const gbpPrice = (parseFloat(item.priceNPR) * 0.0060).toFixed(2);

              return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4">
                  <Link to={`/products/${item.id}`} className="shrink-0">
                    <img
                      src={images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=200'; }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 hover:text-red-700 transition-colors line-clamp-2">{item.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-400 mb-3">{item.category}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-red-700">£{(parseFloat(gbpPrice) * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">£{gbpPrice} each</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>£{subtotalGBP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>UK VAT (20%)</span>
                  <span>£{vatGBP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping (DHL to UK)</span>
                  <span>£{shippingFeeGBP.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>£{totalGBP.toFixed(2)}</span>
                </div>
              </div>

              {/* VAT Notice */}
              <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 mb-5 text-xs text-blue-700">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>UK VAT (20%) and import duties are included in the total. No hidden costs at delivery.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                NPR equivalent: NPR {subtotalNPR.toLocaleString()}
              </p>

              <Link to="/products" className="block text-center text-sm text-red-700 hover:text-red-800 mt-3 font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
