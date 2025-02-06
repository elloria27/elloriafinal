import { CartProvider } from "@/contexts/CartContext";
import { PagesProvider } from "@/contexts/PagesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import routes from "@/routes";

function App() {
  console.log('App rendering');
  const router = createBrowserRouter(routes);

  return (
    <CartProvider>
      <PagesProvider>
        <ScrollToTop />
        <RouterProvider router={router} />
        <Toaster position="top-right" expand={false} richColors />
      </PagesProvider>
    </CartProvider>
  );
}

export default App;