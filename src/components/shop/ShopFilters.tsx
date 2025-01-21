import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption, FilterOption } from "@/pages/Shop";
import { motion } from "framer-motion";

interface ShopFiltersProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (value: SortOption) => void;
  onFilterChange: (value: FilterOption) => void;
}

export const ShopFilters = ({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}: ShopFiltersProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Filter by:</span>
        <Select value={filterBy} onValueChange={(value) => onFilterChange(value as FilterOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="ultra-thin">Ultra Thin</SelectItem>
            <SelectItem value="maxi">Maxi Pads</SelectItem>
            <SelectItem value="overnight">Overnight</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};