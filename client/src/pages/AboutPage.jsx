import { Globe, Heart, Shield, Users, Package, Truck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-red-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-red-700/30 text-red-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-red-700/30">
            🇳🇵 Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bridging Nepal and<br />the United Kingdom
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            NepalCraft Hub was built to solve a real problem: countless talented Nepali artisans with world-class craftsmanship, but limited access to international markets.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Heart size={32} className="text-red-700" />, title: 'Our Mission', desc: 'Empower Nepali artisans by connecting them directly with UK buyers, removing middlemen and ensuring fair compensation for their incredible craftsmanship.' },
            { icon: <Globe size={32} className="text-red-700" />, title: 'Our Vision', desc: 'A world where authentic Himalayan handicrafts are accessible to everyone, while preserving ancient art forms and supporting artisan communities.' },
            { icon: <Shield size={32} className="text-red-700" />, title: 'Our Promise', desc: 'Every product on our platform is verified for authenticity. We handle UK VAT, customs, and shipping so buyers receive their orders hassle-free.' },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-flex p-4 bg-red-50 rounded-2xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>How It Works</h2>
          <p className="text-gray-500 text-center mb-12">Simple cross-border shopping from Nepal to UK</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Browse', desc: 'Explore hundreds of authentic Nepali handicrafts with full provenance stories.' },
              { step: '02', title: 'Order', desc: 'Add items to cart. All prices shown fully inclusive of UK VAT and shipping.' },
              { step: '03', title: 'Pay Securely', desc: 'Complete payment in GBP. We handle all currency conversion from NPR.' },
              { step: '04', title: 'Delivered', desc: 'Your handicraft ships via DHL Express and arrives in 7-14 business days.' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center relative">
                <div className="text-5xl font-bold text-red-100 mb-3">{s.step}</div>
                <h4 className="font-bold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UK Customs & VAT Info */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>UK VAT & Customs</h2>
        <p className="text-gray-500 text-center mb-10">Transparent pricing with no hidden costs at delivery</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">What's Included in Your Price?</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">✅ Product price (converted from NPR to GBP)</li>
                <li className="flex items-start gap-2">✅ UK VAT at the standard rate of 20%</li>
                <li className="flex items-start gap-2">✅ DHL Express shipping from Nepal</li>
                <li className="flex items-start gap-2">✅ Import duties pre-calculated</li>
                <li className="flex items-start gap-2">✅ Full tracking from Kathmandu to your door</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Pricing Transparency</h4>
              <div className="bg-stone-50 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between text-gray-600"><span>Product (NPR 45,000)</span><span>£27.00</span></div>
                <div className="flex justify-between text-gray-600"><span>UK VAT (20%)</span><span>£5.40</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping (DHL)</span><span>£12.99</span></div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2"><span>Total Landed Cost</span><span>£45.39</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
