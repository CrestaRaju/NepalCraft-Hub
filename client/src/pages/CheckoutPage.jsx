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

  return (
    <div className="page-wrapper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-8">
          {['Shipping Details', 'Payment'].map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => setStep(i + 1)}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                  step === i + 1 ? 'bg-red-700 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {step > i + 1 ? <CheckCircle size={16} className="text-green-400" /> : <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">{i + 1}</span>}
                {s}
              </button>
              {i < 1 && <div className="w-8 h-0.5 bg-gray-200 mx-1"></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Shipping Address (UK)</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                    <input type="text" value={`${user?.firstName} ${user?.lastName}`} readOnly className="input-field bg-gray-50 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Street Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="e.g., 42 Baker Street" className="input-field" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">City *</label>
                      <input name="city" value={form.city} onChange={handleChange} placeholder="e.g., London" className="input-field" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Postcode *</label>
                      <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="e.g., SW1A 1AA" className="input-field" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Country</label>
                    <input value="United Kingdom 🇬🇧" readOnly className="input-field bg-gray-50 cursor-not-allowed" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary mt-6 w-full">
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Lock size={18} className="text-green-600" />
                  <h2 className="font-bold text-gray-900 text-lg">Secure Payment (Mock)</h2>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-2 text-sm text-amber-800">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <span>This is a <strong>mock payment</strong> for demonstration. No real charges will be made. Enter any test card details.</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Cardholder Name *</label>
                    <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="James Thompson" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Card Number *</label>
                    <div className="relative">
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="input-field pr-12"
                      />
                      <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Expiry Date *</label>
                      <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" maxLength={5} className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">CVV *</label>
                      <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" maxLength={4} type="password" className="input-field" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1">
                    {placing ? 'Processing...' : `Place Order · £${totalGBP.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => {
                  const images = (() => { try { return JSON.parse(item.images); } catch { return [item.images]; } })();
                  return (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <img src={images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-lg shrink-0" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=100'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium text-xs line-clamp-2">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs shrink-0">£{(parseFloat(item.priceNPR) * 0.0060 * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>£{subtotalGBP.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>VAT (20%)</span><span>£{vatGBP.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>£{shippingFeeGBP.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2"><span>Total</span><span>£{totalGBP.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
