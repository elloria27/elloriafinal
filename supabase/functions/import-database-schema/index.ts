
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const ImportSchemaSchema = z.object({
  targetUrl: z.string().url(),
  targetKey: z.string().min(20),
  schema: z.object({
    tables: z.array(z.any()),
    functions: z.array(z.any()),
    policies: z.array(z.any()),
    sequences: z.array(z.any()),
    enums: z.array(z.object({
      name: z.string(),
      values: z.array(z.string())
    })),
    timestamp: z.string()
  })
})

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Отримуємо дані запиту
    const body = await req.json()
    const validatedData = ImportSchemaSchema.parse(body)
    
    const { targetUrl, targetKey, schema } = validatedData
    
    // Створюємо клієнт Supabase для цільової бази даних
    const targetClient = createClient(targetUrl, targetKey)
    
    // Запуск міграції в цільову базу даних
    const migrationResults = {
      enums: [],
      tables: [],
      functions: [],
      policies: [],
      sequences: [],
      errors: []
    }
    
    // 1. Створюємо енумератори
    for (const enumItem of schema.enums) {
      try {
        const createEnumQuery = `
          CREATE TYPE ${enumItem.name} AS ENUM (${enumItem.values.map(val => `'${val}'`).join(', ')});
        `
        const { error } = await targetClient.rpc("exec_sql", { sql_query: createEnumQuery })
        
        if (error) throw error
        
        migrationResults.enums.push({
          name: enumItem.name,
          status: "success"
        })
      } catch (error) {
        migrationResults.errors.push({
          type: "enum",
          name: enumItem.name,
          error: error.message
        })
        migrationResults.enums.push({
          name: enumItem.name,
          status: "error",
          message: error.message
        })
      }
    }
    
    // 2. Створюємо таблиці
    for (const table of schema.tables) {
      try {
        // Створюємо запит для створення таблиці
        let createTableQuery = `CREATE TABLE ${table.name} (\n`
        
        // Додаємо стовпці
        const columnDefinitions = table.columns.map(column => {
          let columnDef = `  ${column.column_name} ${column.data_type}`
          
          if (column.is_nullable === "NO") {
            columnDef += " NOT NULL"
          }
          
          if (column.column_default) {
            columnDef += ` DEFAULT ${column.column_default}`
          }
          
          return columnDef
        })
        
        createTableQuery += columnDefinitions.join(",\n")
        
        // Додаємо обмеження (первинний ключ)
        const primaryKey = table.constraints.find(c => c.constraint_type === "PRIMARY KEY")
        if (primaryKey) {
          createTableQuery += `,\n  PRIMARY KEY (${primaryKey.column_name})`
        }
        
        createTableQuery += "\n);"
        
        // Виконуємо запит на створення таблиці
        const { error: tableError } = await targetClient.rpc("exec_sql", { sql_query: createTableQuery })
        
        if (tableError) throw tableError
        
        // Додаємо зовнішні ключі в окремих запитах
        const foreignKeys = table.constraints.filter(c => c.constraint_type === "FOREIGN KEY")
        
        for (const fk of foreignKeys) {
          const alterTableQuery = `
            ALTER TABLE ${table.name}
            ADD CONSTRAINT ${fk.constraint_name}
            FOREIGN KEY (${fk.column_name})
            REFERENCES ${fk.foreign_table_name} (${fk.foreign_column_name});
          `
          
          const { error: fkError } = await targetClient.rpc("exec_sql", { sql_query: alterTableQuery })
          
          if (fkError) {
            migrationResults.errors.push({
              type: "foreignKey",
              table: table.name,
              constraint: fk.constraint_name,
              error: fkError.message
            })
          }
        }
        
        migrationResults.tables.push({
          name: table.name,
          status: "success"
        })
      } catch (error) {
        migrationResults.errors.push({
          type: "table",
          name: table.name,
          error: error.message
        })
        migrationResults.tables.push({
          name: table.name,
          status: "error",
          message: error.message
        })
      }
    }
    
    // 3. Створюємо функції
    for (const func of schema.functions) {
      try {
        const { error } = await targetClient.rpc("exec_sql", { sql_query: func.routine_definition })
        
        if (error) throw error
        
        migrationResults.functions.push({
          name: func.routine_name,
          status: "success"
        })
      } catch (error) {
        migrationResults.errors.push({
          type: "function",
          name: func.routine_name,
          error: error.message
        })
        migrationResults.functions.push({
          name: func.routine_name,
          status: "error",
          message: error.message
        })
      }
    }
    
    // 4. Створюємо політики RLS
    for (const policy of schema.policies) {
      try {
        let createPolicyQuery = `
          CREATE POLICY ${policy.policy_name} ON ${policy.table_name}
          FOR ${policy.operation}
          TO ${policy.roles.join(', ')}
          USING (${policy.expression})
        `
        
        if (policy.with_check) {
          createPolicyQuery += ` WITH CHECK (${policy.with_check})`
        }
        
        const { error } = await targetClient.rpc("exec_sql", { sql_query: createPolicyQuery })
        
        if (error) throw error
        
        migrationResults.policies.push({
          name: policy.policy_name,
          status: "success"
        })
      } catch (error) {
        migrationResults.errors.push({
          type: "policy",
          name: policy.policy_name,
          error: error.message
        })
        migrationResults.policies.push({
          name: policy.policy_name,
          status: "error",
          message: error.message
        })
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Schema import completed",
        results: migrationResults
      }),
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
      JSON.stringify({ 
        success: false,
        message: error.message, 
        details: error.errors || null
      }),
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
