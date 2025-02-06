import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, Recycle, Users } from "lucide-react";
import { SustainabilityRegistrationDialog } from "@/components/sustainability/SustainabilityRegistrationDialog";

const SustainabilityProgram = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen pt-20">
      <SustainabilityRegistrationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our Sustainability Program
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Be part of the solution. Our sustainability program helps businesses reduce their environmental impact while creating positive social change.
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsDialogOpen(true)}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Program Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Leaf className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Environmental Impact</h3>
              <p className="text-gray-600">
                Reduce your carbon footprint and contribute to a healthier planet through sustainable practices.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Engagement</h3>
              <p className="text-gray-600">
                Connect with like-minded businesses and share sustainable practices within our network.
              </p>
            </Card>
            <Card className="p-6">
              <Recycle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Resource Optimization</h3>
              <p className="text-gray-600">
                Access tools and strategies to optimize resource usage and reduce waste in your operations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Assessment</h3>
                <p className="text-gray-600">
                  We begin with a comprehensive assessment of your current environmental impact and sustainability practices.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Planning</h3>
                <p className="text-gray-600">
                  Together, we develop a customized sustainability plan that aligns with your business goals and values.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Implementation</h3>
                <p className="text-gray-600">
                  We provide the tools, resources, and support needed to implement sustainable practices effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join our sustainability program today and be part of the movement towards a more sustainable future.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => setIsDialogOpen(true)}
            >
              Join the Program
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityProgram;