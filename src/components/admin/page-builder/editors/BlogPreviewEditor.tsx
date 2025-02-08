
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

  const handleArticleUpdate = (index: number, field: keyof typeof localContent.articles[0], value: string) => {
    const newArticles = [...(localContent.articles || [])];
    if (!newArticles[index]) {
      newArticles[index] = { title: "", category: "", image: "" };
    }
    newArticles[index] = { ...newArticles[index], [field]: value };
    handleUpdate({ articles: newArticles });
  };

  const addArticle = () => {
    const newArticles = [...(localContent.articles || []), { title: "", category: "", image: "" }];
    handleUpdate({ articles: newArticles });
  };

  const removeArticle = (index: number) => {
    const newArticles = [...(localContent.articles || [])];
    newArticles.splice(index, 1);
    handleUpdate({ articles: newArticles });
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Articles</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addArticle}
          >
            Add Article
          </Button>
        </div>
        
        {(localContent.articles || []).map((article, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={article.title}
                onChange={(e) => handleArticleUpdate(index, "title", e.target.value)}
                placeholder="Enter article title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={article.category}
                onChange={(e) => handleArticleUpdate(index, "category", e.target.value)}
                placeholder="Enter article category"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={article.image}
                onChange={(e) => handleArticleUpdate(index, "image", e.target.value)}
                placeholder="Enter article image URL"
              />
            </div>
            <Button 
              type="button" 
              variant="destructive" 
              size="sm"
              onClick={() => removeArticle(index)}
            >
              Remove Article
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
