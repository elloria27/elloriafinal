
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
    const newContent = { ...localContent, ...updates } as BlogPreviewContent;
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
          value={typeof localContent.buttonText === 'string' ? localContent.buttonText : ""}
          onChange={(e) => handleUpdate({ buttonText: e.target.value })}
          placeholder="Enter button text"
        />
      </div>
    </div>
  );
};
