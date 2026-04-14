import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, PoundSterling, CheckCircle, XCircle, Trash2, Shield, LayoutDashboard } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'dashboard') {
          const res = await api.get('/admin/dashboard');
          setStats(res.data.stats);
        } else if (activeTab === 'users') {
          const res = await api.get('/admin/users');
          setUsers(res.data.users);
        } else if (activeTab === 'products') {
          const res = await api.get('/admin/products');
          setProducts(res.data.products);
        } else if (activeTab === 'orders') {
          const res = await api.get('/admin/orders');
          setOrders(res.data.orders);
        }
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  const toggleUserStatus = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { isActive: !user.isActive, isVerified: user.isVerified });
      toast.success(`User ${user.isActive ? 'blocked' : 'activated'}!`);
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch { toast.error('Failed to update user'); }
  };

  const verifyUser = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { isActive: user.isActive, isVerified: !user.isVerified });
      toast.success(`User ${user.isVerified ? 'unverified' : 'verified'}!`);
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch { toast.error('Failed to verify user'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(u => u.filter(user => user.id !== id));
    } catch { toast.error('Failed to delete user'); }
  };

  const verifyProduct = async (product) => {
    try {
      await api.put(`/admin/products/${product.id}/verify`, { isVerified: !product.isVerified });
      toast.success(`Product ${product.isVerified ? 'unverified' : 'verified'}!`);
      const res = await api.get('/admin/products');
      setProducts(res.data.products);
    } catch { toast.error('Failed to verify product'); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated!');
      const res = await api.get('/admin/orders');
      setOrders(res.data.orders);
    } catch { toast.error('Failed to update order status'); }
  };

  const TABS = ['dashboard', 'users', 'products', 'orders'];
  const tabIcons = {
    dashboard: <LayoutDashboard size={16} />,
    users: <Users size={16} />,
    products: <Package size={16} />,
    orders: <ShoppingBag size={16} />
  };

  const s = {
    tabBar: {
      display: 'flex',
      gap: '0.25rem',
      background: '#f3f4f6',
      padding: '0.375rem',
      borderRadius: '0.875rem',
      width: 'fit-content',
      marginBottom: '2rem',
    },
    tabBtn: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.50rem',
      padding: '0.5rem 1.25rem',
      borderRadius: '0.625rem',
      border: 'none',
      background: isActive ? '#fff' : 'transparent',
      color: isActive ? '#b91c1c' : '#6b7280',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
      textTransform: 'capitalize',
      transition: 'all 0.2s',
    }),
    statCard: (bg, color) => ({
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '1.25rem',
      border: '1px solid #f3f4f6',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }),
    tableWrap: {
      background: '#fff',
      borderRadius: '1.25rem',
      border: '1px solid #f3f4f6',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.875rem',
      textAlign: 'left',
    },
    th: {
      background: '#f9fafb',
      padding: '1rem',
      fontWeight: 700,
      color: '#4b5563',
      borderBottom: '1px solid #f3f4f6',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #f9fafb',
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl" style={{ padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ padding: '1rem', background: '#b91c1c', borderRadius: '1rem', color: '#fff', boxShadow: '0 4px 12px rgba(185, 28, 28, 0.2)' }}>
            <Shield size={28} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>Management Console</h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9375rem' }}>Direct control over users, stock, and fulfillment</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabBar}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={s.tabBtn(activeTab === tab)}>
              {tabIcons[tab]} {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '5rem 0' }}><LoadingSpinner message="Accessing secure database..." /></div>
        ) : (
          <div>
            {/* Dashboard Stats */}
            {activeTab === 'dashboard' && stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {[
                  { label: 'Platform Users', value: stats.totalUsers, icon: <Users size={24} />, bg: '#eff6ff', color: '#1e40af' },
                  { label: 'Listed Products', value: stats.totalProducts, icon: <Package size={24} />, bg: '#ecfdf5', color: '#065f46' },
                  { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, bg: '#faf5ff', color: '#6b21a8' },
                  { label: 'Gross Revenue', value: `£${parseFloat(stats.totalRevenue || 0).toFixed(2)}`, icon: <PoundSterling size={24} />, bg: '#fffbeb', color: '#92400e' }
                ].map((item, i) => (
                  <div key={i} style={s.statCard()}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                      {item.icon}
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0 0 0.25rem' }}>{item.value}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0, fontWeight: 500 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Users Table */}
            {activeTab === 'users' && (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>User Details</th>
                      <th style={s.th}>Account Type</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Identity</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Account Status</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="admin-row-hover">
                        <td style={s.td}>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{u.firstName} {u.lastName}</p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{u.email}</p>
                        </td>
                        <td style={s.td}>
                          <span style={{
                            padding: '0.25rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700,
                            background: u.role === 'admin' ? '#f3e8ff' : u.role === 'seller' ? '#fef3c7' : '#eff6ff',
                            color: u.role === 'admin' ? '#6b21a8' : u.role === 'seller' ? '#92400e' : '#1e40af',
                            textTransform: 'uppercase'
                          }}>{u.role}</span>
                        </td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <button onClick={() => verifyUser(u)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {u.isVerified ? <CheckCircle size={20} style={{ color: '#10b981' }} /> : <XCircle size={20} style={{ color: '#d1d5db' }} />}
                          </button>
                        </td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <button
                            onClick={() => toggleUserStatus(u)}
                            style={{
                              padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                              background: u.isActive ? '#ecfdf5' : '#fef2f2',
                              color: u.isActive ? '#059669' : '#b91c1c',
                            }}
                          >
                            {u.isActive ? 'ACTIVE' : 'BLOCKED'}
                          </button>
                        </td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          {u.role !== 'admin' && (
                            <button onClick={() => deleteUser(u.id)} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Products Table */}
            {activeTab === 'products' && (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Handicraft</th>
                      <th style={s.th}>Artisan</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Price (£)</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Inventory</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="admin-row-hover">
                        <td style={s.td}>
                          <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }} className="line-clamp-1">{p.name}</p>
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '0.375rem', background: '#f3f4f6', color: '#6b7280', fontSize: '0.625rem', fontWeight: 700 }}>{p.category}</span>
                        </td>
                        <td style={s.td}>
                          <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>
                            {p.seller?.firstName} {p.seller?.lastName}
                            {p.seller?.isVerified && <CheckCircle size={12} style={{ color: '#10b981', marginLeft: '4px', display: 'inline' }} />}
                          </p>
                        </td>
                        <td style={{ ...s.td, textAlign: 'right', fontWeight: 700, color: '#b91c1c' }}>
                          £{(p.priceNPR * 0.006).toFixed(2)}
                        </td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <span style={{ fontWeight: 700, color: p.stock <= 0 ? '#ef4444' : p.stock <= 5 ? '#f59e0b' : '#10b981' }}>{p.stock}</span>
                        </td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <button onClick={() => verifyProduct(p)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {p.isVerified ? <CheckCircle size={20} style={{ color: '#10b981' }} /> : <XCircle size={20} style={{ color: '#d1d5db' }} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Orders Table */}
            {activeTab === 'orders' && (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Order ID</th>
                      <th style={s.th}>Buyer</th>
                      <th style={{ ...s.th, textAlign: 'right' }}>Total (£)</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Status</th>
                      <th style={s.th}>Date</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="admin-row-hover">
                        <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>#{o.id.slice(0, 10).toUpperCase()}</td>
                        <td style={s.td}>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{o.buyer?.firstName} {o.buyer?.lastName}</p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{o.buyer?.email}</p>
                        </td>
                        <td style={{ ...s.td, textAlign: 'right', fontWeight: 700, color: '#111827' }}>£{parseFloat(o.totalAmountGBP).toFixed(2)}</td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.625rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 800,
                            background: o.status === 'delivered' ? '#ecfdf5' : o.status === 'cancelled' ? '#fef2f2' : '#eff6ff',
                            color: o.status === 'delivered' ? '#065f46' : o.status === 'cancelled' ? '#b91c1c' : '#1e40af',
                            textTransform: 'uppercase'
                          }}>{o.status}</span>
                        </td>
                        <td style={{ ...s.td, color: '#6b7280', fontSize: '0.8125rem' }}>{new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <select
                            defaultValue={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            style={{
                              padding: '0.3rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb',
                              fontSize: '0.75rem', fontWeight: 600, outline: 'none'
                            }}
                          >
                            {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        .admin-row-hover:hover { background-color: #f9fafb; }
      `}</style>
    </div>
  );
};

export default AdminPage;
