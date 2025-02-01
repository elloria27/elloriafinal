import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SeoData {
  title?: string
  description?: string
  keywords?: string
  image?: string
  canonical_url?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.searchParams.get('path') || '/'
    console.log('Fetching SEO data for path:', path)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    let seoData: SeoData = {}

    // Get default site settings
    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (path === '/' || path === '/index') {
      seoData = {
        title: siteSettings?.site_title,
        description: siteSettings?.meta_description,
        keywords: siteSettings?.meta_keywords,
      }
    }
    // Product page
    else if (path.startsWith('/products/')) {
      const slug = path.split('/products/')[1]
      const { data: product } = await supabase
        .from('products')
        .select('name, description, image')
        .eq('slug', slug)
        .single()

      if (product) {
        seoData = {
          title: `${product.name} - ${siteSettings?.site_title}`,
          description: product.description,
          image: product.image,
          canonical_url: `${url.origin}/products/${slug}`,
        }
      }
    }
    // Blog post page
    else if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1]
      const { data: post } = await supabase
        .from('blog_posts')
        .select('meta_title, meta_description, keywords, featured_image')
        .eq('slug', slug)
        .single()

      if (post) {
        seoData = {
          title: post.meta_title,
          description: post.meta_description,
          keywords: post.keywords?.join(', '),
          image: post.featured_image,
          canonical_url: `${url.origin}/blog/${slug}`,
        }
      }
    }
    // Other pages
    else {
      const slug = path.slice(1) // Remove leading slash
      const { data: page } = await supabase
        .from('pages')
        .select('meta_title, meta_description, meta_keywords, canonical_url, og_image')
        .eq('slug', slug)
        .single()

      if (page) {
        seoData = {
          title: page.meta_title,
          description: page.meta_description,
          keywords: page.meta_keywords,
          image: page.og_image,
          canonical_url: page.canonical_url,
        }
      }
    }

    // Use site settings as fallback
    seoData = {
      title: seoData.title || siteSettings?.site_title,
      description: seoData.description || siteSettings?.meta_description,
      keywords: seoData.keywords || siteSettings?.meta_keywords,
      ...seoData,
    }

    console.log('Returning SEO data:', seoData)

    return new Response(JSON.stringify(seoData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})