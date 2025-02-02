import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CycleSettings {
  cycle_length: number;
  period_length: number;
  last_period_date: string;
  notifications_enabled: boolean;
}

interface PeriodLog {
  date: string;
  flow_intensity: 'light' | 'medium' | 'heavy' | 'spotting';
  notes?: string;
}

interface SymptomLog {
  symptom_id: string;
  date: string;
  severity: 'light' | 'medium' | 'severe';
  notes?: string;
}

interface Reminder {
  title: string;
  description?: string;
  reminder_type: string;
  time: string;
  days_before?: number;
  is_enabled: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/mobile-api/')[1]

    switch (path) {
      case 'profile':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

          if (error) throw error

          return new Response(
            JSON.stringify(data || {}),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'chat':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('chat_interactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (req.method === 'POST') {
          const { message } = await req.json()
          
          const response = `Echo: ${message}`
          
          const { data, error } = await supabaseClient
            .from('chat_interactions')
            .insert({
              user_id: user.id,
              message: message,
              response: response
            })
            .select()
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'cycle-settings':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('cycle_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (req.method === 'POST' || req.method === 'PUT') {
          const settings: CycleSettings = await req.json()
          const { data, error } = await supabaseClient
            .from('cycle_settings')
            .upsert({
              user_id: user.id,
              ...settings
            })
            .select()
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'predictions':
        if (req.method === 'GET') {
          const [settingsResponse, logsResponse] = await Promise.all([
            supabaseClient
              .from('cycle_settings')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle(),
            supabaseClient
              .from('period_logs')
              .select('*')
              .eq('user_id', user.id)
              .order('date', { ascending: false })
              .limit(3)
          ])

          if (settingsResponse.error) throw settingsResponse.error
          if (logsResponse.error) throw logsResponse.error

          const settings = settingsResponse.data
          const logs = logsResponse.data

          if (!settings || !logs.length) {
            return new Response(
              JSON.stringify({ error: 'Insufficient data for predictions' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          const lastPeriod = new Date(logs[0].date)
          const nextPeriod = new Date(lastPeriod)
          nextPeriod.setDate(nextPeriod.getDate() + settings.cycle_length)

          const ovulationDate = new Date(lastPeriod)
          ovulationDate.setDate(ovulationDate.getDate() + Math.floor(settings.cycle_length / 2))

          const fertileStart = new Date(ovulationDate)
          fertileStart.setDate(fertileStart.getDate() - 5)
          
          const fertileEnd = new Date(ovulationDate)
          fertileEnd.setDate(fertileEnd.getDate() + 1)

          const predictions = {
            next_period: nextPeriod.toISOString().split('T')[0],
            fertile_window: {
              start: fertileStart.toISOString().split('T')[0],
              end: fertileEnd.toISOString().split('T')[0]
            },
            ovulation_date: ovulationDate.toISOString().split('T')[0],
            cycle_history: logs.map(log => ({
              start_date: log.date,
              end_date: new Date(new Date(log.date).getTime() + (settings.period_length * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
              length: settings.period_length
            }))
          }

          return new Response(
            JSON.stringify(predictions),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'period-logs':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('period_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (req.method === 'POST') {
          const log: PeriodLog = await req.json()
          const { data, error } = await supabaseClient
            .from('period_logs')
            .insert({
              user_id: user.id,
              ...log
            })
            .select()
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'symptoms':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('symptoms')
            .select('*')
            .order('name')

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'symptom-logs':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('symptom_logs')
            .select('*, symptoms(*)')
            .eq('user_id', user.id)
            .order('date', { ascending: false })

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (req.method === 'POST') {
          const log: SymptomLog = await req.json()
          const { data, error } = await supabaseClient
            .from('symptom_logs')
            .insert({
              user_id: user.id,
              ...log
            })
            .select()
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      case 'reminders':
        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('reminders')
            .select('*')
            .eq('user_id', user.id)
            .order('time')

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (req.method === 'POST') {
          const reminder: Reminder = await req.json()
          const { data, error } = await supabaseClient
            .from('reminders')
            .insert({
              user_id: user.id,
              ...reminder
            })
            .select()
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
