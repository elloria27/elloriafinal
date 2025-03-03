
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      // Validate input values
      if (!formData.url.trim()) {
        throw new Error("URL проекту не може бути порожнім");
      }
      
      if (!formData.key.trim()) {
        throw new Error("Ключ API не може бути порожнім");
      }
      
      // Simple URL validation
      if (!formData.url.startsWith('https://')) {
        throw new Error("URL проекту повинен починатися з 'https://'");
      }
      
      // Simple service role key validation (they tend to be long)
      if (formData.key.length < 30) {
        throw new Error("Ключ API виглядає занадто коротким для service_role ключа");
      }

      // Create actual Supabase client with the provided credentials
      const targetClient = createClient(formData.url, formData.key);
      setTargetSupabaseClient(targetClient);
      
      // Try to make an actual API call to verify connection
      const { data, error: apiError } = await targetClient.auth.getUser();
      
      if (apiError) {
        console.error("Connection error:", apiError);
        throw new Error(`Помилка підключення: ${apiError.message}`);
      }
      
      // If we get here, connection is successful
      console.log("Connection successful, auth data:", data);
      
      toast.success("З'єднання успішно встановлено");
      setCurrentStep("database");
    } catch (err) {
      console.error("Помилка підключення:", err);
      setError(err instanceof Error ? err.message : "Не вдалося підключитися до Supabase проекту. Перевірте URL та ключ доступу.");
    } finally {
      setLoading(false);
    }
  };

  const runDatabaseMigration = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      if (!targetSupabaseClient) {
        throw new Error("Необхідно спочатку встановити з'єднання");
      }

      // Update progress to show we've started
      setProgress(5);
      
      // Get database schema from the exported data
      const schema: DatabaseSchema = databaseExportData;
      console.log("Database schema:", schema);
      
      let currentProgress = 10;
      setProgress(currentProgress);
      
      // Get all table names from the schema
      const tableNames = Object.keys(schema);
      const totalTables = tableNames.length;
      console.log("Tables to create:", tableNames);
      
      // Create tables for each table in the schema
      for (let i = 0; i < totalTables; i++) {
        const tableName = tableNames[i];
        console.log(`Creating table: ${tableName}`);
        
        // Check if the table has any data to determine structure
        if (schema[tableName].length > 0) {
          const sampleRow = schema[tableName][0];
          const columns = Object.keys(sampleRow)
            .filter(col => col !== 'id' && col !== 'created_at') // Skip id and created_at as they will be handled separately
            .map(col => {
              // Determine column type based on value
              const value = sampleRow[col];
              let type = 'TEXT';
              
              if (typeof value === 'number') {
                type = 'NUMERIC';
              } else if (typeof value === 'boolean') {
                type = 'BOOLEAN';
              } else if (value && typeof value === 'object') {
                type = 'JSONB';
              }
              
              return `${col} ${type}`;
            });
          
          // Create the table with all columns
          const { error: tableError } = await targetSupabaseClient.rpc(
            'execute_sql', 
            { 
              sql: `CREATE TABLE IF NOT EXISTS ${tableName} (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                ${columns.join(',\n')}
              )` 
            }
          );
          
          if (tableError) {
            console.error(`Error creating table ${tableName}:`, tableError);
            toast.error(`Помилка створення таблиці ${tableName}: ${tableError.message}`);
            // Continue with other tables despite error
          }
        } else {
          // If no data, create a basic table structure
          const { error: tableError } = await targetSupabaseClient.rpc(
            'execute_sql', 
            { 
              sql: `CREATE TABLE IF NOT EXISTS ${tableName} (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )` 
            }
          );
          
          if (tableError) {
            console.error(`Error creating table ${tableName}:`, tableError);
            toast.error(`Помилка створення таблиці ${tableName}: ${tableError.message}`);
            // Continue with other tables despite error
          }
        }
        
        // Update progress for each table
        currentProgress = 10 + Math.floor((i + 1) / totalTables * 50);
        setProgress(currentProgress);
      }
      
      // Insert data into each table
      for (let i = 0; i < totalTables; i++) {
        const tableName = tableNames[i];
        const tableData = schema[tableName];
        
        if (Array.isArray(tableData) && tableData.length > 0) {
          console.log(`Inserting data into table: ${tableName}`);
          
          // Insert data in batches to avoid overwhelming the API
          const batchSize = 20;
          for (let j = 0; j < tableData.length; j += batchSize) {
            const batch = tableData.slice(j, j + batchSize);
            
            const { error: insertError } = await targetSupabaseClient
              .from(tableName)
              .insert(batch);
            
            if (insertError) {
              console.error(`Error inserting data into ${tableName}:`, insertError);
              // Continue despite errors to try to insert as much as possible
              toast.error(`Помилка вставки даних у таблицю ${tableName}: ${insertError.message}`);
            }
          }
        }
        
        // Update progress for data insertion
        currentProgress = 60 + Math.floor((i + 1) / totalTables * 30);
        setProgress(currentProgress);
        
        // Set basic RLS policy for each table
        const { error: policyError } = await targetSupabaseClient.rpc(
          'execute_sql', 
          { 
            sql: `
              ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;
              CREATE POLICY IF NOT EXISTS "${tableName}_policy" 
              ON ${tableName} 
              FOR ALL 
              TO authenticated 
              USING (true);
            ` 
          }
        );
        
        if (policyError) {
          console.error(`Error setting policy on ${tableName}:`, policyError);
          // Continue despite errors
          toast.error(`Помилка встановлення політики для таблиці ${tableName}: ${policyError.message}`);
        }
      }
      
      // Final progress update
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
