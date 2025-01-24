import { FileText, Shield, Info, ScrollText, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  const sections = [
    { id: "general", title: "General Terms" },
    { id: "product", title: "Product Information" },
    { id: "ordering", title: "Ordering and Payments" },
    { id: "shipping", title: "Shipping and Delivery" },
    { id: "returns", title: "Returns and Refunds" },
    { id: "privacy", title: "Privacy and Data Protection" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "responsibilities", title: "User Responsibilities" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "law", title: "Governing Law" },
    { id: "updates", title: "Updates to Terms" },
    { id: "contact", title: "Contact Information" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary/30 py-16 md:py-24 mb-8 md:mb-0">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Elloria Terms & Conditions
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Learn about your rights, responsibilities, and our policies.
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                  <span className="text-primary hover:text-primary/80">
                    {section.title}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          <section id="general" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-primary" />
              General Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By using our website or purchasing our products, you agree to these terms and conditions. 
              These terms constitute a legally binding agreement between you and Elloria regarding your use 
              of our website and services.
            </p>
          </section>

          <Separator />

          <section id="product" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary" />
              Product Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All product information, including descriptions, specifications, and pricing, is provided 
              accurately to the best of our knowledge. However, we reserve the right to modify this 
              information without notice. Images are representative, and actual products may vary slightly.
            </p>
          </section>

          <Separator />

          <section id="ordering" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Ordering and Payments
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We accept major credit cards and secure online payment methods. All transactions are 
              processed in Canadian Dollars (CAD). Prices displayed are exclusive of applicable taxes 
              and shipping costs, which will be calculated at checkout.
            </p>
          </section>

          <section id="shipping" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary" />
              Shipping and Delivery
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to deliver your orders promptly. Estimated shipping times will be provided at 
              checkout. Shipping costs vary based on the delivery location and will be calculated at 
              checkout. Please ensure that you provide accurate delivery details to avoid delays.
            </p>
          </section>

          <Separator />

          <section id="returns" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Returns and Refunds
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You may return unused and unopened products within 30 days of purchase for a full refund. 
              To initiate a return, please contact our customer service team. Refunds will be processed 
              within 14 days of receiving the returned item.
            </p>
          </section>

          <Separator />

          <section id="privacy" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary" />
              Privacy and Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We value your privacy and are committed to protecting your personal data. We collect 
              information such as your name, email, and address to process your orders. For more 
              details, please refer to our Privacy Policy.
            </p>
          </section>

          <Separator />

          <section id="intellectual" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content on our website, including text, images, and logos, is the intellectual 
              property of Elloria. Unauthorized use or reproduction of any content is strictly 
              prohibited.
            </p>
          </section>

          <Separator />

          <section id="responsibilities" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              User Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Users are responsible for providing accurate information during transactions and must 
              refrain from engaging in fraudulent or harmful activities on our website.
            </p>
          </section>

          <Separator />

          <section id="liability" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Elloria is not liable for any damages resulting from the misuse of our products or 
              delays in delivery that are beyond our control.
            </p>
          </section>

          <Separator />

          <section id="law" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of 
              Canada.
            </p>
          </section>

          <Separator />

          <section id="updates" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              Updates to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Elloria reserves the right to update these terms at any time. Customers will be notified 
              of any significant changes.
            </p>
          </section>

          <Separator />

          <section id="contact" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Contact Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>For any questions or clarifications about these terms, please contact us:</p>
              <ul className="list-none space-y-2">
                <li>Email: support@elloria.ca</li>
                <li>Phone: +1 (204) 930-2019</li>
                <li>Address: 229 Dowling Ave W, Winnipeg, MB R2C 2K4</li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Terms;
