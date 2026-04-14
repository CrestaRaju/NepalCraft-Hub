import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Mail, BookOpen, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', address: '', provenanceStory: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const u = res.data.user;
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          phoneNumber: u.phoneNumber || '',
          address: u.address || '',
          provenanceStory: u.provenanceStory || ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated successfully! ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{
        width: '3rem', height: '3rem', border: '4px solid #f3f3f3',
        borderTop: '4px solid #b91c1c', borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{'@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}'}</style>
    </div>
  );

  const s = {
    avatar: {
      width: '5rem',
      height: '5rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 700,
      color: '#fff',
      boxShadow: '0 4px 12px rgba(185, 28, 28, 0.25)',
    },
    badge: (role) => ({
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      background: role === 'seller' ? '#fef3c7' : role === 'admin' ? '#f3e8ff' : '#eff6ff',
      color: role === 'seller' ? '#92400e' : role === 'admin' ? '#6b21a8' : '#1e40af',
      marginTop: '0.5rem',
    }),
    card: {
      background: '#fff',
      borderRadius: '1.25rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      border: '1px solid #f3f4f6',
      padding: '2.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      marginBottom: '1.25rem',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl" style={{ padding: '3rem 1.5rem', maxWidth: '42rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={s.avatar}>
            {form.firstName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
            }}>
              {form.firstName} {form.lastName}
            </h1>
            <span style={s.badge(user?.role)}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} style={s.card}>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            Account Settings
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }} className="grid-cols-2-mobile">
            <div style={s.formGroup}>
              <label style={s.label}><User size={14} /> First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="input-field" placeholder="First Name" />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className="input-field" placeholder="Last Name" />
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}><Mail size={14} /> Email Address</label>
            <input type="email" value={form.email} readOnly className="input-field" style={{ background: '#f9fafb', color: '#6b7280', cursor: 'not-allowed' }} />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Email can only be changed by contacting support.</p>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}><Phone size={14} /> Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+44 7XXX XXXXXX" className="input-field" />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}><MapPin size={14} /> Default Delivery Address (UK)</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} style={{ resize: 'none' }} className="input-field" />
          </div>

          {user?.role === 'seller' && (
            <div style={{ ...s.formGroup, marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dotted #e5e7eb' }}>
              <label style={s.label}><BookOpen size={14} /> Artisan Provenance Story</label>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 0.5rem' }}>
                Your story will be shown on every product page to connect with buyers.
              </p>
              <textarea
                name="provenanceStory"
                value={form.provenanceStory}
                onChange={handleChange}
                rows={5}
                placeholder="Share your heritage, techniques, and the story behind your crafts..."
                className="input-field"
                style={{ resize: 'none', lineHeight: 1.6 }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}
          >
            {saving ? 'Saving...' : (
              <>
                <Save size={18} />
                Save Profile Changes
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .grid-cols-2-mobile {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
