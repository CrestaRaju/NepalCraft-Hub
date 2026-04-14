import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const socialBtn = {
    width: '2rem',
    height: '2rem',
    background: '#1f2937',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#d1d5db',
    textDecoration: 'none',
    transition: 'background 0.2s',
    cursor: 'pointer',
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                background: '#b91c1c', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem'
              }}>N</div>
              <span className="footer-brand-name">NepalCraft Hub</span>
            </div>
            <p className="footer-brand-desc">
              Connecting Nepali artisans with buyers in the United Kingdom. Authentic handicrafts,
              ethically sourced, delivered to your door.
            </p>
            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.75rem' }}>
              {['fb', 'ig', '𝕏'].map((label, i) => (
                <a key={i} href="#" style={socialBtn}
                  onMouseEnter={e => e.target.style.background = '#b91c1c'}
                  onMouseLeave={e => e.target.style.background = '#1f2937'}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              {[
                { to: '/products?category=Paintings+%26+Art', label: 'Paintings & Art' },
                { to: '/products?category=Textiles+%26+Fabrics', label: 'Textiles & Fabrics' },
                { to: '/products?category=Meditation+%26+Wellness', label: 'Meditation & Wellness' },
                { to: '/products?category=Sculptures+%26+Statues', label: 'Sculptures & Statues' },
                { to: '/products?category=Stationery+%26+Paper+Crafts', label: 'Stationery' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="footer-heading">Help</h4>
            <ul className="footer-links">
              {[
                { href: '/about', label: 'About Us', isLink: true },
                { href: '#', label: 'Shipping Info' },
                { href: '#', label: 'Returns Policy' },
                { href: '#', label: 'UK VAT & Customs' },
                { href: '#', label: 'Seller FAQ' },
              ].map((item, i) => (
                <li key={i}>
                  {item.isLink
                    ? <Link to={item.href} className="footer-link">{item.label}</Link>
                    : <a href={item.href} className="footer-link">{item.label}</a>
                  }
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: '#9ca3af' }}>
                <MapPin size={14} style={{ color: '#f87171', flexShrink: 0, marginTop: '2px' }} />
                <span>Thamel, Kathmandu, Nepal &amp; London, UK</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} style={{ color: '#f87171', flexShrink: 0 }} />
                <a href="mailto:hello@nepalcrafthub.com" className="footer-link">
                  hello@nepalcrafthub.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#9ca3af' }}>
                <Phone size={14} style={{ color: '#f87171', flexShrink: 0 }} />
                <span>+44 20 7946 0958</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NepalCraft Hub. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <span style={{ color: '#4b5563' }}>🇳🇵 Made with love in Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
