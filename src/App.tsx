
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { PagesProvider } from './contexts/PagesContext';
import { CartProvider } from './contexts/CartContext'; // Add this import
import { Toaster } from './components/ui/toaster';
import ScrollToTop from './components/ScrollToTop';
import routes from './routes';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <CartProvider> {/* Add CartProvider here */}
          <PagesProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
              <Toaster />
            </Router>
          </PagesProvider>
        </CartProvider> {/* Close CartProvider */}
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
