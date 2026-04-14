import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, CheckCircle, XCircle, X, Search, MoreVertical } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
        toast.success('Product updated! ✨');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully! 🎉');
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

  if (loading) return <LoadingSpinner message="Loading your catalog..." />;

  const s = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    tableWrap: {
      background: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #f3f4f6',
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
      padding: '0.875rem 1rem',
      fontWeight: 700,
      color: '#4b5563',
      borderBottom: '1.5px solid #f3f4f6',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #f3f4f6',
      verticalAlign: 'middle',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1000,
    },
    modal: {
      background: '#fff',
      width: '100%',
      maxWidth: '44rem',
      borderRadius: '1.5rem',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '90vh',
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl" style={{ padding: '2rem 1.5rem' }}>
        <div style={s.header}>
          <div>
            <h1 className="section-title" style={{ margin: '0 0 0.25rem' }}>Dashboard</h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Manage your Nepali handicraft collection</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary">
            <Plus size={18} /> Add New Handicraft
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={s.modalOverlay}>
            <div style={s.modal}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>
                  {editingProduct ? 'Edit Handicraft' : 'Add New Handicraft to Shop'}
                </h2>
                <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  <X size={24} />
                </button>
              </div>
              <div style={{ padding: '2rem', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Product Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="e.g., Bronze Ganesh Statue" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Category *</label>
                      <select name="category" value={form.category} onChange={handleChange} className="input-field">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-field" style={{ resize: 'none' }} placeholder="Detail the craftsmanship and meaning..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Price (NPR) *</label>
                      <input name="priceNPR" type="number" value={form.priceNPR} onChange={handleChange} required className="input-field" placeholder="15000" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Stock Quantity *</label>
                      <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="input-field" placeholder="5" />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Image URL(s)</label>
                    <input name="images" value={form.images} onChange={handleChange} className="input-field" placeholder="Paste Unsplash or Dropbox image URL" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Artisan Provenance Story</label>
                    <textarea name="provenanceStory" value={form.provenanceStory} onChange={handleChange} rows={2} className="input-field" style={{ resize: 'none' }} placeholder="Share the background of this piece..." />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={resetForm} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                    <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      {submitting ? 'Saving...' : editingProduct ? 'Update Listing' : 'List Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Inventory List */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6' }}>
            <Package size={80} style={{ color: '#f3f4f6', marginBottom: '1.5rem' }} />
            <h3 style={{ color: '#374151', margin: '0 0 0.5rem' }}>No inventory listed</h3>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Ready to reach UK buyers? Start by adding your first product.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Get Started</button>
          </div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Product Details</th>
                  <th style={s.th}>Category</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Price (£)</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Stock</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Status</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const images = (() => { try { return JSON.parse(p.images); } catch { return [p.images]; } })();
                  return (
                    <tr key={p.id} className="hover-row">
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={images[0]}
                            alt=""
                            style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492914791-8a67e35b6f40?w=100'; }}
                          />
                          <span style={{ fontWeight: 600, color: '#111827' }} className="line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td style={s.td}><span style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{p.category}</span></td>
                      <td style={{ ...s.td, textAlign: 'right', fontWeight: 700, color: '#b91c1c' }}>£{(p.priceNPR * 0.006).toFixed(2)}</td>
                      <td style={{ ...s.td, textAlign: 'center' }}>
                        <span style={{
                          fontWeight: 700,
                          color: p.stock <= 0 ? '#ef4444' : p.stock <= 5 ? '#f59e0b' : '#10b981'
                        }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: 'center' }}>
                        {p.isVerified ? (
                          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}>
                            <CheckCircle size={14} /> LIVE
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <XCircle size={14} /> PENDING
                          </span>
                        )}
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button onClick={() => openEditForm(p)} style={{ padding: '0.4rem', borderRadius: '0.5rem', border: 'none', background: '#eff6ff', color: '#1e40af', cursor: 'pointer' }}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} style={{ padding: '0.4rem', borderRadius: '0.5rem', border: 'none', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>
                            <Trash2 size={16} />
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
      <style>{`
        .hover-row:hover { background-color: #f9fafb; }
      `}</style>
    </div>
  );
};

export default SellerProductsPage;
