import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Pages = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Page
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search pages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Pages list will be implemented here */}
        <div className="p-6 rounded-lg border border-gray-200 flex items-center justify-center">
          <FileText className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-gray-500">No pages created yet</p>
        </div>
      </div>
    </div>
  );
};

export default Pages;