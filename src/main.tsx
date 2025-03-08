
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Toaster } from './components/ui/toaster'
import { Toaster as SonnerToaster } from './components/ui/sonner'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster />
        <SonnerToaster />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
