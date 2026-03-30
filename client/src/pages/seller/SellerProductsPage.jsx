import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = ['Paintings & Art', 'Textiles & Fabrics', 'Meditation & Wellness', 'Sculptures & Statues', 'Stationery & Paper Crafts'];

const SellerProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', priceNPR: '', stock: '', category: CATEGORIES[0], provenanceStory: '', images: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchMyProducts = async () => {
    try {
      const res = await api.get('/products');
      const myProducts = (res.data.products || []).filter(p => p.sellerId === user?.id);
      setProducts(myProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyProducts(); }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openEditForm = (product) => {
    setEditingProduct(product);
    const images = (() => { try { return JSON.parse(product.images).join(', '); } catch { return product.images || ''; } })();
    setForm({
      name: product.name, description: product.description,
      priceNPR: product.priceNPR, stock: product.stock,
      category: product.category, provenanceStory: product.provenanceStory || '',
      images
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', priceNPR: '', stock: '', category: CATEGORIES[0], provenanceStory: '', images: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      priceNPR: parseFloat(form.priceNPR),
      stock: parseInt(form.stock),
      images: JSON.stringify(form.images.split(',').map(s => s.trim()).filter(Boolean))
    };
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      await fetchMyProducts();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      await fetchMyProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-wrapper">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title mb-1">My Products</h1>
            <p className="text-gray-500 text-sm">{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="e.g., Hand-painted Thangka" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input-field resize-none" placeholder="Detailed product description..." />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Price (NPR) *</label>
                    <input name="priceNPR" type="number" min="1" value={form.priceNPR} onChange={handleChange} required className="input-field" placeholder="45000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Stock *</label>
                    <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="input-field" placeholder="10" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} className="input-field">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Image URLs (comma-separated)</label>
                  <textarea name="images" value={form.images} onChange={handleChange} rows={2} className="input-field resize-none" placeholder="https://..., https://..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Provenance Story</label>
                  <textarea name="provenanceStory" value={form.provenanceStory} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Tell the story behind this product..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForm} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
                    {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Package size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-400 mb-6">Start selling by adding your first handicraft product</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Add First Product</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Price (NPR)</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Price (£)</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Stock</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Verified</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => {
                  const images = (() => { try { return JSON.parse(p.images); } catch { return [p.images]; } })();
                  const gbp = (parseFloat(p.priceNPR) * 0.0060).toFixed(2);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=80'; }} />
                          <span className="font-medium text-gray-900 line-clamp-2 max-w-xs">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.category}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">NPR {parseInt(p.priceNPR).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold text-red-700">£{gbp}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${p.stock <= 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.isVerified
                          ? <CheckCircle size={16} className="text-green-500 mx-auto" />
                          : <XCircle size={16} className="text-gray-300 mx-auto" />
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEditForm(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProductsPage;
