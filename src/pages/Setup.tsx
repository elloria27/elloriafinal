import { useState } from "react";
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
        const { data: tableData, error: tableError } = await targetClient
          .from('pg_catalog.pg_tables')
          .select('schemaname, tablename')
          .eq('schemaname', 'public')
          .limit(5);
          
        if (!tableError) {
          console.log("Connection test via pg_tables succeeded");
          connectionSuccess = true;
        }
      } catch (err) {
        console.warn("Connection test via pg_tables failed:", err);
      }
      
      if (!connectionSuccess) {
        try {
          const { data: authSettings, error: authError } = await targetClient
            .from('auth.identities')
            .select('id')
            .limit(1);
            
          if (!authError) {
            console.log("Connection test via auth.identities succeeded");
            connectionSuccess = true;
          }
        } catch (err) {
          console.warn("Auth test failed:", err);
        }
      }
      
      if (!connectionSuccess) {
        try {
          const { data: storageBuckets, error: storageError } = await targetClient
            .storage
            .listBuckets();
            
          if (!storageError) {
            console.log("Connection test via storage buckets succeeded");
            connectionSuccess = true;
          } else {
            throw new Error(`Не вдалося підключитися до Supabase: ${storageError.message}`);
          }
        } catch (err) {
          console.error("Storage test failed:", err);
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

  const createTable = async (tableName: string, schema: any[]) => {
    try {
      console.log(`Creating table: ${tableName}`);
      
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
      
      const initialItem = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      
      Object.keys(sampleItem).forEach(key => {
        if (key !== 'id' && key !== 'created_at') {
          const value = sampleItem[key];
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            initialItem[key] = null;
          } else {
            initialItem[key] = value;
          }
        }
      });
      
      const { error } = await targetSupabaseClient
        .from(tableName)
        .insert([initialItem]);
        
      if (error) {
        console.error(`Error creating table ${tableName}:`, error);
        logMigrationStep({
          table: tableName,
          operation: 'create',
          status: 'error',
          details: error.message
        });
        return false;
      }
      
      await targetSupabaseClient
        .from(tableName)
        .delete()
        .eq('id', initialItem.id);
        
      logMigrationStep({
        table: tableName,
        operation: 'create',
        status: 'success'
      });
      
      return true;
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
      const cleanData = tableData.map(item => {
        const cleanItem: Record<string, any> = { ...item };
        
        if (!cleanItem.id) {
          cleanItem.id = crypto.randomUUID();
        }
        
        if (!cleanItem.created_at) {
          cleanItem.created_at = new Date().toISOString();
        }
        
        Object.entries(cleanItem).forEach(([key, value]) => {
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            cleanItem[key] = JSON.stringify(value);
          }
        });
        
        return cleanItem;
      });
      
      const batchSize = 5;
      const totalItems = cleanData.length;
      let successCount = 0;
      
      for (let i = 0; i < totalItems; i += batchSize) {
        const batch = cleanData.slice(i, i + batchSize);
        
        try {
          const { error } = await targetSupabaseClient
            .from(tableName)
            .upsert(batch, { onConflict: 'id' });
            
          if (error) {
            console.warn(`Batch insert error for ${tableName}:`, error);
            
            for (const item of batch) {
              try {
                const { error: singleError } = await targetSupabaseClient
                  .from(tableName)
                  .upsert(item, { onConflict: 'id' });
                  
                if (!singleError) {
                  successCount++;
                } else {
                  console.error(`Error inserting item in ${tableName}:`, singleError);
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
      
      for (let i = 0; i < totalTables; i++) {
        const tableName = tableNames[i];
        const tableData = schema[tableName];
        
        await createTable(tableName, tableData);
        
        currentProgress = 10 + Math.floor((i + 1) / totalTables * 30);
        setProgress(currentProgress);
      }
      
      for (let i = 0; i < totalTables; i++) {
        const tableName = tableNames[i];
        const tableData = schema[tableName];
        
        await insertDataWithBatching(tableName, tableData);
        
        currentProgress = 40 + Math.floor((i + 1) / totalTables * 30);
        setProgress(currentProgress);
      }
      
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
          Цей майстер допоможе вам налаштувати платформу Elloria з іншим проекто�� Supabase.
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
                  Натисніть кн��пку нижче, щоб розпочати процес імпорту бази даних. 
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
