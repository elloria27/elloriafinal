import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import SharedFile from "@/pages/SharedFile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/shared/:token" element={<SharedFile />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
