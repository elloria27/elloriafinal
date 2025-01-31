import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { HomePageEditor } from "./editors/HomePageEditor";
import { AboutPageEditor } from "./editors/AboutPageEditor";
import { ContactPageEditor } from "./editors/ContactPageEditor";
import { CommonEditor } from "./editors/CommonEditor";
import { SustainabilityEditor } from "./editors/SustainabilityEditor";

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
    "product_carousel",
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
    "sustainability_initiatives",
    "sustainability_impact",
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
    if (homeComponents.includes(block.type)) {
      return <HomePageEditor block={block} onUpdate={onUpdate} />;
    }

    if (aboutComponents.includes(block.type)) {
      return <AboutPageEditor block={block} onUpdate={onUpdate} />;
    }

    if (contactComponents.includes(block.type)) {
      return <ContactPageEditor block={block} onUpdate={onUpdate} />;
    }

    if (sustainabilityComponents.includes(block.type)) {
      return <SustainabilityEditor block={block} onUpdate={onUpdate} />;
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