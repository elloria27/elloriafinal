import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopHero } from "@/components/shop/ShopHero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { useState } from "react";
import { products } from "@/components/ProductCarousel";
import { motion } from "framer-motion";

export type SortOption = "featured" | "price-low" | "price-high" | "newest";
export type FilterOption = "all" | "ultra-thin" | "maxi" | "overnight";

export default function Shop() {
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ShopHero />
      
      <main className="container mx-auto px-4 py-12">
        <ShopFilters 
          sortBy={sortBy}
          filterBy={filterBy}
          onSortChange={setSortBy}
          onFilterChange={setFilterBy}
        />
        <ProductGrid />
      </main>
      
      <Footer />
    </div>
  );
}