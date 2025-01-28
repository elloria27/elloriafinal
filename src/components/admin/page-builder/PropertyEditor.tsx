import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentBlock, BlockContent, FeatureItem, SustainabilityContent, CompetitorComparisonContent, TestimonialsContent, BlogPreviewContent, ContactFAQContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { content } = block;

  const handleChange = async (key: string, value: any) => {
    try {
      setIsSaving(true);
      const updatedContent = { ...content, [key]: value };
      
      // Update the content block in the database
      const { error } = await supabase
        .from('content_blocks')
        .update({ content: updatedContent })
        .eq('id', block.id);

      if (error) throw error;

      // Update the local state through the parent component
      onUpdate(block.id, updatedContent);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const getFAQs = () => {
    if (!content || !('faqs' in content)) {
      return [];
    }
    const contactFAQContent = content as ContactFAQContent;
    return Array.isArray(contactFAQContent.faqs) ? contactFAQContent.faqs : [];
  };

  const renderFields = () => {
    switch (block.type) {
      case "contact_faq":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>FAQs</Label>
              <Button 
                onClick={() => {
                  const currentFaqs = getFAQs();
                  handleChange('faqs', [...currentFaqs, {
                    question: "New Question",
                    answer: "New Answer"
                  }]);
                }}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
            
            {getFAQs().map((faq, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>FAQ {index + 1}</Label>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const newFaqs = [...getFAQs()];
                      newFaqs.splice(index, 1);
                      handleChange('faqs', newFaqs);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Input
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...getFAQs()];
                      newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                      handleChange('faqs', newFaqs);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Answer</Label>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...getFAQs()];
                      newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                      handleChange('faqs', newFaqs);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit {block.type}</h3>
        {isSaving && <span className="text-sm text-gray-500">Saving...</span>}
      </div>
      {renderFields()}
    </div>
  );
};
