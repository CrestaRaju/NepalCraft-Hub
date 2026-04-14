const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '5rem 0', gap: '1rem'
  }}>
    <div className="spinner" />
    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{message}</p>
  </div>
);

export default LoadingSpinner;
