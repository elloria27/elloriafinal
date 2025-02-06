import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Paintbrush, 
  Package, 
  Truck,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { CustomSolutionsDialog } from "@/components/business/CustomSolutionsDialog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CustomSolutions = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-grow pt-16"
      >
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-8">
          Custom Solutions for Your Business
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          We work closely with businesses to create tailored feminine care solutions that meet your specific needs and requirements.
        </p>
      </section>

      {/* Services Grid */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Paintbrush className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Design</h3>
              <p className="text-gray-600">
                Tailored product designs that align with your brand identity and values.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Package className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Packaging</h3>
              <p className="text-gray-600">
                Branded packaging solutions that enhance your customer experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Truck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Flexible Delivery</h3>
              <p className="text-gray-600">
                Customized delivery schedules to match your business operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
              <p className="text-gray-600">
                Personal account manager to handle your specific requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">
          Our Custom Solution Process
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <span className="text-primary font-semibold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Initial Consultation</h3>
                <p className="text-gray-600">
                  We begin with a detailed discussion of your needs, objectives, and constraints.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <span className="text-primary font-semibold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Solution Design</h3>
                <p className="text-gray-600">
                  Our team develops a customized solution tailored to your requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-3">
                <span className="text-primary font-semibold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Implementation</h3>
                <p className="text-gray-600">
                  We work closely with you to implement the solution seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us today to discuss how we can create a custom solution for your business needs.
          </p>
          <Button 
            className="bg-primary text-white px-8 py-6 rounded-full hover:bg-primary/90 transition-colors"
            onClick={() => setShowDialog(true)}
          >
            Request a Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      </motion.main>
      <Footer />
      <CustomSolutionsDialog 
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </div>
  );
};

export default CustomSolutions;
