
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
    const newContent: BlogPreviewContent = {
      title: updates.title !== undefined ? updates.title.toString() : localContent.title ?? '',
      subtitle: updates.subtitle !== undefined ? updates.subtitle.toString() : localContent.subtitle ?? '',
      buttonText: updates.buttonText !== undefined ? updates.buttonText.toString() : localContent.buttonText ?? '',
      articles: Array.isArray(updates.articles) ? updates.articles : localContent.articles ?? []
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
