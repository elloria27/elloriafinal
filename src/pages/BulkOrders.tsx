import { Features } from "@/components/Features";
import { BulkOrdersContent } from "@/types/content-blocks";

interface BulkOrdersProps {
  content: BulkOrdersContent;
}

const BulkOrders = ({ content }: BulkOrdersProps) => {
  return (
    <div>
      <h1 className="text-4xl font-bold">{content.title || "Bulk Orders"}</h1>
      <p className="text-lg">{content.description || "Learn more about our bulk order options."}</p>

      <Features 
        features={content.features}
        title={content.title}
        subtitle={content.subtitle}
        description={content.description}
      />
    </div>
  );
};

export default BulkOrders;
