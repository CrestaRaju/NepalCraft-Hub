import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Package, LayoutDashboard, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const navLinks = [
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">N</div>
          <div className="navbar-logo-text">
            <span className="navbar-logo-name">NepalCraft</span>
            <span className="navbar-logo-sub">Hub</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link${isActive(link.to) ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Cart */}
          <Link to="/cart" className="navbar-cart-btn" aria-label="Shopping cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="user-dropdown">
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="user-dropdown-trigger"
              >
                <div className="user-avatar">
                  {user.firstName?.[0]?.toUpperCase()}
                </div>
                <span className="user-dropdown-name" style={{ display: 'none' }}>
                  {user.firstName}
                </span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu animate-fade-in">
                  <div className="dropdown-header">
                    <p className="dropdown-header-name">{user.firstName} {user.lastName}</p>
                    <p className="dropdown-header-role">{user.role}</p>
                  </div>

                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                    <User size={15} /> My Profile
                  </Link>

                  <Link to="/orders" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                    <Package size={15} /> My Orders
                  </Link>

                  {user.role === 'seller' && (
                    <Link to="/seller/products" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                      <Store size={15} /> My Products
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                      <LayoutDashboard size={15} /> Admin Panel
                    </Link>
                  )}

                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item danger">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn-signin">Sign In</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            className="navbar-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMenuOpen(false)}
            className="navbar-mobile-link"
          >
            {link.label}
          </Link>
        ))}
        {!user && (
          <Link to="/login" onClick={() => setMenuOpen(false)} className="navbar-mobile-link">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
