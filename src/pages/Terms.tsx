import { Container } from "@/components/ui/container";

const Terms = () => {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-6">
            Welcome to Elloria. By accessing and using our website and services, you agree to comply with and be bound by these Terms and Conditions.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <p className="mb-6">
            Our products and services are intended for personal use. You agree to use our website and services only for lawful purposes and in accordance with these Terms.
          </p>

          <h2 className="text-2xl font-semibold mb-4">3. Privacy Policy</h2>
          <p className="mb-6">
            Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </p>

          <h2 className="text-2xl font-semibold mb-4">4. Product Information</h2>
          <p className="mb-6">
            We strive to provide accurate product descriptions and pricing. However, we reserve the right to correct any errors and modify prices without prior notice.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Orders and Payment</h2>
          <p className="mb-6">
            All orders are subject to acceptance and availability. We reserve the right to refuse any order without giving reason.
          </p>

          <h2 className="text-2xl font-semibold mb-4">6. Shipping and Delivery</h2>
          <p className="mb-6">
            Delivery times are estimates only. We are not responsible for delays beyond our control.
          </p>

          <h2 className="text-2xl font-semibold mb-4">7. Returns and Refunds</h2>
          <p className="mb-6">
            Please refer to our Returns Policy for information about returning products and receiving refunds.
          </p>

          <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p className="mb-6">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.
          </p>

          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about these Terms, please contact us through our website.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Terms;