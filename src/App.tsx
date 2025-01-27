import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Index";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import SharedFile from "@/pages/SharedFile";
import { CartProvider } from "@/contexts/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
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