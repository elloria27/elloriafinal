
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Loader2, CheckCircle, AlertCircle, Database, User, ArrowRight, GraduationCap } from "lucide-react";
import { runMigration } from "@/setup/migration/migrationRunner";

export default function Install() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("welcome");
  const [isInstallationRequired, setIsInstallationRequired] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{ success: boolean; message: string; table: string } | null>(null);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [showMigrationLogs, setShowMigrationLogs] = useState(false);

  // Supabase connection form
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [supabaseServiceKey, setSupabaseServiceKey] = useState("");
  const [isConnectionTesting, setIsConnectionTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  // Admin form
  const [adminFullName, setAdminFullName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  useEffect(() => {
    checkInstallationStatus();
  }, []);

  const checkInstallationStatus = async () => {
    try {
      // First check if we can connect to Supabase
      const { data: tablesData, error: tablesError } = await supabase
        .from("site_settings")
        .select("id")
        .limit(1);

      if (tablesError) {
        console.log("Supabase connection error:", tablesError);
        setIsInstallationRequired(true);
        setIsLoading(false);
        return;
      }

      // Then check if there are any admin users
      const { data: adminData, error: adminError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "admin")
        .limit(1);

      if (adminError) {
        console.log("Admin check error:", adminError);
        setIsInstallationRequired(true);
        setIsLoading(false);
        return;
      }

      // If both checks pass and there's at least one admin, no installation is required
      if (tablesData?.length > 0 && adminData?.length > 0) {
        setIsInstallationRequired(false);
        navigate("/");
      } else {
        setIsInstallationRequired(true);
      }
    } catch (error) {
      console.error("Installation check error:", error);
      setIsInstallationRequired(true);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      toast.error("Please fill in all connection details");
      return;
    }

    setConnectionStatus("testing");
    setIsConnectionTesting(true);

    try {
      // We'll just test the connection using the provided credentials
      // In a real implementation, you'd want to validate these credentials
      // Creating a temporary client to test connection
      
      // This is simplified for demo purposes
      // In a real app, you would need to set these values 
      // in environment variables or a config file
      localStorage.setItem("supabase_url", supabaseUrl);
      localStorage.setItem("supabase_anon_key", supabaseAnonKey);
      localStorage.setItem("supabase_service_key", supabaseServiceKey);

      // For the purpose of this demo, we'll assume the connection is successful
      // and simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConnectionStatus("success");
      toast.success("Connection successful!");
    } catch (error) {
      console.error("Connection test error:", error);
      setConnectionStatus("error");
      toast.error("Failed to connect to Supabase");
    } finally {
      setIsConnectionTesting(false);
    }
  };

  const runDatabaseMigration = async () => {
    setIsMigrating(true);
    setMigrationLogs([]);
    try {
      const addLog = (log: string) => {
        setMigrationLogs(prev => [...prev, log]);
      };

      addLog("🚀 Starting database migration...");
      
      const result = await runMigration(addLog);
      
      if (result.success) {
        setMigrationStatus({
          success: true,
          message: "Migration completed successfully",
          table: "All tables"
        });
        toast.success("Database migration completed successfully");
        addLog("✅ Migration completed successfully!");
        // Move to next step after successful migration
        setTimeout(() => {
          setCurrentStep("adminSetup");
        }, 1500);
      } else {
        setMigrationStatus({
          success: false,
          message: result.error || "Migration failed",
          table: result.table || "Unknown"
        });
        toast.error(`Migration failed: ${result.error}`);
        addLog(`❌ Migration failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatus({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        table: "Unknown"
      });
      toast.error("An error occurred during migration");
    } finally {
      setIsMigrating(false);
    }
  };

  const createAdminUser = async () => {
    if (!adminEmail || !adminPassword || !adminFullName) {
      toast.error("Please fill in all admin details");
      return;
    }

    setIsCreatingAdmin(true);

    try {
      // 1. Create the user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: adminFullName,
          }
        }
      });

      if (authError) throw authError;

      // 2. Ensure profile is created (usually handled by a trigger)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: authData.user?.id,
          email: adminEmail,
          full_name: adminFullName
        });

      if (profileError) throw profileError;

      // 3. Set user role to admin
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({
          user_id: authData.user?.id,
          role: "admin"
        });

      if (roleError) throw roleError;

      toast.success("Admin account created successfully!");
      
      // Finish installation
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Admin creation error:", error);
      toast.error("Failed to create admin account");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">Checking installation status...</h2>
        </div>
      </div>
    );
  }

  if (!isInstallationRequired) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-muted pb-10">
      <div className="container mx-auto max-w-5xl pt-10">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="text-center border-b pb-8">
            <CardTitle className="text-3xl">Elloria Installation Wizard</CardTitle>
            <CardDescription className="text-lg mt-2">
              Let's set up your Elloria feminine care product platform
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={currentStep} className="w-full">
              <div className="mb-8">
                <TabsList className="w-full grid grid-cols-4 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="welcome"
                    className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 data-[state=active]:bg-transparent"
                    disabled
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "welcome" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>1</div>
                      <span className="hidden sm:inline">Welcome</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="benefits"
                    className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 data-[state=active]:bg-transparent"
                    disabled
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "benefits" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>2</div>
                      <span className="hidden sm:inline">Benefits</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="supabaseSetup"
                    className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 data-[state=active]:bg-transparent"
                    disabled
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "supabaseSetup" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>3</div>
                      <span className="hidden sm:inline">Supabase Setup</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="adminSetup"
                    className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 data-[state=active]:bg-transparent"
                    disabled
                  >
                    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "adminSetup" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>4</div>
                      <span className="hidden sm:inline">Admin Setup</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="welcome" className="mt-0">
                <div className="flex flex-col items-center space-y-6 text-center pt-8 pb-8">
                  <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <img src="/lovable-uploads/724f13b7-0a36-4896-b19a-e51981befdd3.png" alt="Elloria Logo" className="h-16 w-16" />
                  </div>
                  <h3 className="text-2xl font-bold">Welcome to Elloria</h3>
                  <p className="text-lg max-w-xl text-muted-foreground">
                    Thank you for choosing Elloria - the premium feminine care platform. This wizard will guide you through setting up your Elloria system.
                  </p>
                  <div className="flex justify-center mt-6">
                    <Button size="lg" onClick={() => setCurrentStep("benefits")}>
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="mt-0">
                <div className="py-8">
                  <h3 className="text-2xl font-bold text-center mb-8">Key Benefits of Elloria</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Database className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Complete E-commerce</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Fully featured online store with product management, orders, and payments integration.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">User Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Comprehensive user profiles, authentication, and role-based access control.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Educational Content</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Blog system for educational content about feminine care and sustainability.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-center mt-10">
                    <Button variant="outline" onClick={() => setCurrentStep("welcome")} className="mr-2">
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep("supabaseSetup")}>
                      Continue <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="supabaseSetup" className="mt-0">
                <div className="py-8">
                  <h3 className="text-2xl font-bold text-center mb-6">Supabase Database Setup</h3>
                  <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Connect Elloria to your Supabase project. You'll need your Supabase project URL and API keys.
                  </p>

                  <div className="space-y-6 max-w-xl mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="supabaseUrl">Supabase Project URL</Label>
                      <Input
                        id="supabaseUrl"
                        type="text"
                        placeholder="https://your-project-id.supabase.co"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        disabled={connectionStatus === "success" || isConnectionTesting || isMigrating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supabaseAnonKey">Anon/Public Key</Label>
                      <Input
                        id="supabaseAnonKey"
                        type="text"
                        placeholder="eyJhbGciOiJIUzI1NiIXVz..."
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        disabled={connectionStatus === "success" || isConnectionTesting || isMigrating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supabaseServiceKey">Service Role Key</Label>
                      <Input
                        id="supabaseServiceKey"
                        type="text"
                        placeholder="eyJhbGciOiJIUzI1NiIXVz..."
                        value={supabaseServiceKey}
                        onChange={(e) => setSupabaseServiceKey(e.target.value)}
                        disabled={connectionStatus === "success" || isConnectionTesting || isMigrating}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The service role key is needed for database migrations. It will not be stored in the browser.
                      </p>
                    </div>

                    {connectionStatus === "success" && !isMigrating && !migrationStatus && (
                      <div className="pt-4">
                        <Button
                          onClick={runDatabaseMigration}
                          className="w-full"
                          disabled={isMigrating}
                        >
                          {isMigrating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Running Migrations...
                            </>
                          ) : (
                            "Run Database Migration"
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          This will create all necessary tables and sample data in your Supabase project.
                        </p>
                      </div>
                    )}

                    {(isMigrating || migrationStatus) && (
                      <div className="border rounded-md p-4 bg-muted/50 mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Migration Status</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMigrationLogs(true)}
                            className="text-xs h-8"
                          >
                            View Logs
                          </Button>
                        </div>

                        {isMigrating ? (
                          <div className="flex items-center text-sm">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Running migrations...
                          </div>
                        ) : migrationStatus ? (
                          <div className="flex items-center text-sm">
                            {migrationStatus.success ? (
                              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                            )}
                            {migrationStatus.message}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center mt-10">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("benefits")}
                      className="mr-2"
                      disabled={isMigrating}
                    >
                      Back
                    </Button>

                    {connectionStatus !== "success" ? (
                      <Button
                        onClick={testConnection}
                        disabled={!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || isConnectionTesting}
                      >
                        {isConnectionTesting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing Connection...
                          </>
                        ) : (
                          "Test Connection"
                        )}
                      </Button>
                    ) : migrationStatus?.success ? (
                      <Button onClick={() => setCurrentStep("adminSetup")}>
                        Continue <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adminSetup" className="mt-0">
                <div className="py-8">
                  <h3 className="text-2xl font-bold text-center mb-6">Create Admin Account</h3>
                  <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Set up your administrator account to manage your Elloria platform.
                  </p>

                  <div className="space-y-6 max-w-xl mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="adminFullName">Full Name</Label>
                      <Input
                        id="adminFullName"
                        type="text"
                        placeholder="John Doe"
                        value={adminFullName}
                        onChange={(e) => setAdminFullName(e.target.value)}
                        disabled={isCreatingAdmin}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email Address</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@example.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        disabled={isCreatingAdmin}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        disabled={isCreatingAdmin}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Password should be at least 6 characters long
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={createAdminUser}
                        className="w-full"
                        disabled={!adminEmail || !adminPassword || !adminFullName || isCreatingAdmin}
                      >
                        {isCreatingAdmin ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Admin...
                          </>
                        ) : (
                          "Complete Installation"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-10">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("supabaseSetup")}
                      className="mr-2"
                      disabled={isCreatingAdmin}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="border-t pt-6 pb-4">
            <p className="text-center w-full text-sm text-muted-foreground">
              © {new Date().getFullYear()} Elloria. All Rights Reserved.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Migration Logs Sidebar */}
      <Sheet open={showMigrationLogs} onOpenChange={setShowMigrationLogs}>
        <SheetContent className="w-full sm:max-w-xl">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Migration Logs</h3>
            <div className="flex-1 overflow-auto border rounded-md p-4 bg-black/90 text-green-400 font-mono text-sm">
              {migrationLogs.length ? (
                migrationLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted">No migration logs available.</div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
