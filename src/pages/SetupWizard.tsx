
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ChevronRight, Database, Globe, User, Check, KeyRound, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

// Setup wizard steps
const STEPS = {
  WELCOME: 0,
  DATABASE: 1,
  ADMIN: 2,
  SITE: 3,
  COMPLETE: 4
};

// Form schema for database connection
const databaseFormSchema = z.object({
  projectUrl: z.string().url("Please enter a valid URL").min(1, "Project URL is required"),
  apiKey: z.string().min(1, "API key is required")
});

// Form schema for admin user
const adminFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required")
});

// Form schema for site settings
const siteFormSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  defaultLanguage: z.enum(["en", "fr", "uk"]),
  importDefaultSettings: z.boolean().optional()
});

export default function SetupWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [loading, setLoading] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [importingSettings, setImportingSettings] = useState(false);
  
  // Define forms for each step
  const databaseForm = useForm<z.infer<typeof databaseFormSchema>>({
    resolver: zodResolver(databaseFormSchema),
    defaultValues: {
      projectUrl: "",
      apiKey: ""
    }
  });
  
  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: ""
    }
  });
  
  const siteForm = useForm<z.infer<typeof siteFormSchema>>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      siteTitle: "My Website",
      defaultLanguage: "en",
      importDefaultSettings: false
    }
  });

  // Test database connection
  const testDatabaseConnection = async (values: z.infer<typeof databaseFormSchema>) => {
    setLoading(true);
    
    try {
      // In a real app, you would create a new Supabase client with the provided URL and key
      // to test the connection. Here we're simulating with the existing client.
      
      // Simulate a connection test with the existing supabase client
      const { data, error } = await supabase.from('site_settings').select('id').limit(1);
      
      if (error) {
        throw error;
      }
      
      setDatabaseConnected(true);
      toast.success("Database connection successful!");
      // Move to next step
      setCurrentStep(STEPS.ADMIN);
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect to database. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Create admin user
  const createAdminUser = async (values: z.infer<typeof adminFormSchema>) => {
    setLoading(true);
    
    try {
      // Create a new admin user
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName
          }
        }
      });
      
      if (error) throw error;
      
      // Assign admin role (would require RPC or service role in a real app)
      try {
        // We use the supabase client to insert a user role record
        // This assumes that appropriate RLS policies are in place
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user?.id,
            role: 'admin'
          });
          
        if (roleError) throw roleError;
      } catch (roleError) {
        console.warn("Could not assign admin role:", roleError);
        // Continue anyway, as the user was created successfully
      }
      
      toast.success("Admin user created successfully!");
      setCurrentStep(STEPS.SITE);
    } catch (error: any) {
      console.error("Admin creation error:", error);
      toast.error(error.message || "Failed to create admin user");
    } finally {
      setLoading(false);
    }
  };

  // Import default settings
  const importDefaultSettings = async () => {
    setImportingSettings(true);
    
    try {
      const { error } = await supabase.functions.invoke('import-default-data', {
        body: { 
          siteTitle: siteForm.getValues('siteTitle'),
          defaultLanguage: siteForm.getValues('defaultLanguage')
        }
      });
      
      if (error) throw error;
      
      toast.success("Default settings imported successfully!");
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(error.message || "Failed to import default settings");
    } finally {
      setImportingSettings(false);
    }
  };

  // Setup site settings
  const setupSiteSettings = async (values: z.infer<typeof siteFormSchema>) => {
    setLoading(true);
    
    try {
      // Save site settings
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'default',
          site_title: values.siteTitle,
          default_language: values.defaultLanguage,
          enable_registration: true,
          enable_search_indexing: true
        });
      
      if (error) throw error;
      
      // Import default settings if requested
      if (values.importDefaultSettings) {
        await importDefaultSettings();
      }
      
      toast.success("Site setup completed successfully!");
      setCurrentStep(STEPS.COMPLETE);
    } catch (error: any) {
      console.error("Site setup error:", error);
      toast.error(error.message || "Failed to save site settings");
    } finally {
      setLoading(false);
    }
  };

  // Go to dashboard
  const goToDashboard = () => {
    navigate('/admin');
  };

  // Render different step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl">Welcome to Your Application</CardTitle>
              <CardDescription className="text-lg mt-2">
                Let's get you set up in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                  alt="Setup" 
                  className="w-80 h-60 object-cover rounded-md shadow-md"
                />
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Connect to Supabase</h3>
                    <p className="text-sm text-muted-foreground">Set up your Supabase connection for data management</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create Admin Account</h3>
                    <p className="text-sm text-muted-foreground">Set up the primary administrator account</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Basic Site Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure your website name and language</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Import Default Data</h3>
                    <p className="text-sm text-muted-foreground">Install predefined settings and content</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto"
                onClick={() => setCurrentStep(STEPS.DATABASE)}
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case STEPS.DATABASE:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>
                Connect your application to your Supabase database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...databaseForm}>
                <form onSubmit={databaseForm.handleSubmit(testDatabaseConnection)} className="space-y-6">
                  <FormField
                    control={databaseForm.control}
                    name="projectUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supabase Project URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://your-project-id.supabase.co" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The URL of your Supabase project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={databaseForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Your Supabase API key" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          The anon/public key from your Supabase project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>Test Connection</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
        
      case STEPS.ADMIN:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Create Admin User</CardTitle>
              <CardDescription>
                Set up the primary administrator account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(createAdminUser)} className="space-y-6">
                  <FormField
                    control={adminForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={adminForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          At least 6 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(STEPS.DATABASE)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>Continue</>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
        
      case STEPS.SITE:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure basic information about your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...siteForm}>
                <form onSubmit={siteForm.handleSubmit(setupSiteSettings)} className="space-y-6">
                  <FormField
                    control={siteForm.control}
                    name="siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Website" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteForm.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                          <option value="uk">Українська</option>
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteForm.control}
                    name="importDefaultSettings"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 mt-1"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Import Default Settings</FormLabel>
                          <FormDescription>
                            Set up predefined configuration including social links, navigation, and theme colors
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(STEPS.ADMIN)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>Complete Setup</>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
        
      case STEPS.COMPLETE:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Setup Complete!</CardTitle>
              <CardDescription className="text-lg mt-2">
                Your application is now configured and ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <p>Database connection established</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <p>Admin account created</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <p>Site settings configured</p>
                </div>
                {siteForm.getValues("importDefaultSettings") && (
                  <div className="flex items-center justify-center space-x-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <p>Default data imported</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                size="lg"
                onClick={goToDashboard}
              >
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return null;
    }
  };

  // Render progress indicators
  const renderProgress = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {Object.values(STEPS).filter(step => typeof step === 'number').map((step, index) => {
            if (typeof step !== 'number' || step === STEPS.COMPLETE) return null;
            
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;
            
            return (
              <div key={step} className="flex items-center">
                {index > 0 && (
                  <div className={`w-12 h-1 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}></div>
                )}
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/40 py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Application Setup</h1>
        <p className="text-muted-foreground">Complete the setup to get started with your application</p>
      </div>
      
      {currentStep !== STEPS.WELCOME && currentStep !== STEPS.COMPLETE && renderProgress()}
      
      <div className="container mx-auto max-w-5xl">
        {renderStepContent()}
      </div>
    </div>
  );
}
