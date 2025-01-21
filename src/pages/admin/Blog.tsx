import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Blog posts list will be implemented here */}
        <div className="p-6 rounded-lg border border-gray-200 flex items-center justify-center">
          <Book className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-gray-500">No blog posts created yet</p>
        </div>
      </div>
    </div>
  );
};

export default Blog;