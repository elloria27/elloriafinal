
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [systemChecks, setSystemChecks] = useState({
    browser: false,
    localStorage: false,
    cookies: false,
    javascript: true,
  });

  useEffect(() => {
    // Check browser compatibility
    const isModernBrowser = 
      'fetch' in window && 
      'Promise' in window && 
      'assign' in Object && 
      'from' in Array;
    
    // Check localStorage availability
    let isLocalStorageAvailable = false;
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      isLocalStorageAvailable = true;
    } catch (e) {
      isLocalStorageAvailable = false;
    }
    
    // Check cookie availability
    let isCookieAvailable = false;
    try {
      document.cookie = "test=test; max-age=10";
      isCookieAvailable = document.cookie.indexOf("test=") !== -1;
      document.cookie = "test=; max-age=0"; // Delete the test cookie
    } catch (e) {
      isCookieAvailable = false;
    }
    
    setSystemChecks({
      browser: isModernBrowser,
      localStorage: isLocalStorageAvailable,
      cookies: isCookieAvailable,
      javascript: true,
    });
  }, []);
  
  const allChecksPass = Object.values(systemChecks).every(check => check);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome to Elloria Setup</h2>
        <p className="text-gray-500">
          This wizard will guide you through the installation process.
          Please ensure all system requirements are met before proceeding.
        </p>
      </div>

      <div className="space-y-4 my-8">
        <h3 className="text-lg font-semibold">System Requirements</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Modern Browser</p>
              <p className="text-sm text-gray-500">Chrome, Firefox, Safari, or Edge required</p>
            </div>
            {systemChecks.browser ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Local Storage</p>
              <p className="text-sm text-gray-500">Required for saving setup progress</p>
            </div>
            {systemChecks.localStorage ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Cookies</p>
              <p className="text-sm text-gray-500">Required for authentication</p>
            </div>
            {systemChecks.cookies ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">JavaScript</p>
              <p className="text-sm text-gray-500">Must be enabled in your browser</p>
            </div>
            {systemChecks.javascript ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={onNext}
          size="lg"
          disabled={!allChecksPass}
          className="w-full md:w-auto"
        >
          Start Installation
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      {!allChecksPass && (
        <div className="text-center text-amber-600 text-sm">
          Please ensure all system requirements are met before proceeding.
        </div>
      )}
    </div>
  );
}
