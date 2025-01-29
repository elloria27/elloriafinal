import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PagesProvider } from './contexts/PagesContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PagesProvider>
        <App />
      </PagesProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)