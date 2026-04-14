import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusConfig = {
  pending:   { icon: <Clock size={16} />,       bg: '#fefce8', color: '#854d0e', label: 'Pending' },
  paid:      { icon: <CheckCircle size={16} />,  bg: '#eff6ff', color: '#1e40af', label: 'Paid' },
  shipped:   { icon: <Truck size={16} />,        bg: '#faf5ff', color: '#6b21a8', label: 'Shipped' },
  delivered: { icon: <CheckCircle size={16} />,  bg: '#ecfdf5', color: '#065f46', label: 'Delivered' },
  cancelled: { icon: <XCircle size={16} />,      bg: '#fef2f2', color: '#991b1b', label: 'Cancelled' },
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

  if (loading) return <LoadingSpinner message="Loading your orders..." />;

  const s = {
    card: {
      background: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #f3f4f6',
      padding: '1.5rem',
      marginBottom: '1.25rem',
    },
    badge: (status) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.875rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: statusConfig[status]?.bg || '#f3f4f6',
      color: statusConfig[status]?.color || '#4b5563',
    }),
    orderId: {
      fontSize: '0.8125rem',
      color: '#9ca3af',
      fontFamily: 'monospace',
      fontWeight: 500,
      marginBottom: '0.25rem',
    },
    itemRow: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f9fafb',
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl" style={{ padding: '2rem 1.5rem', maxWidth: '56rem' }}>
        <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>My Orders</h1>
        <p style={{ color: '#6b7280', marginBottom: '2.5rem' }}>Track your authentic Nepali handicraft orders</p>

        {justOrdered && (
          <div style={{
            background: '#ecfdf5', borderRadius: '1rem', padding: '1.5rem',
            border: '1.5px solid #10b981', display: 'flex', gap: '1rem',
            alignItems: 'flex-start', marginBottom: '2rem'
          }}>
            <CheckCircle size={28} style={{ color: '#059669', flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: '0 0 0.25rem', color: '#064e3b', fontWeight: 700 }}>Order Received!</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#059669', lineHeight: 1.5 }}>
                Your order was placed successfully. Our artisans in Nepal are now preparing your items. 
                Estimated arrival in UK: 7-14 business days.
              </p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <Package size={80} style={{ color: '#f3f4f6', marginBottom: '1.5rem' }} />
            <h3 style={{ color: '#374151', margin: '0 0 0.5rem' }}>No orders yet</h3>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Experience the beauty of Nepal. Your first purchase awaits!</p>
            <Link to="/products" className="btn-primary" style={{ display: 'inline-flex' }}>
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {orders.map(order => (
              <div key={order.id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={s.orderId}>ID: {order.id.slice(0, 12).toUpperCase()}</p>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span style={s.badge(order.status)}>
                    {statusConfig[order.status]?.icon}
                    {statusConfig[order.status]?.label || order.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {order.items?.map(item => {
                    const images = (() => { try { return JSON.parse(item.product?.images); } catch { return [item.product?.images]; } })();
                    return (
                      <div key={item.id} style={s.itemRow}>
                        <img
                          src={images?.[0]}
                          alt={item.product?.name}
                          style={{ width: '3rem', height: '3rem', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492914791-8a67e35b6f40?w=100&q=80'; }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }} className="line-clamp-1">
                            {item.product?.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0' }}>
                            Qty: {item.quantity} × NPR {parseInt(item.priceAtPurchaseNPR).toLocaleString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '0.875rem' }}>
                          £{(parseInt(item.priceAtPurchaseNPR) * 0.006 * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking */}
                {order.trackingNumber && (
                  <div style={{
                    background: '#eff6ff', borderRadius: '0.75rem', padding: '0.875rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    fontSize: '0.8125rem', color: '#1e40af', marginBottom: '1.5rem'
                  }}>
                    <Truck size={16} />
                    <span>Track Shipment: <strong style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</strong></span>
                  </div>
                )}

                {/* Footer Info */}
                <div style={{
                  borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, margin: '0 0 0.375rem' }}>
                      Delivery Address
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0, lineHeight: 1.4 }}>
                      {order.shippingAddress}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#b91c1c', margin: 0 }}>
                      £{parseFloat(order.totalAmountGBP).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '2px 0 0' }}>
                      Inc. £{parseFloat(order.vatAmountGBP).toFixed(2)} VAT
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
