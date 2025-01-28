import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PagesProvider } from './contexts/PagesContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PagesProvider>
      <App />
    </PagesProvider>
  </React.StrictMode>,
)