import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

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
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center py-20">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-red-700 flex items-center justify-center text-white text-2xl font-bold">
            {form.firstName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              {form.firstName} {form.lastName}
            </h1>
            <span className={`text-sm capitalize font-medium px-3 py-1 rounded-full ${
              user?.role === 'seller' ? 'bg-amber-100 text-amber-700' :
              user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
            <input type="email" value={form.email} readOnly className="input-field bg-gray-50 cursor-not-allowed text-gray-500" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+977-98..." className="input-field" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="input-field resize-none" />
          </div>

          {user?.role === 'seller' && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Artisan Provenance Story</label>
              <p className="text-xs text-gray-400 mb-2">Tell buyers about your craft tradition, techniques, and background</p>
              <textarea
                name="provenanceStory"
                value={form.provenanceStory}
                onChange={handleChange}
                rows={5}
                placeholder="Share your story as an artisan..."
                className="input-field resize-none"
              />
            </div>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
