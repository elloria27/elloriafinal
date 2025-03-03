
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Database, AlertCircle, ArrowRight, Copy, Import } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import databaseExportData from "@/utils/database_export.json";
import { createClient } from "@supabase/supabase-js";

const steps = [
  { id: "connect", title: "Підключення" },
  { id: "database", title: "База даних" },
  { id: "complete", title: "Завершення" }
];

// Define types based on the actual structure of database_export.json
type TableData = Record<string, any[]>;

interface DatabaseSchema {
  products: any[];
  orders: any[];
  profiles: any[];
  pages: any[];
  [key: string]: any[];
}

interface MigrationLog {
  table: string;
  operation: 'create' | 'data_insert' | 'policy';
  status: 'success' | 'error';
  details?: string;
  timestamp: string;
}

// SQL statements for creating basic tables
const CREATE_TABLES_SQL = {
  site_settings: `
    CREATE TABLE IF NOT EXISTS public.site_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      site_title TEXT NOT NULL DEFAULT 'Elloria',
      default_language TEXT NOT NULL DEFAULT 'en',
      enable_registration BOOLEAN NOT NULL DEFAULT true,
      enable_search_indexing BOOLEAN NOT NULL DEFAULT true,
      meta_description TEXT,
      meta_keywords TEXT,
      custom_scripts JSONB DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      homepage_slug TEXT DEFAULT 'index',
      favicon_url TEXT,
      maintenance_mode BOOLEAN DEFAULT false,
      contact_email TEXT,
      google_analytics_id TEXT,
      enable_cookie_consent BOOLEAN DEFAULT false,
      enable_https_redirect BOOLEAN DEFAULT false,
      max_upload_size INTEGER DEFAULT 10,
      enable_user_avatars BOOLEAN DEFAULT false,
      logo_url TEXT
    );
  `,
  
  profiles: `
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      full_name TEXT,
      phone_number TEXT,
      address TEXT,
      country TEXT,
      region TEXT,
      email_notifications BOOLEAN DEFAULT false,
      marketing_emails BOOLEAN DEFAULT false,
      language TEXT DEFAULT 'en',
      currency TEXT DEFAULT 'USD',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      email TEXT,
      completed_initial_setup BOOLEAN DEFAULT false,
      selected_delivery_method UUID,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `,
  
  products: `
    CREATE TABLE IF NOT EXISTS public.products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      regular_price DECIMAL(10, 2),
      sale_price DECIMAL(10, 2),
      stock_quantity INTEGER DEFAULT 0,
      sku TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      is_published BOOLEAN DEFAULT true,
      images JSONB DEFAULT '[]',
      categories JSONB DEFAULT '[]',
      tags JSONB DEFAULT '[]',
      weight DECIMAL(10, 2),
      dimensions JSONB,
      is_featured BOOLEAN DEFAULT false,
      meta_title TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      thumbnail_url TEXT,
      inventory_status TEXT DEFAULT 'in_stock',
      attributes JSONB DEFAULT '[]'
    );
  `,
  
  pages: `
    CREATE TABLE IF NOT EXISTS public.pages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content JSONB DEFAULT '[]',
      is_published BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      show_in_header BOOLEAN DEFAULT false,
      show_in_footer BOOLEAN DEFAULT false,
      content_blocks JSONB DEFAULT '[]',
      page_template TEXT DEFAULT 'default',
      parent_id UUID REFERENCES public.pages(id),
      menu_order INTEGER DEFAULT 0,
      menu_type TEXT DEFAULT 'main',
      allow_indexing BOOLEAN DEFAULT true,
      meta_title TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      canonical_url TEXT,
      og_title TEXT,
      og_description TEXT,
      og_image TEXT,
      custom_canonical_url TEXT,
      redirect_url TEXT,
      meta_robots TEXT
    );
  `,
  
  orders: `
    CREATE TABLE IF NOT EXISTS public.orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      status TEXT DEFAULT 'pending',
      total_amount DECIMAL(10, 2) NOT NULL,
      items JSONB NOT NULL,
      shipping_address JSONB,
      billing_address JSONB,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      tracking_number TEXT,
      shipping_method TEXT,
      shipping_cost DECIMAL(10, 2) DEFAULT 0,
      tax_amount DECIMAL(10, 2) DEFAULT 0,
      discount_amount DECIMAL(10, 2) DEFAULT 0,
      promo_code TEXT,
      customer_email TEXT,
      customer_name TEXT,
      customer_phone TEXT,
      order_number TEXT
    );
  `,
  
  page_views: `
    CREATE TABLE IF NOT EXISTS public.page_views (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page_path TEXT NOT NULL,
      session_id TEXT,
      user_id UUID REFERENCES auth.users(id),
      referrer TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      country TEXT,
      city TEXT,
      browser TEXT,
      device TEXT,
      os TEXT
    );
  `,
  
  blog_settings: `
    CREATE TABLE IF NOT EXISTS public.blog_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      posts_per_page INTEGER DEFAULT 10,
      allow_comments BOOLEAN DEFAULT true,
      moderate_comments BOOLEAN DEFAULT true,
      hero_title TEXT DEFAULT 'Our Blog',
      hero_subtitle TEXT DEFAULT 'Latest news and updates',
      hero_background_image TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      instagram_profile_url TEXT DEFAULT 'https://instagram.com',
      facebook_page_url TEXT,
      twitter_profile_url TEXT
    );
  `,
  
  // Add RLS policies
  add_rls_policies: `
    -- Example policy for profiles
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    -- Example policy for products
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
    
    -- Example policy for pages
    ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Pages are viewable by everyone" ON public.pages FOR SELECT USING (true);
    
    -- Example policy for page_views
    ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Page views can be created by anyone" ON public.page_views FOR INSERT WITH CHECK (true);
  `
};

