import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
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
      <ChakraProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <header style={styles.header}>
              <h1 style={styles.headerTitle}>Gateway de Pagamentos</h1>
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
      </ChakraProvider>
    </QueryClientProvider>
  );
}

const styles = {
  header: {
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
};

export default App;