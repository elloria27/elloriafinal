import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BusinessContactForm } from "./BusinessContactForm";
import { FileUpload } from "@/components/admin/file/FileUpload";
import { BusinessContactFormContent } from "@/types/content-blocks";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BusinessContactFormBlockProps {
  content: BusinessContactFormContent;
}

export const BusinessContactFormBlock = ({ content }: BusinessContactFormBlockProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    businessType: undefined as "Retailer" | "Distributor" | "Wholesaler" | "Other" | undefined,
    message: "",
    attachments: [] as File[],
  });

  const handleStepComplete = (stepData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleFileUpload = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, file],
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-business-inquiry', {
        body: formData
      });

      if (error) throw error;

      toast.success("Your inquiry has been sent successfully!");
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        businessType: undefined,
        message: "",
        attachments: [],
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send your inquiry. Please try again.");
    }
  };

  const totalSteps = 4;

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-12 max-w-md mx-auto relative">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 border-2
                  ${currentStep >= step 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                  }
                `}
              >
                {step}
              </div>
              <span className={`
                mt-2 text-sm font-medium whitespace-nowrap
                ${currentStep >= step ? 'text-primary' : 'text-gray-500'}
              `}>
                {step === 1 ? 'Start' 
                  : step === 2 ? 'Details' 
                  : step === 3 ? 'Documents' 
                  : 'Review'}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-0 h-[2px] bg-gray-200 w-full -z-0">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-center">
                {content.title || "Contact Our Business Team"}
              </h2>
              <p className="text-gray-600 text-center mb-8">
                {content.description || "We'd love to discuss business opportunities with you! Fill out the form below, and our team will get back to you as soon as possible."}
              </p>
              <Button 
                onClick={() => setCurrentStep(2)}
                className="w-full"
              >
                {content.buttonText || "Get Started"}
              </Button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <BusinessContactForm 
              onComplete={handleStepComplete}
              initialData={formData}
            />
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-center">Attach Documents</h2>
              <p className="text-gray-600 text-center mb-8">
                Upload any relevant documents to support your business inquiry (optional).
              </p>
              <div className="space-y-4">
                <FileUpload onUpload={handleFileUpload} />
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Attached Files:</h4>
                    <ul className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="truncate">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(4)}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-center">Review Your Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="font-medium">{formData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{formData.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Type</p>
                    <p className="font-medium">{formData.businessType}</p>
                  </div>
                  {formData.attachments.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Attachments</p>
                      <p className="font-medium">{formData.attachments.length} files</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="font-medium">{formData.message}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  Submit
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};