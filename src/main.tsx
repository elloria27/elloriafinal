import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PagesProvider } from './contexts/PagesContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'

// Create a client
const queryClient = new QueryClient()

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PagesProvider>
            <App />
          </PagesProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)