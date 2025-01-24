import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
    
    const { userId } = await req.json()
    
    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('Attempting to delete user with ID:', userId)

    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Error deleting user:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        } 
      }
    )
  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        } 
      }
    )
  }
})