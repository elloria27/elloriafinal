
import { BlockContent, ContentBlock, NewsletterContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface NewsletterEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const NewsletterEditor = ({ block, onUpdate }: NewsletterEditorProps) => {
  const content = block.content as NewsletterContent;
  const [localContent, setLocalContent] = useState(content);

  const handleUpdate = (updates: Partial<NewsletterContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onUpdate(block.id, newContent);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={localContent.title || ""}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Enter section title"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Subtitle</label>
        <Input
          value={localContent.subtitle || ""}
          onChange={(e) => handleUpdate({ subtitle: e.target.value })}
          placeholder="Enter section subtitle"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Button Text</label>
        <Input
          value={localContent.buttonText || ""}
          onChange={(e) => handleUpdate({ buttonText: e.target.value })}
          placeholder="Enter button text"
        />
      </div>
    </div>
  );
};