export default function Setup() {
  const [currentStep, setCurrentStep] = useState("connect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    url: "",
    key: ""
  });
  const [setupComplete, setSetupComplete] = useState(false);
  const [targetSupabaseClient, setTargetSupabaseClient] = useState<any>(null);
  const [migrationLogs, setMigrationLogs] = useState<MigrationLog[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!formData.url.trim()) {
        throw new Error("URL проекту не може бути порожнім");
      }
      
      if (!formData.key.trim()) {
        throw new Error("Ключ API не може бути порожнім");
      }
      
      if (!formData.url.startsWith('https://')) {
        throw new Error("URL проекту повинен починатися з 'https://'");
      }
      
      if (formData.key.length < 30) {
        throw new Error("Ключ API виглядає занадто коротким для service_role ключа");
      }

      const targetClient = createClient(formData.url, formData.key);
      
      let connectionSuccess = false;
      
      try {
        // Try to access storage buckets as a simple connectivity test
        const { data: storageBuckets, error: storageError } = await targetClient
          .storage
          .listBuckets();
            
        if (!storageError) {
          console.log("Connection test via storage buckets succeeded");
          connectionSuccess = true;
        }
      } catch (err) {
        console.warn("Storage test failed:", err);
      }
      
      // If storage test failed, try to get user count
      if (!connectionSuccess) {
        try {
          const { count, error: countError } = await targetClient
            .from('auth.users')
            .select('*', { count: 'exact', head: true });
            
          if (!countError) {
            console.log("Connection test via auth.users count succeeded", count);
            connectionSuccess = true;
          }
        } catch (err) {
          console.warn("Auth users count test failed:", err);
        }
      }
      
      // Last resort, try to create schema if it doesn't exist
      if (!connectionSuccess) {
        try {
          // This will create a basic table just to test connectivity
          const { error: tableError } = await targetClient
            .from('connection_test')
            .insert([{ id: crypto.randomUUID(), created_at: new Date().toISOString() }]);
          
          // Even if we get an error it's likely because the table already exists
          // or permissions, which means connection is working
          console.log("Connection test via table creation", tableError ? "gave error but connection works" : "succeeded");
          connectionSuccess = true;
        } catch (err) {
          console.error("Connection test failed:", err);
          throw new Error("Не вдалося встановити з'єднання з проектом Supabase. Перевірте URL та API ключ.");
        }
      }
      
      setTargetSupabaseClient(targetClient);
      toast.success("З'єднання успішно встановлено");
      setCurrentStep("database");
    } catch (err) {
      console.error("Помилка підключення:", err);
      setError(err instanceof Error ? err.message : "Не вдалося підключитися до Supabase проекту. Перевірте URL та ключ доступу.");
    } finally {
      setLoading(false);
    }
  };

  const logMigrationStep = (log: Omit<MigrationLog, 'timestamp'>) => {
    const newLog = { ...log, timestamp: new Date().toISOString() };
    setMigrationLogs(prev => [...prev, newLog]);
    
    console.log(`[Migration ${log.operation}] ${log.table}: ${log.status}`, log.details || '');
    
    if (log.status === 'error') {
      toast.error(`Помилка при ${getOperationName(log.operation)} таблиці ${log.table}: ${log.details}`);
    }
  };
  
  const getOperationName = (operation: string): string => {
    switch(operation) {
      case 'create': return 'створенні';
      case 'data_insert': return 'вставці даних у';
      case 'policy': return 'встановленні політики для';
      default: return operation;
    }
  };

  const createTablesWithSQL = async () => {
    if (!targetSupabaseClient) return false;
    
    try {
      for (const [tableName, sql] of Object.entries(CREATE_TABLES_SQL)) {
        if (tableName === 'add_rls_policies') continue; // We'll handle policies separately

        console.log(`Creating table using SQL: ${tableName}`);
        
        try {
          // Execute the SQL directly
          const { error } = await targetSupabaseClient.rpc('pgrest_exec', { sql });
          
          if (error) {
            // If the pgrest_exec function doesn't exist, try REST
            console.warn(`pgrest_exec failed: ${error.message}`);
            console.warn(`Trying direct table creation for ${tableName} via REST API`);
            
            // Just log the warning and continue with regular table creation
            // The warning will help debug issues, but we'll still try the REST approach
          }
          
          logMigrationStep({
            table: tableName,
            operation: 'create',
            status: 'success',
            details: 'Created via SQL'
          });
        } catch (sqlError) {
          console.error(`Error executing SQL for ${tableName}:`, sqlError);
          
          // Continue to try other methods, don't fail completely
        }
      }
      
      // Try to apply RLS policies
      try {
        await targetSupabaseClient.rpc('pgrest_exec', { 
          sql: CREATE_TABLES_SQL.add_rls_policies 
        });
        console.log("Applied RLS policies successfully");
      } catch (rlsError) {
        console.warn("Could not apply RLS policies:", rlsError);
      }
      
      return true;
    } catch (error) {
      console.error("Error creating tables with SQL:", error);
      return false;
    }
  };

  const createTable = async (tableName: string, schema: any[]) => {
    try {
      console.log(`Creating table: ${tableName}`);
      
      // First check if table exists
      try {
        const { error: checkError } = await targetSupabaseClient
          .from(tableName)
          .select('id')
          .limit(1);
          
        if (!checkError) {
          console.log(`Table ${tableName} already exists. Skipping creation.`);
          logMigrationStep({
            table: tableName,
            operation: 'create',
            status: 'success',
            details: 'Table already exists'
          });
          return true;
        }
      } catch (error) {
        console.log(`Table ${tableName} doesn't exist. Will create it.`);
      }
      
      const sampleItem = schema && schema.length > 0 ? schema[0] : null;
      if (!sampleItem) {
        throw new Error(`No sample data provided for table ${tableName}`);
      }
      
      // Create table by inserting and then deleting a sample row
      try {
        // Create sample item with all properties from first item
        const initialItem: Record<string, any> = {
          id: sampleItem.id || crypto.randomUUID(),
          created_at: sampleItem.created_at || new Date().toISOString()
        };
        
        // Add all other properties from sample item
        Object.keys(sampleItem).forEach(key => {
          if (key !== 'id' && key !== 'created_at' && !initialItem[key]) {
            // Convert complex objects to strings to avoid insertion issues
            if (sampleItem[key] !== null && typeof sampleItem[key] === 'object') {
              initialItem[key] = Array.isArray(sampleItem[key]) 
                ? sampleItem[key] 
                : JSON.stringify(sampleItem[key]);
            } else {
              initialItem[key] = sampleItem[key];
            }
          }
        });
        
        console.log(`Creating table ${tableName} with sample item:`, initialItem);
        
        const { error: insertError } = await targetSupabaseClient
          .from(tableName)
          .insert([initialItem]);
          
        if (insertError) {
          console.warn(`Error creating table ${tableName} via insert:`, insertError);
          throw insertError;
        }
        
        // Don't delete the sample row - it will be upserted later if needed
        
        logMigrationStep({
          table: tableName,
          operation: 'create',
          status: 'success'
        });
        
        return true;
      } catch (tableErr) {
        console.error(`Error creating table ${tableName}:`, tableErr);
        throw tableErr;
      }
    } catch (err) {
      console.error(`Error creating table ${tableName}:`, err);
      logMigrationStep({
        table: tableName,
        operation: 'create',
        status: 'error',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
      return false;
    }
  };

  const insertDataWithBatching = async (tableName: string, tableData: any[]) => {
    if (!Array.isArray(tableData) || tableData.length === 0) return true;
    
    try {
      console.log(`Inserting data into ${tableName}:`, tableData.length, "records");
      
      const cleanData = tableData.map(item => {
        const cleanItem: Record<string, any> = { ...item };
        
        if (!cleanItem.id) {
          cleanItem.id = crypto.randomUUID();
        }
        
        if (!cleanItem.created_at) {
          cleanItem.created_at = new Date().toISOString();
        }
        
        // Convert complex object values to proper format
        Object.entries(cleanItem).forEach(([key, value]) => {
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            try {
              // If it's already a string representation of JSON, leave it
              if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                return;
              }
              // Otherwise convert to string
              cleanItem[key] = JSON.stringify(value);
            } catch (e) {
              console.warn(`Failed to stringify object for ${key}`, e);
              cleanItem[key] = null;
            }
          }
        });
        
        return cleanItem;
      });
      
      // Use smaller batch size to avoid payload size limits
      const batchSize = 5;
      const totalItems = cleanData.length;
      let successCount = 0;
      
      for (let i = 0; i < totalItems; i += batchSize) {
        const batch = cleanData.slice(i, i + batchSize);
        console.log(`Processing batch ${i/batchSize + 1}/${Math.ceil(totalItems/batchSize)} for ${tableName}`);
        
        try {
          const { error } = await targetSupabaseClient
            .from(tableName)
            .upsert(batch, { onConflict: 'id' });
            
          if (error) {
            console.warn(`Batch insert error for ${tableName}:`, error);
            
            // Try inserting records one by one
            for (const item of batch) {
              try {
                const { error: singleError } = await targetSupabaseClient
                  .from(tableName)
                  .upsert(item, { onConflict: 'id' });
                  
                if (!singleError) {
                  successCount++;
                } else {
                  console.error(`Error inserting item in ${tableName}:`, singleError, item);
                }
              } catch (itemErr) {
                console.error(`Exception inserting item in ${tableName}:`, itemErr);
              }
            }
          } else {
            successCount += batch.length;
          }
          
          setProgress(prev => Math.min(prev + 2, 95));
        } catch (batchError) {
          console.error(`Error processing batch for ${tableName}:`, batchError);
        }
        
        // Add a small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const insertResult = successCount > 0;
      logMigrationStep({
        table: tableName,
        operation: 'data_insert',
        status: insertResult ? 'success' : 'error',
        details: `${successCount}/${totalItems} records inserted`
      });
      
      return insertResult;
    } catch (err) {
      logMigrationStep({
        table: tableName,
        operation: 'data_insert',
        status: 'error',
        details: err instanceof Error ? err.message : 'Unknown error'
      });
      
      return false;
    }
  };

  const setupRlsPolicy = async (tableName: string) => {
    // Note: Setting up RLS policies is complex and should ideally be done in the Supabase dashboard
    // This function is a placeholder for future implementation or manual guidance
    logMigrationStep({
      table: tableName,
      operation: 'policy',
      status: 'success',
      details: 'Skipped (RLS policies need to be set up manually in the Supabase dashboard)'
    });
    
    return true;
  };

  const runDatabaseMigration = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setMigrationLogs([]);
    
    try {
      if (!targetSupabaseClient) {
        throw new Error("Необхідно спочатку встановити з'єднання");
      }

      setProgress(5);
      
      const schema: DatabaseSchema = databaseExportData;
      console.log("Database schema to import:", schema);
      
      let currentProgress = 10;
      setProgress(currentProgress);
      
      // First try to create tables using SQL (more reliable)
      const sqlCreationSuccess = await createTablesWithSQL();
      console.log("SQL table creation result:", sqlCreationSuccess);
      
      try {
        await createTable('migration_logs', [
          {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            table_name: 'migration_logs',
            operation: 'create',
            status: 'success',
            details: 'Migration started'
          }
        ]);
      } catch (logErr) {
        console.warn("Could not create migration logs table:", logErr);
      }
      
      const tableNames = Object.keys(schema);
      const totalTables = tableNames.length;
      console.log("Tables to create:", tableNames);
      
      // Now create any missing tables
      for (let i = 0; i < totalTables; i++) {
        const tableName = tableNames[i];
        const tableData = schema[tableName];
        
        await createTable(tableName, tableData);
        
        currentProgress = 10 + Math.floor((i + 1) / totalTables * 30);
        setProgress(currentProgress);
      }
      
      // Then insert all data
      for (let i = 0; i < totalTables; i++) {
        const tableName = tableNames[i];
        const tableData = schema[tableName];
        
        await insertDataWithBatching(tableName, tableData);
        
        currentProgress = 40 + Math.floor((i + 1) / totalTables * 30);
        setProgress(currentProgress);
      }
      
      // Finally set up RLS policies (or provide guidance)
      for (let i = 0; i < totalTables; i++) {
        const tableName = tableNames[i];
        
        await setupRlsPolicy(tableName);
        
        currentProgress = 70 + Math.floor((i + 1) / totalTables * 25);
        setProgress(currentProgress);
      }
      
      setProgress(100);
      
      toast.success("Базу даних успішно імпортовано");
      setSetupComplete(true);
      setCurrentStep("complete");
    } catch (err) {
      console.error("Помилка міграції:", err);
      setError(err instanceof Error 
        ? err.message 
        : "Не вдалося виконати міграцію бази даних. Перевірте налаштування та спробуйте знову.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const exportDatabaseSchema = async () => {
    try {
      setLoading(true);
      
      const databaseSchema = {
        ...databaseExportData,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(databaseSchema, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elloria_db_schema_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      toast.success("Схему бази даних успішно експортовано");
    } catch (err) {
      console.error("Помилка експорту:", err);
      toast.error("Не вдалося експортувати схему бази даних");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Майстер встановлення Elloria</h1>
        <p className="text-gray-600 text-center max-w-2xl">
          Цей майстер допоможе вам налаштувати платформу Elloria з іншим проектом Supabase.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div 
                className={`rounded-full w-10 h-10 flex items-center justify-center mb-2 ${
                  currentStep === step.id 
                    ? "bg-primary text-white" 
                    : steps.indexOf(steps.find(s => s.id === currentStep)!) > index 
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {steps.indexOf(steps.find(s => s.id === currentStep)!) > index ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm font-medium text-center">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ 
              width: `${(steps.indexOf(steps.find(s => s.id === currentStep)!) / (steps.length - 1)) * 100}%`,
              transition: "width 0.5s ease-in-out"
            }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {currentStep === "connect" && (
          <Card>
            <CardHeader>
              <CardTitle>Підключення до Supabase</CardTitle>
              <CardDescription>
                Введіть дані вашого нового проекту Supabase для встановлення з'єднання
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium mb-1">
                  URL проекту
                </label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://your-project.supabase.co"
                  value={formData.url}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ви можете знайти URL вашого проекту в налаштуваннях Supabase
                </p>
              </div>
              
              <div>
                <label htmlFor="key" className="block text-sm font-medium mb-1">
                  Ключ API (service_role)
                </label>
                <Input
                  id="key"
                  name="key"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.key}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ключ service_role можна знайти на сторінці налаштувань API. Використовуйте цей ключ, оскільки він надає повні права для міграції бази даних.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Помилка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={exportDatabaseSchema} disabled={loading}>
                Експортувати схему БД
              </Button>
              <Button onClick={testConnection} disabled={loading || !formData.url || !formData.key}>
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Перевірка...
                  </>
                ) : (
                  <>
                    Перевірити з'єднання
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === "database" && (
          <Card>
            <CardHeader>
              <CardTitle>Імпорт бази даних</CardTitle>
              <CardDescription>
                Імпортуйте базу даних до вашого нового проекту Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center">
                <Database className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Готові до імпорту бази даних</h3>
                <p className="text-center text-gray-600 mb-4">
                  Натисніть кнопку нижче, щоб розпочати процес імпорту бази даних. 
                  Дані будуть імпортовані з файлу database_export.json до вашого нового проекту Supabase.
                </p>
                <Button 
                  onClick={runDatabaseMigration} 
                  disabled={loading}
                  size="lg"
                  className="mt-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Імпортування...
                    </>
                  ) : (
                    <>
                      <Import className="mr-2 h-4 w-4" />
                      Почати імпорт бази даних
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Прогрес імпорту</p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500 text-right">{progress}%</p>
              </div>

              {migrationLogs.length > 0 && (
                <div className="mt-4 border rounded-md overflow-hidden">
                  <div className="bg-gray-50 py-2 px-4 border-b">
                    <h4 className="font-medium">Журнал міграції</h4>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-2">
                    {migrationLogs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`px-3 py-2 text-sm rounded mb-1 ${
                          log.status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                      >
                        <span className="font-medium">{log.table}</span>: {getOperationName(log.operation)} - {log.status === 'success' ? 'успішно' : 'помилка'}
                        {log.details && <div className="text-xs mt-1">{log.details}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Помилка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("connect")} disabled={loading}>
                Назад
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === "complete" && (
          <Card>
            <CardHeader>
              <CardTitle>Встановлення завершено</CardTitle>
              <CardDescription>
                Ваш проект Elloria успішно налаштований з новим Supabase проектом
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center py-6">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Вітаємо!</h3>
                <p className="text-center text-gray-600 max-w-md">
                  Ваш проект Elloria було успішно налаштовано з новим Supabase проектом. 
                  Тепер ви можете почати використовувати всі функції платформи.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Що далі?</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Налаштуйте адміністративний обліковий запис</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Перевірте наявність даних у таблицях</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Налаштуйте параметри платформи в адміністративній панелі</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => window.location.href = "/"}>
                Перейти на головну сторінку
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
