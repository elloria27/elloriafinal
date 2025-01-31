import { Product } from "@/types/product";

export const initialProducts: Product[] = [
  {
    id: "ultra-thin-290",
    name: "Ultra-Thin 290mm",
    description: "Perfect for light to medium flow days. Features our innovative ultra-thin design for maximum comfort.",
    image: "/lovable-uploads/0df96e81-8434-4436-b873-45aa9c6814cf.png",
    price: 6.99,
    slug: "ultra-thin-290mm",
    features: [
      "Ultra-thin design for maximum comfort",
      "Suitable for light to medium flow",
      "Breathable cotton-like cover",
      "Up to 8 hours of protection",
      "Dermatologically tested"
    ],
    specifications: {
      length: "290mm",
      absorption: "Light to Medium",
      quantity: "10 pads per pack",
      material: "Cotton-like cover with absorbent core",
      features: "Wings, Breathable, Hypoallergenic"
    }
  },
  {
    id: "maxi-pads-350",
    name: "Maxi Pads 350mm",
    description: "Ideal for medium to heavy flow days. Enhanced absorption technology for complete confidence.",
    image: "/lovable-uploads/5064d341-66ba-411d-8a91-8781d383f256.png",
    price: 7.99,
    slug: "maxi-pads-350mm",
    features: [
      "Enhanced absorption technology",
      "Ideal for medium to heavy flow",
      "Extra-long for overnight protection",
      "Soft cotton-like surface",
      "Leak guard barriers"
    ],
    specifications: {
      length: "350mm",
      absorption: "Medium to Heavy",
      quantity: "8 pads per pack",
      material: "Cotton-like cover with super absorbent core",
      features: "Wings, Extra Coverage, Leak Guards"
    }
  },
  {
    id: "overnight-425",
    name: "Overnight 425mm",
    description: "Maximum protection for peaceful nights. Up to 600ml capacity for ultimate security.",
    image: "/lovable-uploads/42c0dc8a-d937-4255-9c12-d484082d26e6.png",
    price: 8.99,
    slug: "overnight-425mm",
    features: [
      "Maximum overnight protection",
      "Up to 600ml absorption capacity",
      "Extra-wide back for sleeping",
      "Soft and quiet material",
      "12-hour protection"
    ],
    specifications: {
      length: "425mm",
      absorption: "Heavy to Very Heavy",
      quantity: "6 pads per pack",
      material: "Premium cotton-like cover with maximum absorbent core",
      features: "Wings, Extra Wide Back, Maximum Coverage"
    }
  }
];