import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-sm">N</div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>NepalCraft Hub</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Connecting Nepali artisans with buyers in the United Kingdom. Authentic handicrafts, ethically sourced, delivered to your door.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                <Facebook size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                <Instagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=Paintings+%26+Art" className="hover:text-red-400 transition-colors">Paintings & Art</Link></li>
              <li><Link to="/products?category=Textiles+%26+Fabrics" className="hover:text-red-400 transition-colors">Textiles & Fabrics</Link></li>
              <li><Link to="/products?category=Meditation+%26+Wellness" className="hover:text-red-400 transition-colors">Meditation & Wellness</Link></li>
              <li><Link to="/products?category=Sculptures+%26+Statues" className="hover:text-red-400 transition-colors">Sculptures & Statues</Link></li>
              <li><Link to="/products?category=Stationery+%26+Paper+Crafts" className="hover:text-red-400 transition-colors">Stationery</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Returns Policy</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">UK VAT & Customs</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Seller FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-red-400 shrink-0" />
                <span>Thamel, Kathmandu, Nepal & London, UK</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-red-400 shrink-0" />
                <a href="mailto:hello@nepalcrafthub.com" className="hover:text-red-400 transition-colors">hello@nepalcrafthub.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-red-400 shrink-0" />
                <span>+44 20 7946 0958</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} NepalCraft Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <span className="text-gray-600">🇳🇵 Made with love in Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
