
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // Отримання списку таблиць
    const tablesQuery = `
      SELECT 
        table_schema, 
        table_name, 
        table_type 
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = 'public' 
        AND table_type = 'BASE TABLE' 
      ORDER BY 
        table_name;
    `
    const { data: tables, error: tablesError } = await supabaseClient.rpc("exec_sql", { sql_query: tablesQuery })
    
    if (tablesError) throw tablesError
    
    const schema = {
      tables: [],
      functions: [],
      policies: [],
      sequences: [],
      enums: [],
      timestamp: new Date().toISOString()
    }
    
    // Для кожної таблиці отримуємо її структуру
    for (const table of tables) {
      const tableName = table.table_name
      
      const columnsQuery = `
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default
        FROM 
          information_schema.columns 
        WHERE 
          table_schema = 'public' 
          AND table_name = '${tableName}' 
        ORDER BY 
          ordinal_position;
      `
      const { data: columns, error: columnsError } = await supabaseClient.rpc("exec_sql", { sql_query: columnsQuery })
      
      if (columnsError) throw columnsError
      
      // Отримуємо інформацію про обмеження (первинні ключі, зовнішні ключі)
      const constraintsQuery = `
        SELECT
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints tc
        JOIN
          information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN
          information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE
          tc.table_schema = 'public'
          AND tc.table_name = '${tableName}';
      `
      const { data: constraints, error: constraintsError } = await supabaseClient.rpc("exec_sql", { sql_query: constraintsQuery })
      
      if (constraintsError) throw constraintsError
      
      schema.tables.push({
        name: tableName,
        columns,
        constraints
      })
    }
    
    // Отримання функцій
    const functionsQuery = `
      SELECT 
        routine_name, 
        routine_definition, 
        data_type 
      FROM 
        information_schema.routines 
      WHERE 
        routine_schema = 'public' 
        AND routine_type = 'FUNCTION';
    `
    const { data: functions, error: functionsError } = await supabaseClient.rpc("exec_sql", { sql_query: functionsQuery })
    
    if (functionsError) throw functionsError
    
    schema.functions = functions
    
    // Отримання політик RLS
    const policiesQuery = `
      SELECT 
        polname AS policy_name, 
        tablename AS table_name, 
        cmd AS operation, 
        permissive,
        roles,
        qual AS expression,
        with_check
      FROM 
        pg_policies 
      WHERE 
        schemaname = 'public';
    `
    const { data: policies, error: policiesError } = await supabaseClient.rpc("exec_sql", { sql_query: policiesQuery })
    
    if (policiesError) throw policiesError
    
    schema.policies = policies
    
    // Отримання енумераторів
    const enumsQuery = `
      SELECT
        t.typname AS enum_name,
        e.enumlabel AS enum_value
      FROM
        pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE
        n.nspname = 'public'
      ORDER BY
        enum_name,
        e.enumsortorder;
    `
    const { data: enums, error: enumsError } = await supabaseClient.rpc("exec_sql", { sql_query: enumsQuery })
    
    if (enumsError) throw enumsError
    
    // Групуємо значення енумераторів
    const enumMap = {}
    for (const item of enums) {
      if (!enumMap[item.enum_name]) {
        enumMap[item.enum_name] = []
      }
      enumMap[item.enum_name].push(item.enum_value)
    }
    
    schema.enums = Object.keys(enumMap).map(name => ({
      name,
      values: enumMap[name]
    }))
    
    // Отримання послідовностей
    const sequencesQuery = `
      SELECT
        sequence_name,
        data_type,
        start_value,
        minimum_value,
        maximum_value,
        increment
      FROM
        information_schema.sequences
      WHERE
        sequence_schema = 'public';
    `
    const { data: sequences, error: sequencesError } = await supabaseClient.rpc("exec_sql", { sql_query: sequencesQuery })
    
    if (sequencesError) throw sequencesError
    
    schema.sequences = sequences
    
    return new Response(
      JSON.stringify(schema),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 400,
      }
    )
  }
})
