import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, subtotalGBP, vatGBP, totalGBP, shippingFeeGBP, subtotalNPR, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: user?.address || '',
    city: '',
    postcode: '',
    // Mock card fields
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1); // 1=shipping, 2=payment

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!form.address || !form.city || !form.postcode) {
      toast.error('Please fill in your shipping address');
      return;
    }
    if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv) {
      toast.error('Please fill in your payment details');
      return;
    }

    setPlacing(true);
    try {
      const shippingAddress = `${form.address}, ${form.city}, ${form.postcode}, United Kingdom`;

      // Create order
      const orderRes = await api.post('/orders', {
        items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
        totalAmountNPR: subtotalNPR,
        totalAmountGBP: subtotalGBP.toFixed(2),
        vatAmountGBP: vatGBP.toFixed(2),
        shippingFeeGBP: shippingFeeGBP.toFixed(2),
        shippingAddress
      });

      const orderId = orderRes.data.order.id;

      // Mock payment processing
      await api.post('/payments', {
        orderId,
        amount: totalGBP.toFixed(2),
        currency: 'GBP'
      });

      // Create mock shipment
      await api.post('/shipments', { orderId });

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders?success=true`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const s = {
    stepsWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '2rem',
    },
    stepBtn: (isActive, isDone) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      border: 'none',
      background: isActive ? '#b91c1c' : 'transparent',
      color: isActive ? '#fff' : '#6b7280',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    stepCircle: (isActive) => ({
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '50%',
      border: `2px solid ${isActive ? '#fff' : '#d1d5db'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
    }),
    divider: {
      width: '2rem',
      height: '2px',
      background: '#e5e7eb',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
    card: {
      background: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #f3f4f6',
      padding: '2rem',
    },
    formGroup: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.375rem',
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl" style={{ padding: '2rem 1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>Checkout</h1>

        {/* Steps */}
        <div style={s.stepsWrap}>
          {['Shipping Details', 'Payment'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setStep(i + 1)}
                style={s.stepBtn(step === i + 1, step > i + 1)}
              >
                {step > i + 1 ? (
                  <CheckCircle size={16} style={{ color: '#4ade80' }} />
                ) : (
                  <span style={s.stepCircle(step === i + 1)}>{i + 1}</span>
                )}
                {label}
              </button>
              {i < 1 && <div style={s.divider} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout-grid" style={s.grid}>
          {/* Main Form Area */}
          <div>
            {step === 1 && (
              <div style={s.card}>
                <h2 style={{ fontWeight: 700, color: '#111827', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                  Shipping Address (UK)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Full Name</label>
                    <input
                      type="text"
                      value={`${user?.firstName} ${user?.lastName}`}
                      readOnly
                      className="input-field"
                      style={{ background: '#f9fafb', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Street Address *</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="e.g., 42 Baker Street"
                      className="input-field"
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={s.label}>City *</label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g., London"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label style={s.label}>Postcode *</label>
                      <input
                        name="postcode"
                        value={form.postcode}
                        onChange={handleChange}
                        placeholder="e.g., SW1A 1AA"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={s.label}>Country</label>
                    <input
                      value="United Kingdom 🇬🇧"
                      readOnly
                      className="input-field"
                      style={{ background: '#f9fafb', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <Lock size={20} style={{ color: '#16a34a' }} />
                  <h2 style={{ fontWeight: 700, color: '#111827', fontSize: '1.25rem', margin: 0 }}>
                    Secure Payment (Mock)
                  </h2>
                </div>

                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#92400e',
                }}>
                  <Info size={18} style={{ flexShrink: 0 }} />
                  <span>This is a <strong>mock payment</strong> for demonstration. No real charges will be made. Enter any test card details.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Cardholder Name *</label>
                    <input
                      name="cardName"
                      value={form.cardName}
                      onChange={handleChange}
                      placeholder="James Thompson"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={s.label}>Card Number *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="input-field"
                        style={{ paddingRight: '3rem' }}
                      />
                      <CreditCard
                        size={18}
                        style={{
                          position: 'absolute', right: '1rem',
                          top: '50%', transform: 'translateY(-50%)',
                          color: '#9ca3af'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={s.label}>Expiry Date *</label>
                      <input
                        name="expiry"
                        value={form.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label style={s.label}>CVV *</label>
                      <input
                        name="cvv"
                        value={form.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => setStep(1)}
                    className="btn-outline"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {placing ? 'Processing...' : `Place Order · £${totalGBP.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div style={{
              background: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              border: '1px solid #f3f4f6',
              padding: '1.5rem',
              position: 'sticky',
              top: '5rem',
            }}>
              <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem', marginBottom: '1.25rem' }}>
                Order Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {cartItems.map(item => {
                  const images = (() => { try { return JSON.parse(item.images); } catch { return [item.images]; } })();
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img
                        src={images[0]}
                        alt={item.name}
                        style={{ width: '3.5rem', height: '3.5rem', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492914791-8a67e35b6f40?w=100&q=80'; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: 600, color: '#111827', fontSize: '0.8125rem',
                          margin: 0, lineHeight: 1.3
                        }} className="line-clamp-2">
                          {item.name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0' }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', margin: 0, flexShrink: 0 }}>
                        £{(parseFloat(item.priceNPR) * 0.0060 * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div style={{
                borderTop: '1px solid #f3f4f6',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                fontSize: '0.875rem',
                color: '#6b7280',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>£{subtotalGBP.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>VAT (20%)</span>
                  <span>£{vatGBP.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span>£{shippingFeeGBP.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  color: '#111827',
                  borderTop: '1px solid #f3f4f6',
                  paddingTop: '0.75rem',
                  marginTop: '0.25rem',
                  fontSize: '1rem',
                }}>
                  <span>Total</span>
                  <span>£{totalGBP.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .checkout-layout-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
