import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate(user.role === 'admin' ? '/admin' : redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fafaf9 0%, #fff1f2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
    },
    wrapper: {
      width: '100%',
      maxWidth: '26rem',
    },
    logoArea: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    logoLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.625rem',
      marginBottom: '1.25rem',
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
    subheading: {
      color: '#6b7280',
      fontSize: '0.9rem',
      margin: 0,
    },
    card: {
      background: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      padding: '2rem',
      border: '1px solid #f3f4f6',
    },
    formGroup: {
      marginBottom: '1.25rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.375rem',
    },
    inputWrap: {
      position: 'relative',
    },
    eyeBtn: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '0.2rem',
      display: 'flex',
      alignItems: 'center',
    },
    submitBtn: {
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
      marginTop: '0.5rem',
      boxShadow: '0 2px 8px rgba(185,28,28,0.25)',
    },
    demoBox: {
      marginTop: '1.5rem',
      padding: '1rem',
      background: '#fffbeb',
      borderRadius: '0.75rem',
      border: '1px solid #fde68a',
    },
    demoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginTop: '0.625rem',
    },
    demoItem: {
      fontSize: '0.75rem',
      color: '#92400e',
      lineHeight: 1.5,
    },
    footerText: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '1.25rem',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <Link to="/" style={styles.logoLink}>
            <div style={styles.logoIcon}>N</div>
            <span style={styles.logoText}>NepalCraft Hub</span>
          </Link>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subheading}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="input-field"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="login-password">Password</label>
              <div style={styles.inputWrap}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-field"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={styles.eyeBtn}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#991b1b'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#b91c1c'; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={styles.demoBox}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <ShieldCheck size={13} /> Demo Credentials
            </p>
            <div style={styles.demoGrid}>
              <div style={styles.demoItem}>
                <strong>Buyer:</strong><br />
                james@example.co.uk<br />
                buyer123
              </div>
              <div style={styles.demoItem}>
                <strong>Seller:</strong><br />
                sunita@nepalcraft.com<br />
                seller123
              </div>
              <div style={{ ...styles.demoItem, gridColumn: '1 / -1' }}>
                <strong>Admin:</strong> admin@nepalcraft.com / admin123
              </div>
            </div>
          </div>

          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#b91c1c', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
