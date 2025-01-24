import { motion } from "framer-motion";
import { Package, Truck, Calculator, Clock, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const BulkOrders = () => {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-purple/30 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-light mb-6"
            >
              Bulk Orders for Your Business
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-lg mb-8"
            >
              Get premium feminine care products at competitive wholesale prices for your organization
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Request a Quote
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Why Choose Bulk Orders?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Calculator className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Competitive Pricing</h3>
              <p className="text-gray-600">Benefit from wholesale prices and volume discounts tailored to your needs.</p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Package className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Packaging</h3>
              <p className="text-gray-600">Options for branded packaging and custom product assortments.</p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Truck className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reliable Delivery</h3>
              <p className="text-gray-600">Scheduled deliveries and flexible shipping options for your convenience.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-accent-green/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Contact Us</h3>
              <p className="text-gray-600">Reach out with your requirements and organization details.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Get a Quote</h3>
              <p className="text-gray-600">Receive a customized quote based on your needs and volume.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Place Order</h3>
              <p className="text-gray-600">Confirm your order and schedule regular deliveries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">
              Join other organizations that trust Elloria for their feminine care needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Request a Quote
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default BulkOrders;