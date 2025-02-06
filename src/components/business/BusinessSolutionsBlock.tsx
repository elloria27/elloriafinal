import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BusinessSolutionsContent } from "@/types/content-blocks";

interface BusinessSolutionsBlockProps {
  content: BusinessSolutionsContent;
}

export const BusinessSolutionsBlock = ({ content }: BusinessSolutionsBlockProps) => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-4xl md:text-5xl font-light text-center mb-8">
        {content.title || "Elloria for Business"}
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        {content.description || "Discover how Elloria can transform your business with sustainable feminine care solutions."}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(content.solutions || []).map((solution, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">{solution.title}</h3>
            <p className="text-gray-600 mb-4">{solution.description}</p>
            <Link to={solution.link || "#"}>
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium">
                {solution.buttonText || "Learn More"} →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};