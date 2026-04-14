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
        <div style={{
          maxWidth: '32rem', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center'
        }}>
          <div style={{ color: '#e5e7eb', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <ShoppingBag size={72} />
          </div>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '1.625rem',
            fontWeight: 700, color: '#374151', margin: '0 0 0.75rem',
          }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Discover authentic Nepali handicrafts and add them to your cart.
          </p>
          <Link to="/products" className="btn-primary">
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
      <div className="container-xl" style={{ padding: '2rem 1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>
          Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => {
              const images = (() => { try { return JSON.parse(item.images); } catch { return [item.images]; } })();
              const gbpPrice = (parseFloat(item.priceNPR) * 0.0060).toFixed(2);

              return (
                <div key={item.id} style={{
                  background: '#fff',
                  borderRadius: '0.875rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  border: '1px solid #f3f4f6',
                  padding: '1rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}>
                  {/* Image */}
                  <Link to={`/products/${item.id}`} style={{ flexShrink: 0 }}>
                    <img
                      src={images[0]}
                      alt={item.name}
                      style={{ width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: '0.625rem' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492914791-8a67e35b6f40?w=200&q=80'; }}
                    />
                  </Link>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${item.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{
                        fontWeight: 600, color: '#111827', fontSize: '0.9375rem',
                        marginBottom: '0.25rem', lineHeight: 1.35,
                        transition: 'color 0.15s',
                      }}
                        className="line-clamp-2"
                        onMouseEnter={e => e.currentTarget.style.color = '#b91c1c'}
                        onMouseLeave={e => e.currentTarget.style.color = '#111827'}
                      >
                        {item.name}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
                      {item.category}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        border: '1.5px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden',
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            padding: '0.3rem 0.625rem', background: 'none', border: 'none',
                            cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{
                          padding: '0.3rem 0.75rem', fontSize: '0.875rem',
                          fontWeight: 600, minWidth: '2rem', textAlign: 'center',
                          borderLeft: '1.5px solid #e5e7eb', borderRight: '1.5px solid #e5e7eb',
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          style={{
                            padding: '0.3rem 0.625rem', background: 'none', border: 'none',
                            cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                            color: item.quantity >= item.stock ? '#d1d5db' : '#4b5563',
                            display: 'flex', alignItems: 'center',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { if (item.quantity < item.stock) e.currentTarget.style.background = '#f9fafb'; }}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, color: '#b91c1c', fontSize: '1rem', lineHeight: 1 }}>
                            £{(parseFloat(gbpPrice) * item.quantity).toFixed(2)}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>£{gbpPrice} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#d1d5db', padding: '0.25rem',
                            display: 'flex', alignItems: 'center',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                          onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              background: '#fff',
              borderRadius: '0.875rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              border: '1px solid #f3f4f6',
              padding: '1.5rem',
              position: 'sticky',
              top: '5rem',
            }}>
              <h2 style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem', marginBottom: '1.25rem' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Subtotal', value: `£${subtotalGBP.toFixed(2)}` },
                  { label: 'UK VAT (20%)', value: `£${vatGBP.toFixed(2)}` },
                  { label: 'Shipping (DHL to UK)', value: `£${shippingFeeGBP.toFixed(2)}` },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '1rem', fontWeight: 700, color: '#111827',
                  borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem', marginTop: '0.25rem',
                }}>
                  <span>Total</span>
                  <span>£{totalGBP.toFixed(2)}</span>
                </div>
              </div>

              {/* VAT Notice */}
              <div style={{
                display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                background: '#eff6ff', borderRadius: '0.625rem',
                padding: '0.75rem', marginBottom: '1.25rem',
                fontSize: '0.8125rem', color: '#1d4ed8',
              }}>
                <Info size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>UK VAT (20%) and import duties are included in the total. No hidden costs at delivery.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginTop: '0.75rem' }}>
                NPR equivalent: NPR {subtotalNPR.toLocaleString()}
              </p>

              <Link to="/products" style={{
                display: 'block', textAlign: 'center', fontSize: '0.875rem',
                color: '#b91c1c', fontWeight: 500, marginTop: '0.75rem',
                textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#991b1b'}
                onMouseLeave={e => e.currentTarget.style.color = '#b91c1c'}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .cart-layout { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
