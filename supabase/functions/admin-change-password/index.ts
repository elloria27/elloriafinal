import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting password change process...')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, newPassword } = await req.json()
    console.log('Received request for user ID:', userId)

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError) {
      console.error('Auth error:', authError)
      throw authError
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id)
      .single()

    if (roles?.role !== 'admin') {
      console.error('Unauthorized - Not an admin')
      throw new Error('Unauthorized - Admin access required')
    }

    console.log('Admin verification successful')

    // Update the user's password
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    )

    if (error) {
      console.error('Password update error:', error)
      throw error
    }

    console.log('Password updated successfully')

    return new Response(
      JSON.stringify({ message: 'Password updated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in password change process:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Changed from 400 to 200 to prevent non-2xx status
      },
    )
  }
})