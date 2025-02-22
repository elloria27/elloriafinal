import { Facebook, Instagram } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePages } from "@/contexts/PagesContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const { publishedPages, isLoading } = usePages();
  const location = useLocation();
  const [products, setProducts] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) return;
      
      console.log('Fetching products for footer...');
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      console.log('Products fetched:', data);
      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  // Don't render footer on admin pages or setup page
  if (location.pathname.startsWith('/admin') || location.pathname === '/setup') {
    return null;
  }

  const technicalPages = [
    'login',
    'register',
    'profile',
    'checkout',
    'product',
    'order-success',
    'admin'
  ];

  const footerPages = publishedPages
    .filter(page => 
      page.is_published && 
      !technicalPages.includes(page.slug) &&
      page.show_in_footer
    )
    .map(page => ({
      name: page.title,
      path: page.slug === 'index' ? '/' : `/${page.slug}`
    }));

  if (isLoading) {
    return null;
  }

  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-32 md:w-40">
              <img 
                src="/lovable-uploads/08d815c8-551d-4278-813a-fe884abd443d.png" 
                alt="Elloria" 
                className="w-full h-auto"
              />
            </div>
            <p className="text-gray-600 text-center md:text-left max-w-xs">
              Revolutionizing feminine care with sustainable, comfortable solutions.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="font-semibold text-gray-900">Products</h4>
            <ul className="space-y-2 text-center md:text-left">
              {products.map((product) => (
                <li key={product.id}>
                  <Link 
                    to={`/products/${product.slug}`}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="font-semibold text-gray-900">Pages</h4>
            <ul className="space-y-2 text-center md:text-left">
              {footerPages.map((page) => (
                <li key={page.path}>
                  <Link 
                    to={page.path} 
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="font-semibold text-gray-900">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/18RPDSfvGm/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/elloria_menstrual_pads/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © 2025 Elloria. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
