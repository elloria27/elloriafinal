
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Import, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importDefaultSiteSettings } from "@/utils/supabase-helpers";
import { toast } from "sonner";

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState<string>("welcome");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleNext = () => {
    const nextStepMap: { [key: string]: string } = {
      welcome: "site-settings",
      "site-settings": "features",
      features: "complete"
    };

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    setCurrentStep(nextStepMap[currentStep]);
  };

  const handleImportSettings = async () => {
    try {
      const result = await importDefaultSiteSettings();
      if (result.success) {
        toast.success(result.message);
        if (!completedSteps.includes("site-settings")) {
          setCompletedSteps([...completedSteps, "site-settings"]);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to import default settings");
      console.error(error);
    }
  };

  const handleFinish = () => {
    toast.success("Setup completed successfully!");
    navigate("/admin");
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome to Elloria Setup Wizard</CardTitle>
          <CardDescription>
            Let's get your website set up in just a few easy steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <StepIndicator 
                number={1} 
                title="Welcome" 
                active={currentStep === "welcome"} 
                completed={completedSteps.includes("welcome")} 
              />
              <div className="h-1 w-16 bg-gray-200 hidden sm:block"></div>
              <StepIndicator 
                number={2} 
                title="Site Settings" 
                active={currentStep === "site-settings"} 
                completed={completedSteps.includes("site-settings")} 
              />
              <div className="h-1 w-16 bg-gray-200 hidden sm:block"></div>
              <StepIndicator 
                number={3} 
                title="Features" 
                active={currentStep === "features"} 
                completed={completedSteps.includes("features")} 
              />
              <div className="h-1 w-16 bg-gray-200 hidden sm:block"></div>
              <StepIndicator 
                number={4} 
                title="Complete" 
                active={currentStep === "complete"} 
                completed={completedSteps.includes("complete")} 
              />
            </div>
          </div>

          <Tabs value={currentStep} className="mt-8">
            <TabsContent value="welcome">
              <div className="space-y-4 text-center py-6">
                <Settings className="mx-auto h-16 w-16 text-primary" />
                <h3 className="text-2xl font-medium">Welcome to Elloria!</h3>
                <p className="text-muted-foreground mx-auto max-w-md">
                  This wizard will help you set up your website quickly. We'll guide you through the essential steps to get your site up and running.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="site-settings">
              <div className="space-y-6 py-6">
                <h3 className="text-2xl font-medium text-center">Site Settings</h3>
                <p className="text-muted-foreground text-center mx-auto max-w-md mb-8">
                  Import default site settings or configure them manually later
                </p>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleImportSettings} 
                    variant="outline" 
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Import className="h-5 w-5" />
                    Import Default Settings
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground text-center mt-4">
                  You can always adjust these settings later from the admin panel.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="space-y-6 py-6">
                <h3 className="text-2xl font-medium text-center">Choose Features</h3>
                <p className="text-muted-foreground text-center mx-auto max-w-md mb-8">
                  Select which features you'd like to enable for your site
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FeatureCard 
                    title="E-commerce" 
                    description="Enable product catalog and shopping capabilities"
                    enabled={true}
                  />
                  <FeatureCard 
                    title="Blog" 
                    description="Create and publish blog posts"
                    enabled={true}
                  />
                  <FeatureCard 
                    title="Business Features" 
                    description="Enable business-focused features"
                    enabled={true}
                  />
                  <FeatureCard 
                    title="Sustainability" 
                    description="Show your commitment to sustainability"
                    enabled={true}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="complete">
              <div className="space-y-6 py-6 text-center">
                <div className="rounded-full bg-green-100 p-3 w-20 h-20 flex items-center justify-center mx-auto">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-medium">Setup Complete!</h3>
                <p className="text-muted-foreground mx-auto max-w-md">
                  Congratulations! Your website is now set up and ready to go. You can now start customizing your site.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin")}
          >
            Skip Setup
          </Button>
          {currentStep === "complete" ? (
            <Button onClick={handleFinish}>
              Finish
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// Helper components
function StepIndicator({ 
  number, 
  title, 
  active, 
  completed 
}: { 
  number: number; 
  title: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
          active 
            ? "bg-primary text-primary-foreground" 
            : completed 
              ? "bg-green-600 text-white" 
              : "bg-muted text-muted-foreground"
        }`}
      >
        {completed ? <Check className="h-5 w-5" /> : number}
      </div>
      <span className={`text-sm ${active ? "font-medium" : ""}`}>{title}</span>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  enabled 
}: { 
  title: string; 
  description: string; 
  enabled: boolean; 
}) {
  return (
    <div className="border rounded-lg p-4 flex items-start gap-3">
      <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${
        enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
      }`}>
        <Check className="h-3 w-3" />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
