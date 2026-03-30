import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusConfig = {
  pending:   { icon: <Clock size={16} />,       color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  paid:      { icon: <CheckCircle size={16} />,  color: 'bg-blue-100 text-blue-800',    label: 'Paid' },
  shipped:   { icon: <Truck size={16} />,        color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  delivered: { icon: <CheckCircle size={16} />,  color: 'bg-green-100 text-green-800',  label: 'Delivered' },
  cancelled: { icon: <XCircle size={16} />,      color: 'bg-red-100 text-red-800',       label: 'Cancelled' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const justOrdered = searchParams.get('success') === 'true';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  return (
    <div className="page-wrapper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-2">My Orders</h1>
        <p className="text-gray-500 mb-8">Track your handicraft orders from Nepal to UK</p>

        {justOrdered && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-center gap-3">
            <CheckCircle size={24} className="text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Order placed successfully! 🎉</p>
              <p className="text-sm text-green-600 mt-0.5">Your Nepali handicrafts are on their way! Estimated delivery: 7-14 business days.</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Start shopping for authentic Nepali handicrafts!</p>
            <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {order.items?.map(item => {
                      const images = (() => { try { return JSON.parse(item.product?.images); } catch { return [item.product?.images]; } })();
                      return (
                        <div key={item.id} className="flex gap-3">
                          <img src={images?.[0]} alt={item.product?.name} className="w-12 h-12 object-cover rounded-lg shrink-0" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=100'; }} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × NPR {parseInt(item.priceAtPurchaseNPR).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-blue-700 mb-4">
                      <Truck size={16} />
                      <span>Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span></span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-gray-500">Shipping to: <span className="text-gray-700">{order.shippingAddress}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-base">£{parseFloat(order.totalAmountGBP).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">+ £{parseFloat(order.vatAmountGBP).toFixed(2)} VAT + £{parseFloat(order.shippingFeeGBP).toFixed(2)} shipping</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
