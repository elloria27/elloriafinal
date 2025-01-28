import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BlogPosts } from "./blog/BlogPosts";
import { BlogCategories } from "./blog/BlogCategories";
import { BlogSettings } from "./blog/BlogSettings";

export const BlogManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blog Management</h2>
      </div>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <BlogPosts />
        </TabsContent>

        <TabsContent value="categories">
          <BlogCategories />
        </TabsContent>

        <TabsContent value="settings">
          <BlogSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};