import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import SharedFile from "./pages/SharedFile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/shared/:token" element={<SharedFile />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;