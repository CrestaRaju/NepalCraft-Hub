import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'buyer',
    phoneNumber: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { firstName, lastName, email, password, role, phoneNumber, address } = form;
      await register({ firstName, lastName, email, password, role, phoneNumber, address });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-red-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-bold">N</div>
            <span className="font-bold text-gray-900 text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>NepalCraft Hub</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the NepalCraft community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['buyer', 'seller'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: r }))}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.role === r
                    ? 'border-red-700 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {r === 'buyer' ? '🛒 I\'m a Buyer' : '🛠️ I\'m a Seller'}
                {form.role === r && <CheckCircle size={14} className="inline ml-1" />}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="James" required className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Last Name *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Thompson" required className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder={form.role === 'buyer' ? '+44 7700 900 123' : '+977 9801 234 567'} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                {form.role === 'buyer' ? 'UK Address' : 'Nepal Address'}
              </label>
              <input name="address" value={form.address} onChange={handleChange} placeholder={form.role === 'buyer' ? '42 Baker Street, London, W1U 6RT' : 'Thamel, Kathmandu, Nepal'} className="input-field" />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="input-field pr-10"
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password *</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-red-700 font-semibold hover:text-red-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
