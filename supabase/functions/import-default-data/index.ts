
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { dataType } = await req.json();

    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    let result;

    // Handle different types of data imports
    switch (dataType) {
      case 'site_settings':
        result = await importSiteSettings(supabase);
        break;
      case 'demo_content':
        result = await importDemoContent(supabase);
        break;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: `Successfully imported ${dataType}`, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error importing data:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to import data', 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function importSiteSettings(supabase) {
  // Default site settings
  const siteSettings = {
    id: 'default',
    site_title: 'My Website',
    default_language: 'en',
    enable_registration: true,
    enable_search_indexing: true,
    custom_scripts: '[]',
    logo_url: null,
    favicon_url: null,
    footer_text: 'Copyright © 2023 My Website',
    social_links: JSON.stringify({
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }),
    navbar_links: JSON.stringify([
      { text: 'Home', url: '/' },
      { text: 'About', url: '/about' },
      { text: 'Shop', url: '/shop' },
      { text: 'Blog', url: '/blog' },
      { text: 'Contact', url: '/contact' }
    ]),
    theme_colors: JSON.stringify({
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    })
  };

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(siteSettings)
    .select();

  if (error) throw error;
  
  return data;
}

async function importDemoContent(supabase) {
  // Import demo blog posts
  const blogPosts = [
    {
      title: 'Getting Started with Our Platform',
      slug: 'getting-started',
      content: 'This is a demo post to help you get started with our platform.',
      excerpt: 'Learn how to use our platform effectively.',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      author_id: null // Will be filled in by the caller
    },
    {
      title: 'Tips and Tricks',
      slug: 'tips-and-tricks',
      content: 'Here are some useful tips and tricks to make the most of our platform.',
      excerpt: 'Maximize your productivity with these quick tips.',
      status: 'published',
      featured_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      author_id: null // Will be filled in by the caller
    }
  ];

  // Import demo products
  const products = [
    {
      name: 'Demo Product 1',
      description: 'This is a demo product',
      price: 19.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e']),
      status: 'active'
    },
    {
      name: 'Demo Product 2',
      description: 'This is another demo product',
      price: 29.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30']),
      status: 'active'
    }
  ];

  // We'll just return the import operations here
  // In a real implementation, you'd want to handle errors for each operation separately
  const results = await Promise.all([
    supabase.from('blog_posts').upsert(blogPosts),
    supabase.from('products').upsert(products)
  ]);

  return { 
    blogPostsResult: results[0],
    productsResult: results[1]
  };
}
