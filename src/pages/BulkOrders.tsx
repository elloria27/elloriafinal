import { motion } from "framer-motion";
import { FeaturesContent } from "@/types/content-blocks";
import { convertToFeatureItems } from "@/utils/contentConverters";

const BulkOrders = () => {
  const defaultFeatures = [
    {
      icon: "Leaf",
      title: "Eco-Friendly",
      description: "Our products are made with sustainable materials."
    },
    {
      icon: "Recycle",
      title: "Recyclable",
      description: "Designed for responsible disposal."
    },
    {
      icon: "Factory",
      title: "Ethically Made",
      description: "Produced in facilities that prioritize sustainability."
    }
  ];

  const defaultBenefits = [
    {
      icon: "Shield",
      title: "Safe and Secure",
      description: "Our products are rigorously tested for safety."
    },
    {
      icon: "Heart",
      title: "Gentle on Skin",
      description: "Hypoallergenic materials for sensitive skin."
    },
    {
      icon: "Package",
      title: "Convenient Packaging",
      description: "Easy to use and dispose of."
    }
  ];

  const content = {
    features: [
      {
        icon: "Leaf",
        title: "Eco-Friendly",
        description: "Our products are made with sustainable materials."
      },
      {
        icon: "Recycle",
        title: "Recyclable",
        description: "Designed for responsible disposal."
      },
      {
        icon: "Factory",
        title: "Ethically Made",
        description: "Produced in facilities that prioritize sustainability."
      }
    ],
    benefits: [
      {
        icon: "Shield",
        title: "Safe and Secure",
        description: "Our products are rigorously tested for safety."
      },
      {
        icon: "Heart",
        title: "Gentle on Skin",
        description: "Hypoallergenic materials for sensitive skin."
      },
      {
        icon: "Package",
        title: "Convenient Packaging",
        description: "Easy to use and dispose of."
      }
    ]
  };

  const features = content?.features ? convertToFeatureItems(content.features) : defaultFeatures;
  const benefits = content?.benefits ? convertToFeatureItems(content.benefits) : defaultBenefits;

  return (
    <div>
      <section>
        <h2>Features</h2>
        <div>
          {features.map((feature, index) => (
            <div key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Benefits</h2>
        <div>
          {benefits.map((benefit, index) => (
            <div key={index}>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BulkOrders;
