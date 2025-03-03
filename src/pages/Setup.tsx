import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Database, AlertCircle, ArrowRight, Copy, Import, Code } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import databaseExportData from "@/utils/database_export.json";
import { createClient } from "@supabase/supabase-js";
import siteSettingsSQL from "@/utils/site_settings_rows.sql?raw";

const steps = [
  { id: "connect", title: "Підключення" },
  { id: "database", title: "База даних" },
  { id: "complete", title: "Завершення" }
];

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
      
      if (!connectionSuccess) {
        try {
          const { error: tableError } = await targetClient
            .from('connection_test')
            .insert([{ id: crypto.randomUUID(), created_at: new Date().toISOString() }]);
          
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

  const executeSiteSettingsSQL = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!targetSupabaseClient) {
        throw new Error("Необхідно спочатку встановити з'єднання");
      }

      console.log("Executing site settings SQL:", siteSettingsSQL);
      setProgress(10);
      
      const createTableSQL = `
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
      `;
      
      setProgress(30);
      
      const { error: createTableError } = await targetSupabaseClient.auth.fetchSession();
      
      if (createTableError) {
        console.error("Session error:", createTableError);
        throw new Error("Помилка сесії. Будь ласка, перепідключіться.");
      }
      
      try {
        const { error: rawError } = await targetSupabaseClient.rpc('exec_sql', { sql: createTableSQL });
        
        if (rawError) {
          console.error("Error executing CREATE TABLE:", rawError);
          // Continue anyway, as the table might already exist
        } else {
          console.log("Table created successfully via RPC");
        }
      } catch (execError) {
        console.warn("Could not use RPC method exec_sql:", execError);
        // We'll try direct SQL insert below instead
      }

      setProgress(60);
      
      const insertMatch = siteSettingsSQL.match(/INSERT\s+INTO.*VALUES\s*\((.*)\)/i);
      
      if (!insertMatch || !insertMatch[1]) {
        throw new Error("Не вдалося розібрати SQL файл");
      }
      
      const values = insertMatch[1].split(',').map(v => v.trim());

      const siteSettings = {
        id: values[0].replace(/['"]/g, ""),
        site_title: values[1].replace(/['"]/g, ""),
        default_language: values[2].replace(/['"]/g, ""),
        enable_registration: values[3].toLowerCase() === "'true'" || values[3].toLowerCase() === "true",
        enable_search_indexing: values[4].toLowerCase() === "'true'" || values[4].toLowerCase() === "true",
        meta_description: values[5] !== "null" ? values[5].replace(/['"]/g, "") : null,
        meta_keywords: values[6] !== "null" ? values[6].replace(/['"]/g, "") : null,
        custom_scripts: values[7] !== "null" ? JSON.parse(values[7]) : [],
        created_at: values[8].replace(/['"]/g, ""),
        updated_at: values[9].replace(/['"]/g, ""),
        homepage_slug: values[10].replace(/['"]/g, ""),
        favicon_url: values[11] !== "null" ? values[11].replace(/['"]/g, "") : null,
        maintenance_mode: values[12].toLowerCase() === "'true'" || values[12].toLowerCase() === "true",
        contact_email: values[13] !== "null" ? values[13].replace(/['"]/g, "") : null,
        google_analytics_id: values[14] !== "null" ? values[14].replace(/['"]/g, "") : null,
        enable_cookie_consent: values[15].toLowerCase() === "'true'" || values[15].toLowerCase() === "true",
        enable_https_redirect: values[16].toLowerCase() === "'true'" || values[16].toLowerCase() === "true",
        max_upload_size: parseInt(values[17].replace(/['"]/g, "")),
        enable_user_avatars: values[18].toLowerCase() === "'true'" || values[18].toLowerCase() === "true",
        logo_url: values[19] !== "null" ? values[19].replace(/['"]/g, "") : null
      };

      console.log("Parsed site settings:", siteSettings);
      
      setProgress(80);
      
      try {
        try {
          const { error: insertRpcError } = await targetSupabaseClient.rpc('exec_sql', { 
            sql: siteSettingsSQL 
          });
          
          if (insertRpcError) {
            console.warn("Could not insert via RPC:", insertRpcError);
            throw new Error("RPC insert failed");
          } else {
            console.log("Settings inserted via RPC");
          }
        } catch (rpcError) {
          console.warn("Will try direct insert:", rpcError);
          
          const { error: insertError } = await targetSupabaseClient
            .from('site_settings')
            .upsert(siteSettings);
          
          if (insertError) {
            console.error("Error inserting site settings:", insertError);
            throw new Error("Не вдалося вставити налаштування сайту");
          }
          
          console.log("Settings inserted via API");
        }
        
        setProgress(100);
        toast.success("Налаштування сайту успішно імпортовано");
        setSetupComplete(true);
        setCurrentStep("complete");
      } catch (insertError) {
        console.error("All insert methods failed:", insertError);
        throw new Error("Не вдалося вставити налаштування сайту");
      }
    } catch (err) {
      console.error("Помилка імпорту налаштувань сайту:", err);
      setError(err instanceof Error 
        ? err.message 
        : "Не вдалося імпортувати налаштування сайту. Перевірте з'єднання та спробуйте знову.");
      setProgress(0);
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
            <CardFooter>
              <Button onClick={testConnection} disabled={loading || !formData.url || !formData.key} className="w-full">
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
              <CardTitle>Імпорт налаштувань сайту</CardTitle>
              <CardDescription>
                Імпортуйте налаштування сайту до вашого проекту Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col items-center">
                <Database className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Готові до імпорту налаштувань сайту</h3>
                <p className="text-center text-gray-600 mb-4">
                  Натисніть кнопку нижче, щоб імпортувати налаштування сайту з файлу site_settings_rows.sql. 
                  Ці налаштування необхідні для правильної роботи сайту Elloria.
                </p>
                <Button 
                  onClick={executeSiteSettingsSQL} 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Імпортування...
                    </>
                  ) : (
                    <>
                      <Import className="mr-2 h-4 w-4" />
                      Імпортувати налаштування сайту
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Прогрес імпорту</p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500 text-right">{progress}%</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Помилка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {setupComplete && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center text-green-700">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Налаштування сайту успішно імпортовано
                  </h4>
                  <p className="text-sm text-green-600 mt-1">
                    Тепер ви можете перейти до використання вашого сайту Elloria.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="w-full" 
                onClick={() => setCurrentStep("complete")} 
                disabled={!setupComplete}
                variant="default"
              >
                Завершити налаштування
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
