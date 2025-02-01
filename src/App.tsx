import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { PagesProvider } from './contexts/PagesContext';
import Index from './pages/Index';

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <PagesProvider>
          <Header />
          <Index />
        </PagesProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
