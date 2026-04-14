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

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafaf9 0%, #fff1f2 100%)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
    },
    wrapper: {
      width: '100%',
      maxWidth: '30rem',
    },
    logoArea: {
      textAlign: 'center',
      marginBottom: '1.75rem',
    },
    logoLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.625rem',
      marginBottom: '1rem',
      textDecoration: 'none',
    },
    logoIcon: {
      width: '2.75rem',
      height: '2.75rem',
      borderRadius: '50%',
      background: '#b91c1c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: '1rem',
    },
    logoText: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      color: '#111827',
      fontSize: '1.25rem',
    },
    heading: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '1.625rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 0.25rem',
    },
    subheading: { color: '#6b7280', fontSize: '0.9rem', margin: 0 },
    card: {
      background: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      padding: '2rem',
      border: '1px solid #f3f4f6',
    },
    roleGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    nameGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.25rem',
    },
    formGroup: { marginBottom: '1.25rem' },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.375rem',
    },
    inputWrap: { position: 'relative' },
    eyeBtn: {
      position: 'absolute',
      right: '0.75rem',
      bottom: '0.6rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '0.2rem',
      display: 'flex',
      alignItems: 'center',
    },
  };

  const roleBtn = (role, emoji, label) => {
    const isActive = form.role === role;
    return (
      <button
        key={role}
        type="button"
        onClick={() => setForm(f => ({ ...f, role }))}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.625rem',
          border: `2px solid ${isActive ? '#b91c1c' : '#e5e7eb'}`,
          background: isActive ? '#fef2f2' : '#fff',
          color: isActive ? '#b91c1c' : '#4b5563',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <span>{emoji}</span>
        <span>{label}</span>
        {isActive && <CheckCircle size={14} />}
      </button>
    );
  };

  return (
    <div style={s.page}>
      <div style={s.wrapper}>
        {/* Logo */}
        <div style={s.logoArea}>
          <Link to="/" style={s.logoLink}>
            <div style={s.logoIcon}>N</div>
            <span style={s.logoText}>NepalCraft Hub</span>
          </Link>
          <h1 style={s.heading}>Create your account</h1>
          <p style={s.subheading}>Join the NepalCraft community</p>
        </div>

        {/* Card */}
        <div style={s.card}>
          {/* Role Selection */}
          <div style={s.roleGrid}>
            {roleBtn('buyer', '🛒', "I'm a Buyer")}
            {roleBtn('seller', '🛠️', "I'm a Seller")}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name Row */}
            <div style={s.nameGrid}>
              <div>
                <label style={s.label} htmlFor="reg-firstName">First Name *</label>
                <input
                  id="reg-firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="James"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={s.label} htmlFor="reg-lastName">Last Name *</label>
                <input
                  id="reg-lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Thompson"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div style={s.formGroup}>
              <label style={s.label} htmlFor="reg-email">Email Address *</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="input-field"
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label} htmlFor="reg-phone">Phone Number</label>
              <input
                id="reg-phone"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder={form.role === 'buyer' ? '+44 7700 900 123' : '+977 9801 234 567'}
                className="input-field"
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label} htmlFor="reg-address">
                {form.role === 'buyer' ? 'UK Address' : 'Nepal Address'}
              </label>
              <input
                id="reg-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={form.role === 'buyer' ? '42 Baker Street, London, W1U 6RT' : 'Thamel, Kathmandu, Nepal'}
                className="input-field"
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label} htmlFor="reg-password">Password *</label>
              <div style={s.inputWrap}>
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="input-field"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={s.eyeBtn}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={s.formGroup}>
              <label style={s.label} htmlFor="reg-confirmPassword">Confirm Password *</label>
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: loading ? '#9ca3af' : '#b91c1c',
                color: '#fff',
                fontWeight: 600,
                padding: '0.75rem 1.5rem',
                borderRadius: '0.625rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.2s',
                boxShadow: '0 2px 8px rgba(185,28,28,0.25)',
                marginTop: '0.25rem',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#991b1b'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#b91c1c'; }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.25rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#b91c1c', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
