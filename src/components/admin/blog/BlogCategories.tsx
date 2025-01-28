import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const BlogCategories = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          <p className="text-sm text-gray-500">No categories found. Create your first category!</p>
        </div>
      </div>
    </div>
  );
};