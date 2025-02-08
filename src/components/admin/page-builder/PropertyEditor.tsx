
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { HomePageEditor } from "./editors/HomePageEditor";
import { AboutPageEditor } from "./editors/AboutPageEditor";
import { ContactPageEditor } from "./editors/ContactPageEditor";
import { CommonEditor } from "./editors/CommonEditor";
import { SustainabilityEditor } from "./editors/SustainabilityEditor";
import { ForBusinessEditor } from "./editors/ForBusinessEditor";
import { CustomSolutionsEditor } from "./editors/CustomSolutionsEditor";
import { ProductCarouselEditor } from "./editors/ProductCarouselEditor";
import { CompetitorComparisonEditor } from "./editors/CompetitorComparisonEditor";
import { DonationEditor } from "./editors/DonationEditor";
import { ThanksPageEditor } from "./editors/ThanksPageEditor";
import { BulkEditor } from "./editors/BulkEditor";
import { SustainabilityProgramEditor } from "./editors/SustainabilityProgramEditor";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  console.log("Rendering PropertyEditor for block type:", block.type);

  // Home page components
  const homeComponents = [
    "hero",
    "game_changer",
    "store_brands",
    "sustainability",
    "features",
  ];

  // About page components
  const aboutComponents = [
    "about_hero_section",
    "about_story",
    "about_mission",
    "about_sustainability",
    "about_team",
    "about_customer_impact",
  ];

  // Contact page components
  const contactComponents = [
    "contact_hero",
    "contact_details",
    "contact_form",
    "contact_faq",
    "contact_business",
  ];

  // Sustainability page components
  const sustainabilityComponents = [
    "sustainability_hero",
    "sustainability_mission",
    "sustainability_materials",
    "sustainability_faq",
    "sustainability_cta"
  ];

  // Business page components
  const businessComponents = [
    "business_hero",
    "business_solutions",
    "business_contact",
  ];

  // Custom Solutions page components
  const customSolutionsComponents = [
    "custom_solutions_hero",
    "custom_solutions_services",
    "custom_solutions_process",
    "custom_solutions_cta",
  ];

  // Donation page components
  const donationComponents = [
    "donation_hero",
    "donation_impact",
    "donation_form",
    "donation_stories",
    "donation_partners",
    "donation_faq",
    "donation_join_movement",
  ];

  // Thanks page components
  const thanksComponents = [
    "thanks_welcome",
    "thanks_referral",
    "thanks_special_offer",
    "thanks_newsletter",
  ];

  // Bulk order components
  const bulkComponents = [
    "bulk_hero",
    "bulk_benefits",
    "bulk_process",
    "bulk_cta",
  ];

  // Sustainability Program components
  const sustainabilityProgramComponents = [
    "sustainability_program_hero",
    "sustainability_program_benefits",
    "sustainability_program_process",
    "sustainability_program_cta",
  ];

  // Common components
  const commonComponents = [
    "heading",
    "text",
    "image",
    "video",
    "button",
    "testimonials",
    "blog_preview",
  ];

  const getEditor = () => {
    if (block.type === "competitor_comparison") {
      return <CompetitorComparisonEditor block={block} onUpdate={onUpdate} />;
    }

    if (block.type === "product_carousel") {
      return <ProductCarouselEditor block={block} onUpdate={onUpdate} />;
    }

    if (sustainabilityComponents.includes(block.type)) {
      return <SustainabilityEditor block={block} onUpdate={onUpdate} />;
    }

    if (sustainabilityProgramComponents.includes(block.type)) {
      return <SustainabilityProgramEditor block={block} onUpdate={onUpdate} />;
    }

    if (homeComponents.includes(block.type)) {
      return <HomePageEditor block={block} onUpdate={onUpdate} />;
    }

    if (aboutComponents.includes(block.type)) {
      return <AboutPageEditor block={block} onUpdate={onUpdate} />;
    }

    if (contactComponents.includes(block.type)) {
      return <ContactPageEditor block={block} onUpdate={onUpdate} />;
    }

    if (businessComponents.includes(block.type)) {
      return <ForBusinessEditor block={block} onUpdate={onUpdate} />;
    }

    if (customSolutionsComponents.includes(block.type)) {
      return <CustomSolutionsEditor block={block} onUpdate={onUpdate} />;
    }

    if (donationComponents.includes(block.type)) {
      return <DonationEditor block={block} onUpdate={onUpdate} />;
    }

    if (thanksComponents.includes(block.type)) {
      return <ThanksPageEditor block={block} onUpdate={onUpdate} />;
    }

    if (bulkComponents.includes(block.type)) {
      return <BulkEditor block={block} onUpdate={onUpdate} />;
    }

    if (commonComponents.includes(block.type)) {
      return <CommonEditor block={block} onUpdate={onUpdate} />;
    }

    console.warn(`No editor available for block type: ${block.type}`);
    return (
      <div className="p-4 text-center text-gray-500">
        No properties available for this component type
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="font-semibold text-lg">Edit {block.type}</div>
      {getEditor()}
    </div>
  );
};
