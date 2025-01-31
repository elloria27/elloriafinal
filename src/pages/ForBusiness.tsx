import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BusinessContactForm } from "@/components/business/BusinessContactForm";

type BusinessType = "Retailer" | "Distributor" | "Wholesaler" | "Other";

interface FormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  businessType: BusinessType | undefined;
  message: string;
}

const ForBusiness = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    businessType: undefined,
    message: "",
  });

  const handleStepComplete = (stepData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16"
    >
      {/* Business Solutions Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-8">
          Elloria for Business
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover how Elloria can transform your business with sustainable feminine care solutions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bulk Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Bulk Orders</h3>
            <p className="text-gray-600 mb-4">
              Get competitive pricing on large orders for your business or organization.
            </p>
            <Link to="/bulk-orders">
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                Learn More →
              </Button>
            </Link>
          </div>

          {/* Customization */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Custom Solutions</h3>
            <p className="text-gray-600 mb-4">
              Tailored products and packaging to meet your specific needs.
            </p>
            <Link to="/custom-solutions">
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                Learn More →
              </Button>
            </Link>
          </div>

          {/* Sustainability Program */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Sustainability Program</h3>
            <p className="text-gray-600 mb-4">
              Join our eco-friendly initiative and make a positive impact.
            </p>
            <Link to="/sustainability-program">
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                Join Now →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Multi-step Contact Form Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8 max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-full h-1 mx-2
                    ${currentStep > step ? 'bg-primary' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-center">Contact Our Business Team</h2>
                <p className="text-gray-600 text-center mb-8">
                  We'd love to discuss business opportunities with you! Fill out the form below, and our team will get back to you as soon as possible.
                </p>
                <Button 
                  onClick={() => setCurrentStep(2)}
                  className="w-full"
                >
                  Get Started
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
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Message</p>
                    <p className="font-medium">{formData.message}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Edit Information
                  </Button>
                  <Button 
                    onClick={() => {
                      // Handle form submission
                      console.log("Submitting form:", formData);
                      // TODO: Implement form submission logic
                    }}
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
    </motion.main>
  );
};

export default ForBusiness;