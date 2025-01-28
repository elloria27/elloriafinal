import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentBlock, BlockContent, ContactHeroContent, ContactDetailsContent, ContactFormContent, ContactFAQContent, ContactBusinessContent } from "@/types/content-blocks";
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
      console.log('Saving changes for block:', block.id, 'key:', key, 'value:', value);
      setIsSaving(true);
      const updatedContent = { ...content, [key]: value };
      
      const { error } = await supabase
        .from('content_blocks')
        .update({ content: updatedContent })
        .eq('id', block.id);

      if (error) throw error;

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
    const faqContent = content as ContactFAQContent;
    return Array.isArray(faqContent.faqs) ? faqContent.faqs : [];
  };

  const renderFields = () => {
    switch (block.type) {
      case "contact_hero":
        const heroContent = content as ContactHeroContent;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={String(heroContent.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={String(heroContent.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
          </div>
        );

      case "contact_details":
        const detailsContent = content as ContactDetailsContent;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={String(detailsContent.address || '')}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter address"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={String(detailsContent.phone || '')}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={String(detailsContent.email || '')}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>
        );

      case "contact_form":
        const formContent = content as ContactFormContent;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Form Title</Label>
              <Input
                value={String(formContent.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter form title"
              />
            </div>
            <div className="space-y-2">
              <Label>Form Description</Label>
              <Textarea
                value={String(formContent.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter form description"
              />
            </div>
            <div className="space-y-2">
              <Label>Submit Button Text</Label>
              <Input
                value={String(formContent.submitButtonText || '')}
                onChange={(e) => handleChange('submitButtonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </div>
        );

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
                    value={String(faq.question)}
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
                    value={String(faq.answer)}
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

      case "contact_business":
        const businessContent = content as ContactBusinessContent;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={String(businessContent.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter business section title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={String(businessContent.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter business section description"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={String(businessContent.email || '')}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter business email"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={String(businessContent.buttonText || '')}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input
                value={String(businessContent.buttonLink || '')}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="Enter button link"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit {block.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
        {isSaving && <span className="text-sm text-gray-500">Saving...</span>}
      </div>
      {renderFields()}
    </div>
  );
};