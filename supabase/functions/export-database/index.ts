
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    )

    const { format } = await req.json()
    console.log(`Requested database export in format: ${format}`)

    // Get list of tables (this would normally use pg_dump in a real implementation)
    const { data: tables, error: tablesError } = await supabaseClient
      .rpc('get_all_tables')
      .select('*')
      .catch(() => ({ data: null, error: new Error('RPC get_all_tables not available') }))

    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
      
      // Fallback to a predefined list of tables
      const knownTables = [
        'products', 'orders', 'profiles', 'pages', 'site_settings', 
        'blog_posts', 'blog_categories', 'inventory', 'payment_methods',
        'delivery_methods', 'promo_codes', 'shop_company_expenses'
      ]
      
      const fullExport: Record<string, any> = {}
      let sqlDump = `-- Database export created on ${new Date().toISOString()}\n\n`
      
      for (const table of knownTables) {
        console.log(`Exporting table: ${table}`)
        const { data: tableData, error: tableError } = await supabaseClient
          .from(table)
          .select('*')
        
        if (tableError) {
          console.warn(`Error fetching table ${table}:`, tableError)
          continue
        }
        
        if (format === 'sql' && tableData && tableData.length > 0) {
          sqlDump += `-- Table: ${table}\n`
          
          // Create a simple INSERT statement (this is simplified and not production-ready)
          tableData.forEach((row) => {
            const columns = Object.keys(row).join(', ')
            const values = Object.values(row)
              .map((val) => {
                if (val === null) return 'NULL'
                if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
                if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
                return val
              })
              .join(', ')
            
            sqlDump += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`
          })
          
          sqlDump += '\n'
        }
        
        fullExport[table] = tableData || []
      }
      
      // Store the SQL dump in Storage
      if (format === 'sql') {
        const fileName = `db_dump_${new Date().toISOString().slice(0, 10)}.sql`
        
        try {
          const { error: uploadError } = await supabaseClient.storage
            .from('database_exports')
            .upload(fileName, new Blob([sqlDump], { type: 'text/plain' }), {
              contentType: 'text/plain',
              upsert: true,
            })
          
          if (uploadError) throw uploadError
          
          const { data: { publicUrl } } = supabaseClient.storage
            .from('database_exports')
            .getPublicUrl(fileName)
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              downloadUrl: publicUrl,
              message: 'Database exported successfully' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (storageError) {
          console.error('Error storing SQL dump:', storageError)
          // Fall back to returning the SQL directly
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
        }
      }
      
      return new Response(
        JSON.stringify(fullExport),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // If we have the tables list, we could generate a more complete SQL dump
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Not implemented - fallback to client-side export'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error exporting database:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
