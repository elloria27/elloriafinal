
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import CatalogPage from "@/pages/Catalog";

export function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Index />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
