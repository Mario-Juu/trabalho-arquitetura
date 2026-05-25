import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CheckoutPage from './pages/CheckoutPage';
import PedidosPage from './pages/PedidosPage';
import ClientesPage from './pages/ClientesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <header style={styles.header}>
            <h1 style={styles.headerTitle}>Gateway de Pagamentos</h1>
            <nav style={styles.nav}>
              <NavLink to="/" style={navLinkStyle} end>
                Checkout
              </NavLink>
              <NavLink to="/pedidos" style={navLinkStyle}>
                Pedidos
              </NavLink>
              <NavLink to="/clientes" style={navLinkStyle}>
                Clientes
              </NavLink>
            </nav>
          </header>
          <main style={styles.main}>
            <Routes>
              <Route path="/" element={<CheckoutPage />} />
              <Route path="/pedidos" element={<PedidosPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: 'white',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
  fontWeight: isActive ? 600 : 400,
});

const styles = {
  header: {
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
};

export default App;
