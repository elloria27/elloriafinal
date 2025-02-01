import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "@/pages/Index";

export function Routes() {
  return (
    <>
      <Header />
      <RouterRoutes>
        <Route path="/" element={<Index />} />
      </RouterRoutes>
      <Footer />
    </>
  );
}