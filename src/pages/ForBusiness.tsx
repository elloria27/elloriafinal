import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ForBusiness = () => {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16"
    >
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

      {/* Contact Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-8">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Our team is ready to help you find the perfect solution for your business needs.
          </p>
          <div className="flex justify-center">
            <Button className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
              Contact Our Business Team
            </Button>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default ForBusiness;