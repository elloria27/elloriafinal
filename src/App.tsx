import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import SharedFile from "@/pages/SharedFile";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/Header";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/shared/:token" element={<SharedFile />} />
        </Routes>
        <Toaster />
      </Router>
    </CartProvider>
  );
}

export default App;