
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase connection')
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: { persistSession: false },
      }
    )

    // Get format from request
    const { format } = await req.json()
    console.log(`Requested database export in format: ${format}`)

    // Define known tables to export
    const knownTables = [
      'products', 'orders', 'profiles', 'pages', 'site_settings', 
      'blog_posts', 'blog_categories', 'inventory', 'payment_methods',
      'delivery_methods', 'promo_codes', 'shop_company_expenses',
      'hrm_tasks', 'hrm_invoices', 'business_form_submissions'
    ]
      
    const fullExport: Record<string, any> = {}
    let sqlDump = `-- Database export created on ${new Date().toISOString()}\n\n`
    
    for (const table of knownTables) {
      try {
        console.log(`Exporting table: ${table}`)
        const { data: tableData, error: tableError } = await supabaseClient
          .from(table)
          .select('*')
        
        if (tableError) {
          console.warn(`Error fetching table ${table}:`, tableError)
          // Continue with other tables even if this one fails
          continue
        }
        
        if (tableData && tableData.length > 0) {
          fullExport[table] = tableData
          
          if (format === 'sql') {
            sqlDump += `-- Table: ${table}\n`
            
            // Generate table structure using the first row as reference
            const firstRow = tableData[0]
            const columns = Object.keys(firstRow)
            
            // Create a simple INSERT statement for each row
            tableData.forEach((row) => {
              const values = Object.values(row)
                .map((val) => {
                  if (val === null) return 'NULL'
                  if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
                  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
                  return val
                })
                .join(', ')
              
              sqlDump += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values});\n`
            })
            
            sqlDump += '\n'
          }
        } else {
          console.log(`Table ${table} is empty or doesn't exist`)
          fullExport[table] = []
        }
      } catch (tableExportError) {
        console.error(`Error processing table ${table}:`, tableExportError)
        fullExport[table] = { error: `Failed to export: ${tableExportError.message}` }
      }
    }
    
    // Store the SQL dump in memory
    if (format === 'sql') {
      const fileName = `db_dump_${new Date().toISOString().slice(0, 10)}.sql`
      
      try {
        // Return the SQL directly as a plain text file
        return new Response(
          sqlDump,
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'text/plain',
              'Content-Disposition': `attachment; filename="${fileName}"` 
            } 
          }
        )
      } catch (error) {
        console.error('Error creating SQL response:', error)
        throw error
      }
    }
    
    // Return JSON for non-SQL format
    return new Response(
      JSON.stringify(fullExport),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error exporting database:', error)
    
    // Return a properly formatted error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
