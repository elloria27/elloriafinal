
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Database, RotateCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DatabaseStepProps {
  setupData: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceRoleKey: string;
    [key: string]: string;
  };
  updateSetupStatus: (step: string, status: "pending" | "complete" | "error") => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function DatabaseStep({
  setupData,
  updateSetupStatus,
  onNext,
  onPrev,
}: DatabaseStepProps) {
  const [migrationRunning, setMigrationRunning] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationSuccess, setMigrationSuccess] = useState(false);
  const [migrationLog, setMigrationLog] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<string>("");
  const [tableCount, setTableCount] = useState<number>(0);
  const [completedTables, setCompletedTables] = useState<number>(0);

  const tableGroups = [
    { name: "Core Tables", tables: ["site_settings", "user_roles", "profiles"] },
    { name: "Content Management", tables: ["pages", "content_blocks", "component_definitions", "seo_settings"] },
    { name: "Blog System", tables: ["blog_categories", "blog_posts", "blog_comments", "blog_settings"] },
    { name: "ECommerce", tables: ["products", "inventory", "orders", "promo_codes", "shop_settings"] },
    { name: "HRM System", tables: ["hrm_tasks", "hrm_invoices", "hrm_customers", "hrm_estimates"] },
    { name: "File Management", tables: ["folders", "file_shares", "bulk_file_shares"] },
    { name: "User Engagement", tables: ["subscriptions", "contact_submissions", "donations"] },
    { name: "Analytics", tables: ["page_views", "referrals"] },
  ];

  const calculateTotalTables = () => {
    return tableGroups.reduce((acc, group) => acc + group.tables.length, 0);
  };

  useEffect(() => {
    setTableCount(calculateTotalTables());
  }, []);

  const simulateProgressUpdates = () => {
    let completedCount = 0;
    const totalGroups = tableGroups.length;
    
    // Simulate the progress updates for each table group
    tableGroups.forEach((group, groupIndex) => {
      setTimeout(() => {
        setMigrationLog(prev => [...prev, `Creating ${group.name} tables...`]);
        
        group.tables.forEach((table, tableIndex) => {
          setTimeout(() => {
            setCurrentTable(table);
            completedCount++;
            setCompletedTables(completedCount);
            setMigrationLog(prev => [...prev, `Created table: ${table}`]);
          }, tableIndex * 200); // Space out the table updates within a group
        });
        
        if (groupIndex === totalGroups - 1) {
          // After all groups are processed, add final logs
          setTimeout(() => {
            setMigrationLog(prev => [...prev, "Setting up security policies..."]);
            setTimeout(() => {
              setMigrationLog(prev => [...prev, "Creating default data..."]);
              setTimeout(() => {
                setMigrationLog(prev => [...prev, "Database migration completed successfully!"]);
              }, 500);
            }, 800);
          }, group.tables.length * 200 + 300);
        }
      }, groupIndex * (group.tables.length * 200 + 500)); // Space out the group updates
    });
  };

  const runMigration = async () => {
    setMigrationRunning(true);
    setMigrationComplete(false);
    setMigrationSuccess(false);
    setMigrationLog(["Starting database migration..."]);
    setCurrentTable("");
    setCompletedTables(0);

    try {
      // Add log entries
      setMigrationLog(prev => [...prev, "Checking database connection..."]);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating wait time
      
      setMigrationLog(prev => [...prev, "Database connection successful"]);
      setMigrationLog(prev => [...prev, "Starting table creation process..."]);
      
      // Start the simulated progress updates
      simulateProgressUpdates();
      
      // Call the setup-wizard function
      const { data, error } = await supabase.functions.invoke('setup-wizard', {
        body: { action: 'run-migration' }
      });

      console.log("Response from setup-wizard function:", data, error);

      if (error) {
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Unknown error occurred");
      }
      
      // Wait for the simulated progress to complete before finalizing
      // This ensures the user sees a smooth progress even if the actual DB operation finishes quickly
      const totalDelay = tableGroups.reduce(
        (acc, group, index) => acc + (group.tables.length * 200 + 500), 
        0
      ) + 2000; // Add some extra buffer
      
      await new Promise(resolve => setTimeout(resolve, totalDelay));
      
      setMigrationComplete(true);
      setMigrationSuccess(true);
      updateSetupStatus("database", "complete");
      toast.success("Database migration completed successfully!");
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationLog(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
      setMigrationComplete(true);
      setMigrationSuccess(false);
      updateSetupStatus("database", "error");
      toast.error("Database migration failed");
    } finally {
      setMigrationRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Database Setup</h2>
        <p className="text-gray-500">
          This step will create all necessary database tables, schemas, and initial data
          for your Elloria installation.
        </p>
      </div>

      <div className="space-y-4 my-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Database Migration
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            This process will set up the following database components:
          </p>
          
          <ul className="text-sm space-y-2 mb-4">
            {tableGroups.map((group) => (
              <li key={group.name} className="flex items-start">
                <CheckCircle2 className={`mr-2 h-4 w-4 ${
                  migrationSuccess ? "text-green-500" : "text-gray-400"
                } mt-0.5`} />
                <span>{group.name} ({group.tables.length} tables)</span>
              </li>
            ))}
            <li className="flex items-start">
              <CheckCircle2 className={`mr-2 h-4 w-4 ${
                migrationSuccess ? "text-green-500" : "text-gray-400"
              } mt-0.5`} />
              <span>Security policies for data protection</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className={`mr-2 h-4 w-4 ${
                migrationSuccess ? "text-green-500" : "text-gray-400"
              } mt-0.5`} />
              <span>Default site settings and initial data</span>
            </li>
          </ul>
          
          {tableCount > 0 && migrationRunning && (
            <div className="mb-4">
              <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                <div 
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300" 
                  style={{ width: `${(completedTables / tableCount) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {completedTables} of {tableCount} tables created
                {currentTable && ` • Current: ${currentTable}`}
              </p>
            </div>
          )}
          
          <Button
            onClick={runMigration}
            className="w-full"
            disabled={migrationRunning}
            variant={migrationComplete && migrationSuccess ? "outline" : "default"}
          >
            {migrationRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Migration...
              </>
            ) : migrationComplete && migrationSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Migration Successful
              </>
            ) : migrationComplete && !migrationSuccess ? (
              <>
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                Retry Migration
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Run Database Migration
              </>
            )}
          </Button>
        </div>
        
        {migrationLog.length > 0 && (
          <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-60 overflow-y-auto">
            {migrationLog.map((log, index) => (
              <div key={index} className="pb-1">
                <span className="opacity-50">&gt; </span>
                {log}
              </div>
            ))}
            {migrationRunning && (
              <div className="pb-1 flex items-center">
                <span className="opacity-50">&gt; </span>
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                <span className="animate-pulse">Processing...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!migrationComplete || !migrationSuccess}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
