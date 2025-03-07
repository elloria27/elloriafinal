
import { Product } from "@/types/product";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Base API client for making requests to the Express backend.
 * This can be gradually expanded as we migrate from Supabase.
 */
export const apiClient = {
  /**
   * Fetch all products from the API
   */
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      // During migration, we can fall back to Supabase if the API fails
      throw error;
    }
  },
  
  /**
   * Health check to verify API connectivity
   */
  async checkHealth(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    
    return await response.json();
  }
};
