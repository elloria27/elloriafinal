import { motion } from "framer-motion";
import { DonationPartnersProps } from "@/types/content-blocks";

export const DonationPartners = ({ content }: DonationPartnersProps) => {
  const partners = content.partners || [
    {
      name: "Local Women's Shelters",
      logo: "/placeholder.svg",
      description: "Supporting women in crisis"
    },
    {
      name: "Community Health Centers",
      logo: "/placeholder.svg",
      description: "Providing essential healthcare"
    },
    {
      name: "Educational Institutions",
      logo: "/placeholder.svg",
      description: "Empowering through education"
    },
    {
      name: "Non-Profit Organizations",
      logo: "/placeholder.svg",
      description: "Creating lasting change"
    }
  ];

  return (
    <section className="py-20 bg-accent-purple/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.title || "Our Partners in Change"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description || "We work with trusted organizations to ensure your donations reach those who need them most."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
              {partner.description && (
                <p className="text-gray-600 mt-2">{partner.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};