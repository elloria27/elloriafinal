
import React from 'react';
import { Route } from 'react-router-dom';
import Index from './pages/Index';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Sustainability from './pages/Sustainability';
import SustainabilityProgram from './pages/SustainabilityProgram';
import Donation from './pages/Donation';
import BulkOrders from './pages/BulkOrders';
import CustomSolutions from './pages/CustomSolutions';
import ForBusiness from './pages/ForBusiness';
import Certificates from './pages/Certificates';
import Terms from './pages/Terms';
import Thanks from './pages/Thanks';
import DynamicPage from './pages/DynamicPage';
import SharedFile from './pages/SharedFile';
import Flow from './pages/Flow';
import Admin from './pages/Admin';

export const Routes = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/*" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/sustainability" element={<Sustainability />} />
      <Route path="/sustainability-program" element={<SustainabilityProgram />} />
      <Route path="/donate" element={<Donation />} />
      <Route path="/bulk-orders" element={<BulkOrders />} />
      <Route path="/custom-solutions" element={<CustomSolutions />} />
      <Route path="/for-business" element={<ForBusiness />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/thanks" element={<Thanks />} />
      <Route path="/page/:slug" element={<DynamicPage />} />
      <Route path="/shared/:fileId" element={<SharedFile />} />
      <Route path="/flow" element={<Flow />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};
