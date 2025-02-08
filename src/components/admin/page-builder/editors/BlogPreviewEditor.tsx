
import { BlockContent, ContentBlock, BlogPreviewContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface BlogPreviewEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const BlogPreviewEditor = ({ block, onUpdate }: BlogPreviewEditorProps) => {
  const content = block.content as BlogPreviewContent;
  const [localContent, setLocalContent] = useState<BlogPreviewContent>(content);

  const handleUpdate = (updates: Partial<BlogPreviewContent>) => {
    // Create a new content object with only the valid properties
    const newContent = {
      ...localContent,
      title: typeof updates.title === 'string' ? updates.title : localContent.title,
      subtitle: typeof updates.subtitle === 'string' ? updates.subtitle : localContent.subtitle,
      buttonText: typeof updates.buttonText === 'string' ? updates.buttonText : localContent.buttonText,
      articles: Array.isArray(updates.articles) ? updates.articles : localContent.articles,
    };
    
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
