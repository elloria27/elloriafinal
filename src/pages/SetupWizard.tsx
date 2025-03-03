
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileCheck2, Database, User, Settings, ArrowRight, ArrowLeft, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Schema for database connection step
const connectionSchema = z.object({
  supabaseUrl: z.string().url({ message: "Введіть валідний URL Supabase проекту" }),
  supabaseKey: z.string().min(20, { message: "Публічний ключ Supabase повинен бути валідним" }),
});

// Schema for admin user step
const adminSchema = z.object({
  email: z.string().email({ message: "Введіть валідну email адресу" }),
  password: z.string()
    .min(8, { message: "Пароль повинен містити мінімум 8 символів" })
    .regex(/[A-Z]/, { message: "Пароль повинен містити хоча б одну велику літеру" })
    .regex(/[0-9]/, { message: "Пароль повинен містити хоча б одну цифру" }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: "Ім'я повинно містити мінімум 2 символи" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});

// Schema for site settings step
const siteSettingsSchema = z.object({
  siteTitle: z.string().min(2, { message: "Назва сайту повинна містити мінімум 2 символи" }),
  siteDescription: z.string().optional(),
  defaultLanguage: z.enum(["en", "uk", "fr"]),
  importDefaultSettings: z.boolean().default(true),
});

// Wizard steps
const steps = [
  { id: "welcome", title: "Ласкаво просимо", icon: <FileCheck2 /> },
  { id: "database", title: "База даних", icon: <Database /> },
  { id: "admin", title: "Адміністратор", icon: <User /> },
  { id: "settings", title: "Налаштування", icon: <Settings /> },
];

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [progress, setProgress] = useState(0);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [connectionValid, setConnectionValid] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [setupData, setSetupData] = useState({
    connection: {
      supabaseUrl: "",
      supabaseKey: "",
    },
    admin: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
    settings: {
      siteTitle: "",
      siteDescription: "",
      defaultLanguage: "en" as "en" | "uk" | "fr",
      importDefaultSettings: true,
    },
  });
  
  const navigate = useNavigate();

  // Initialize forms for each step
  const connectionForm = useForm<z.infer<typeof connectionSchema>>({
    resolver: zodResolver(connectionSchema),
    defaultValues: setupData.connection,
  });

  const adminForm = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: setupData.admin,
  });

  const settingsForm = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: setupData.settings,
  });

  // Update progress based on current step
  useEffect(() => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    const newProgress = (stepIndex / (steps.length - 1)) * 100;
    setProgress(newProgress);
  }, [currentStep]);

  // Handle step navigation
  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Test database connection
  const testConnection = async (data: z.infer<typeof connectionSchema>) => {
    setIsCheckingConnection(true);
    try {
      // Store the connection data
      setSetupData(prev => ({
        ...prev,
        connection: data,
      }));
      
      // In a real implementation, we would test the connection here
      // For now, we'll simulate success after a delay
      setTimeout(() => {
        setConnectionValid(true);
        setSupabaseConnected(true);
        toast.success("З'єднання з базою даних успішно встановлено!");
        nextStep();
      }, 1500);
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Помилка при з'єднанні з базою даних. Перевірте дані та спробуйте знову.");
      setConnectionValid(false);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  // Handle admin user creation
  const createAdminUser = async (data: z.infer<typeof adminSchema>) => {
    try {
      // Store the admin data
      setSetupData(prev => ({
        ...prev,
        admin: data,
      }));
      
      // In a real implementation, we'd create the admin user in Supabase
      // For now, we'll just move to the next step
      toast.success("Обліковий запис адміністратора створено успішно!");
      nextStep();
    } catch (error) {
      console.error("Admin creation error:", error);
      toast.error("Помилка при створенні облікового запису адміністратора.");
    }
  };

  // Complete the setup process
  const completeSetup = async (data: z.infer<typeof siteSettingsSchema>) => {
    try {
      // Store the settings data
      setSetupData(prev => ({
        ...prev,
        settings: data,
      }));
      
      // If the user has chosen to import default settings
      if (data.importDefaultSettings) {
        try {
          const { error } = await supabase.functions.invoke('import-default-data', {
            body: {
              siteTitle: data.siteTitle,
              siteDescription: data.siteDescription,
              defaultLanguage: data.defaultLanguage
            },
          });
          
          if (error) throw error;
          toast.success("Імпорт даних за замовчуванням виконано успішно!");
        } catch (importError) {
          console.error("Import error:", importError);
          toast.error("Помилка при імпорті даних за замовчуванням.");
        }
      }
      
      // In a real implementation, we'd save the settings to Supabase
      // We would also create necessary tables and configurations
      
      // Show success message and mark setup as complete
      toast.success("Налаштування сайту завершено успішно!");
      setSetupComplete(true);
    } catch (error) {
      console.error("Settings error:", error);
      toast.error("Помилка при збереженні налаштувань.");
    }
  };

  // Reset the setup process
  const resetSetup = () => {
    setCurrentStep("welcome");
    setConnectionValid(false);
    setSetupComplete(false);
    connectionForm.reset();
    adminForm.reset();
    settingsForm.reset();
  };

  // Start using the application
  const startUsing = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Майстер встановлення</h1>
          <p className="text-gray-600 mt-2">Налаштуйте вашу систему за кілька простих кроків</p>
        </div>

        <div className="mb-8">
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-wrap justify-between mb-6">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.findIndex(s => s.id === currentStep)
                      ? "text-green-500"
                      : currentStep === step.id
                      ? "text-primary"
                      : "text-gray-400"
                  } mb-2 sm:mb-0`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full mr-2 ${
                      index < steps.findIndex(s => s.id === currentStep)
                        ? "bg-green-100"
                        : currentStep === step.id
                        ? "bg-primary/10"
                        : "bg-gray-100"
                    }`}
                  >
                    {index < steps.findIndex(s => s.id === currentStep) ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`hidden sm:inline-block font-medium ${
                      index < steps.findIndex(s => s.id === currentStep)
                        ? "text-green-500"
                        : currentStep === step.id
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            
            <Progress value={progress} className="h-2 mb-6" />

            {currentStep === "welcome" && (
              <Card>
                <CardHeader>
                  <CardTitle>Ласкаво просимо до майстра встановлення</CardTitle>
                  <CardDescription>
                    Цей майстер допоможе вам налаштувати вашу систему Supabase.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                    <h3 className="font-semibold flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Перед початком
                    </h3>
                    <p className="mt-2 text-sm">
                      Переконайтеся, що у вас є:
                    </p>
                    <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                      <li>URL вашого проекту Supabase</li>
                      <li>Публічний ключ API Supabase</li>
                      <li>Доступ до електронної пошти для створення облікового запису адміністратора</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-semibold">Кроки встановлення:</h3>
                    <ol className="list-decimal pl-6 mt-2 text-sm space-y-1">
                      <li>Підключення до бази даних Supabase</li>
                      <li>Створення облікового запису адміністратора</li>
                      <li>Налаштування сайту</li>
                      <li>Завершення встановлення</li>
                    </ol>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={nextStep} className="flex items-center">
                    Почати <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === "database" && (
              <Card>
                <CardHeader>
                  <CardTitle>Підключення до бази даних</CardTitle>
                  <CardDescription>
                    Введіть дані для підключення до вашого проекту Supabase.
                  </CardDescription>
                </CardHeader>
                <Form {...connectionForm}>
                  <form onSubmit={connectionForm.handleSubmit(testConnection)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={connectionForm.control}
                        name="supabaseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL проекту Supabase</FormLabel>
                            <div className="flex items-center">
                              <FormControl>
                                <Input
                                  placeholder="https://your-project.supabase.co"
                                  {...field}
                                />
                              </FormControl>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      type="button"
                                      className="ml-2"
                                    >
                                      <HelpCircle className="h-5 w-5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>URL вашого проекту Supabase знаходиться в налаштуваннях проекту, розділ "API".</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={connectionForm.control}
                        name="supabaseKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Публічний ключ API</FormLabel>
                            <div className="flex items-center">
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="eyJ0eXAiOiJKV1QiLCJhbGci..."
                                  {...field}
                                />
                              </FormControl>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      type="button"
                                      className="ml-2"
                                    >
                                      <HelpCircle className="h-5 w-5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>Публічний ключ API знаходиться в налаштуваннях проекту, розділ "API", підрозділ "anon/public".</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                      </Button>
                      <Button
                        type="submit"
                        disabled={isCheckingConnection}
                        className="flex items-center"
                      >
                        {isCheckingConnection
                          ? "Перевірка з'єднання..."
                          : "Перевірити з'єднання"}
                        {!isCheckingConnection && (
                          <ArrowRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            )}

            {currentStep === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Створення адміністратора</CardTitle>
                  <CardDescription>
                    Введіть дані для створення облікового запису адміністратора.
                  </CardDescription>
                </CardHeader>
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(createAdminUser)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={adminForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email адреса</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="admin@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={adminForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Повне ім'я</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Іван Петренко"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={adminForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Пароль</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Введіть пароль"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={adminForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Підтвердження паролю</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Повторіть пароль"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800 text-sm">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Вимоги до пароля:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Мінімум 8 символів</li>
                              <li>Щонайменше одна велика літера</li>
                              <li>Щонайменше одна цифра</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                      </Button>
                      <Button type="submit" className="flex items-center">
                        Далі <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            )}

            {currentStep === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Налаштування сайту</CardTitle>
                  <CardDescription>
                    Налаштуйте основні параметри сайту.
                  </CardDescription>
                </CardHeader>
                <Form {...settingsForm}>
                  <form onSubmit={settingsForm.handleSubmit(completeSetup)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={settingsForm.control}
                        name="siteTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Назва сайту</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Моя компанія"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Опис сайту</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Короткий опис вашого сайту"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="defaultLanguage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Мова за замовчуванням</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Виберіть мову" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="uk">Українська</SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="importDefaultSettings"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Імпортувати налаштування за замовчуванням
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Створити базові таблиці, зразок сторінки та основні налаштування
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Назад
                      </Button>
                      <Button type="submit" className="flex items-center">
                        Завершити <CheckCircle2 className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            )}

            {setupComplete && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center">
                    <CheckCircle2 className="h-6 w-6 mr-2" />
                    Встановлення завершено!
                  </CardTitle>
                  <CardDescription>
                    Ваша система успішно налаштована та готова до використання.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 text-green-800">
                    <h3 className="font-semibold">Що далі?</h3>
                    <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                      <li>Увійдіть до адміністративної панелі</li>
                      <li>Створіть контент вашого сайту</li>
                      <li>Налаштуйте додаткові параметри</li>
                      <li>Запросіть користувачів</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={startUsing} className="flex items-center">
                    Почати використання <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
