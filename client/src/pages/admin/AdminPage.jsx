import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, PoundSterling, CheckCircle, XCircle, Trash2, Shield } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
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
    dashboard: <PoundSterling size={16} />,
    users: <Users size={16} />,
    products: <Package size={16} />,
    orders: <ShoppingBag size={16} />
  };

  return (
    <div className="page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-red-700 rounded-xl text-white"><Shield size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage users, products, and orders</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-white shadow text-red-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tabIcons[tab]} {tab}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && stats && (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Total Products', value: stats.totalProducts, icon: <Package size={24} />, color: 'bg-green-50 text-green-600' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, color: 'bg-purple-50 text-purple-600' },
                    { label: 'Revenue (£)', value: `£${parseFloat(stats.totalRevenue || 0).toFixed(2)}`, icon: <PoundSterling size={24} />, color: 'bg-amber-50 text-amber-600' },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className={`inline-flex p-3 rounded-xl ${s.color} mb-3`}>{s.icon}</div>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-gray-500 text-sm">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Verified</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                              <p className="text-gray-400 text-xs">{u.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'seller' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => verifyUser(u)} title={u.isVerified ? 'Unverify' : 'Verify'}>
                              {u.isVerified
                                ? <CheckCircle size={18} className="text-green-500 mx-auto" />
                                : <XCircle size={18} className="text-gray-300 mx-auto" />}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleUserStatus(u)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                u.isActive ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'
                              }`}
                            >
                              {u.isActive ? 'Active' : 'Blocked'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {u.role !== 'admin' && (
                              <button onClick={() => deleteUser(u.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Seller</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">Price (£)</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Stock</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900 max-w-xs line-clamp-2">{p.name}</p>
                            <span className="badge-category text-xs mt-1 inline-block">{p.category}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {p.seller?.firstName} {p.seller?.lastName}
                            {p.seller?.isVerified && <CheckCircle size={12} className="inline ml-1 text-green-500" />}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-red-700">
                            £{(parseFloat(p.priceNPR) * 0.006).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            <span className={p.stock <= 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-green-600'}>{p.stock}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => verifyProduct(p)} title={p.isVerified ? 'Unverify' : 'Verify'}>
                              {p.isVerified
                                ? <CheckCircle size={18} className="text-green-500 mx-auto" />
                                : <XCircle size={18} className="text-gray-300 mx-auto cursor-pointer hover:text-amber-500" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Order ID</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Buyer</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">Total (£)</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-gray-600">#{o.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{o.buyer?.firstName} {o.buyer?.lastName}</p>
                            <p className="text-gray-400 text-xs">{o.buyer?.email}</p>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">£{parseFloat(o.totalAmountGBP).toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                              o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              o.status === 'paid' ? 'bg-purple-100 text-purple-700' :
                              o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>{o.status}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
                          <td className="px-4 py-3 text-center">
                            <select
                              defaultValue={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                            >
                              {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
