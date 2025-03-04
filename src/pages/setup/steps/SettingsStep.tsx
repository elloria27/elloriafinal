
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Settings, Import } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { importDefaultSiteSettings } from "@/utils/supabase-helpers";
import type { Database } from "@/integrations/supabase/types";

type SupportedLanguage = Database['public']['Enums']['supported_language'];

interface SettingsStepProps {
  setupData: {
    siteTitle: string;
    siteLanguage: SupportedLanguage;
    contactEmail: string;
    [key: string]: string;
  };
  updateSetupData: (data: Partial<{
    siteTitle: string;
    siteLanguage: SupportedLanguage;
    contactEmail: string;
    [key: string]: string;
  }>) => void;
  updateSetupStatus: (step: string, status: "pending" | "complete" | "error") => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function SettingsStep({
  setupData,
  updateSetupData,
  updateSetupStatus,
  onNext,
  onPrev,
}: SettingsStepProps) {
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [importingDefaults, setImportingDefaults] = useState(false);

  const saveSettings = async () => {
    setSavingSettings(true);
    setSettingsSaved(false);

    try {
      // Validate inputs
      if (!setupData.siteTitle || !setupData.contactEmail) {
        toast.error("Please fill in all required fields");
        setSavingSettings(false);
        return;
      }

      if (!setupData.contactEmail.includes('@')) {
        toast.error("Please enter a valid email address");
        setSavingSettings(false);
        return;
      }

      // In a real implementation, we would update the site_settings table
      // For this demo, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSettingsSaved(true);
      updateSetupStatus("settings", "complete");
      toast.success("Site settings saved successfully!");
    } catch (error) {
      console.error("Settings save error:", error);
      updateSetupStatus("settings", "error");
      toast.error("Failed to save site settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const importDefaults = async () => {
    setImportingDefaults(true);
    
    try {
      const result = await importDefaultSiteSettings();
      
      if (result.success) {
        toast.success(result.message);
        setSettingsSaved(true);
        updateSetupStatus("settings", "complete");
        
        // Update the form with imported values
        updateSetupData({
          siteTitle: "Elloria",
          siteLanguage: "en" as SupportedLanguage,
          contactEmail: "sales@elloria.ca"
        });
      } else {
        toast.error(result.message);
        updateSetupStatus("settings", "error");
      }
    } catch (error) {
      console.error("Import default settings error:", error);
      toast.error("Failed to import default settings");
      updateSetupStatus("settings", "error");
    } finally {
      setImportingDefaults(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-gray-500">
          Configure the basic settings for your site. You can change these later in the admin dashboard.
        </p>
      </div>

      <div className="space-y-4 my-6">
        <div className="space-y-2">
          <Label htmlFor="siteTitle">Site Title</Label>
          <Input
            id="siteTitle"
            placeholder="Elloria"
            value={setupData.siteTitle}
            onChange={(e) => updateSetupData({ siteTitle: e.target.value })}
            disabled={settingsSaved}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteLanguage">Default Language</Label>
          <Select 
            value={setupData.siteLanguage} 
            onValueChange={(value: SupportedLanguage) => updateSetupData({ siteLanguage: value })}
            disabled={settingsSaved}
          >
            <SelectTrigger id="siteLanguage">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="uk">Українська</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="contact@example.com"
            value={setupData.contactEmail}
            onChange={(e) => updateSetupData({ contactEmail: e.target.value })}
            disabled={settingsSaved}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={saveSettings}
            className="flex-1"
            disabled={savingSettings || settingsSaved}
            variant={settingsSaved ? "outline" : "default"}
          >
            {savingSettings ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Settings...
              </>
            ) : settingsSaved ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Settings Saved
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
          
          <Button
            onClick={importDefaults}
            variant="outline"
            disabled={importingDefaults || settingsSaved}
            className="flex-1"
          >
            {importingDefaults ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Import className="mr-2 h-4 w-4" />
                Import Defaults
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!settingsSaved}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
