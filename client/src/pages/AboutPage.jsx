import { Globe, Heart, Shield } from 'lucide-react';

const AboutPage = () => {
  const missionItems = [
    {
      icon: <Heart size={30} style={{ color: '#b91c1c' }} />,
      title: 'Our Mission',
      desc: 'Empower Nepali artisans by connecting them directly with UK buyers, removing middlemen and ensuring fair compensation for their incredible craftsmanship.'
    },
    {
      icon: <Globe size={30} style={{ color: '#b91c1c' }} />,
      title: 'Our Vision',
      desc: 'A world where authentic Himalayan handicrafts are accessible to everyone, while preserving ancient art forms and supporting artisan communities.'
    },
    {
      icon: <Shield size={30} style={{ color: '#b91c1c' }} />,
      title: 'Our Promise',
      desc: 'Every product on our platform is verified for authenticity. We handle UK VAT, customs, and shipping so buyers receive their orders hassle-free.'
    },
  ];

  const steps = [
    { step: '01', title: 'Browse', desc: 'Explore hundreds of authentic Nepali handicrafts with full provenance stories.' },
    { step: '02', title: 'Order', desc: 'Add items to cart. All prices shown fully inclusive of UK VAT and shipping.' },
    { step: '03', title: 'Pay Securely', desc: 'Complete payment in GBP. We handle all currency conversion from NPR.' },
    { step: '04', title: 'Delivered', desc: 'Your handicraft ships via DHL Express and arrives in 7–14 business days.' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #111827 0%, #450a0a 100%)',
        color: '#fff',
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(185,28,28,0.25)',
            color: '#fca5a5',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(185,28,28,0.3)',
            marginBottom: '1.5rem',
          }}>
            🇳🇵 Our Story
          </span>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            margin: '0 0 1.25rem',
            lineHeight: 1.15,
          }}>
            Bridging Nepal and<br />the United Kingdom
          </h1>
          <p style={{ color: '#d1d5db', fontSize: '1.0625rem', lineHeight: 1.7, margin: 0 }}>
            NepalCraft Hub was built to solve a real problem: countless talented Nepali artisans
            with world-class craftsmanship, but limited access to international markets.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{
          maxWidth: '60rem', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {missionItems.map((item, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              border: '1px solid #f3f4f6',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'inline-flex',
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '0.875rem',
                marginBottom: '1rem',
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '1.0625rem', marginBottom: '0.75rem' }}>
                {item.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#f5f5f4', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>How It Works</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Simple cross-border shopping from Nepal to UK</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: '0.875rem',
                padding: '1.5rem',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                border: '1px solid #f3f4f6',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '2.5rem', fontWeight: 700,
                  color: '#fee2e2', lineHeight: 1, marginBottom: '0.75rem',
                  fontFamily: 'Playfair Display, serif',
                }}>
                  {s.step}
                </div>
                <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VAT & Customs */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>UK VAT &amp; Customs</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Transparent pricing with no hidden costs at delivery</p>
          </div>
          <div style={{
            background: '#fff',
            borderRadius: '1rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            border: '1px solid #f3f4f6',
            padding: '2rem',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
            }}>
              <div>
                <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '0.9375rem' }}>
                  What's Included in Your Price?
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {[
                    'Product price (converted from NPR to GBP)',
                    'UK VAT at the standard rate of 20%',
                    'DHL Express shipping from Nepal',
                    'Import duties pre-calculated',
                    'Full tracking from Kathmandu to your door',
                  ].map((item, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', color: '#4b5563', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span>✅</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '0.9375rem' }}>
                  Pricing Transparency
                </h4>
                <div style={{ background: '#f9fafb', borderRadius: '0.75rem', padding: '1rem' }}>
                  {[
                    { label: 'Product (NPR 45,000)', value: '£27.00' },
                    { label: 'UK VAT (20%)', value: '£5.40' },
                    { label: 'Shipping (DHL)', value: '£12.99' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem',
                    }}>
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.9375rem', fontWeight: 700, color: '#111827',
                    borderTop: '1px solid #e5e7eb', paddingTop: '0.625rem', marginTop: '0.25rem',
                  }}>
                    <span>Total Landed Cost</span>
                    <span>£45.39</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
