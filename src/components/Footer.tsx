import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { usePages } from "@/contexts/PagesContext";

export const Footer = () => {
  const { publishedPages, isLoading } = usePages();

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
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Ultra-Thin</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Maxi Pads</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Overnight</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">New Arrivals</a></li>
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
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
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
              © 2024 Elloria. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};