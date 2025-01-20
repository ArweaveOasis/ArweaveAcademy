import React from 'react';
import Dashboard from './pages/Dashboard';
import Wallets from './pages/Wallet';
import Prices from './pages/Prices';

const routes = {
  '/': <Dashboard />,
  '/wallets': <Wallets />,
  '/prices': <Prices />,
};

const App = () => {
  const [route, setRoute] = React.useState(window.location.hash.replace('#', '') || '/');

  React.useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.replace('#', '') || '/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      <nav style={{ backgroundColor: 'slategray', color: 'white', padding: '2rem', display: 'flex', gap: '1rem' }}>
        <a href="#/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
        <a href="#/wallets" style={{ color: 'white', textDecoration: 'none' }}>Wallets</a>
        <a href="#/prices" style={{ color: 'white', textDecoration: 'none' }}>Prices</a>
      </nav>
      <div style={{ padding: '2rem' }}>{routes[route] || <NotFound />}</div>
    </div>
  );
};

export default App;
