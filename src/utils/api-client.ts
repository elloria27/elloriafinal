
import { Product } from "@/types/product";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API client for making requests to the Express backend.
 */
export const apiClient = {
  /**
   * Fetch all products from the API
   */
  async getProducts(): Promise<Product[]> {
    try {
      console.log('Client: Fetching products from API');
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const products = await response.json();
      console.log(`Client: Successfully fetched ${products.length} products`);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  /**
   * Fetch a product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      console.log(`Client: Fetching product with slug: ${slug}`);
      const response = await fetch(`${API_BASE_URL}/products/${slug}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const product = await response.json();
      console.log(`Client: Successfully fetched product: ${product.name}`);
      return product;
    } catch (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
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
  },

  /**
   * Authentication API calls
   */
  auth: {
    /**
     * Register a new user
     */
    async register(email: string, password: string, fullName: string) {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      return await response.json();
    },

    /**
     * Login user
     */
    async login(email: string, password: string) {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      return await response.json();
    },

    /**
     * Logout user
     */
    async logout() {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Logout failed');
      }
      
      return await response.json();
    },

    /**
     * Verify authentication token
     */
    async verifyToken(token: string) {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Token verification failed');
      }
      
      return await response.json();
    }
  },

  /**
   * Email sending API calls
   */
  email: {
    /**
     * Send contact form email
     */
    async sendContactEmail(name: string, email: string, message: string, subject?: string) {
      const response = await fetch(`${API_BASE_URL}/email/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, subject }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send contact email');
      }
      
      return await response.json();
    },

    /**
     * Send order status update email
     */
    async sendOrderStatusEmail(params: {
      orderNumber: string;
      customerName: string;
      customerEmail: string;
      newStatus: string;
      orderItems?: Array<{ name: string; quantity: number; price: number; }>;
      orderTotal?: number;
      currency?: string;
      lang?: 'en' | 'uk';
    }) {
      const response = await fetch(`${API_BASE_URL}/email/order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send order status email');
      }
      
      return await response.json();
    },

    /**
     * Send shipment notification email
     */
    async sendShipmentNotificationEmail(params: {
      orderNumber: string;
      customerName: string;
      customerEmail: string;
      trackingNumber: string;
      trackingUrl?: string;
      estimatedDelivery?: string;
      carrier?: string;
      lang?: 'en' | 'uk';
    }) {
      const response = await fetch(`${API_BASE_URL}/email/shipment-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send shipment notification email');
      }
      
      return await response.json();
    },

    /**
     * Send order confirmation emails
     */
    async sendOrderEmails(params: {
      customerEmail: string;
      customerName: string;
      orderId: string;
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
      }>;
      total: number;
      shippingAddress: {
        address: string;
        region: string;
        country: string;
      };
    }) {
      const response = await fetch(`${API_BASE_URL}/email/order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send order confirmation emails');
      }
      
      return await response.json();
    }
  },

  /**
   * Business API calls
   */
  business: {
    /**
     * Submit business inquiry
     */
    async submitInquiry(params: {
      businessName: string;
      contactPerson: string;
      email: string;
      phone?: string;
      inquiry: string;
      additionalInfo?: string;
    }) {
      const response = await fetch(`${API_BASE_URL}/business/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit business inquiry');
      }
      
      return await response.json();
    },

    /**
     * Submit consultation request
     */
    async submitConsultationRequest(params: {
      businessName: string;
      contactPerson: string;
      email: string;
      phone?: string;
      productInterest: string;
      estimatedQuantity?: string;
      preferredDate?: string;
      additionalInfo?: string;
    }) {
      const response = await fetch(`${API_BASE_URL}/business/consultation-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit consultation request');
      }
      
      return await response.json();
    }
  }
};
