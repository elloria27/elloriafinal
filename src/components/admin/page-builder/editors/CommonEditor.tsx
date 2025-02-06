import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommonEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const CommonEditor = ({ block, onUpdate }: CommonEditorProps) => {
  const handleChange = (field: string, value: string | number) => {
    const updatedContent = { ...block.content, [field]: value };
    onUpdate(block.id, updatedContent);
  };

  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-4">
          <div>
            <Label>Text</Label>
            <Input
              value={block.content.text as string || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div>
            <Label>Size</Label>
            <Select
              value={block.content.size as string || "h2"}
              onValueChange={(value) => handleChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select heading size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <Label>Text</Label>
            <Textarea
              value={block.content.text as string || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <div>
            <Label>Image URL</Label>
            <Input
              value={block.content.url as string || ""}
              onChange={(e) => handleChange("url", e.target.value)}
            />
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={block.content.alt as string || ""}
              onChange={(e) => handleChange("alt", e.target.value)}
            />
          </div>
        </div>
      );

    case "video":
      return (
        <div className="space-y-4">
          <div>
            <Label>Video URL</Label>
            <Input
              value={block.content.url as string || ""}
              onChange={(e) => handleChange("url", e.target.value)}
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
        </div>
      );

    case "button":
      return (
        <div className="space-y-4">
          <div>
            <Label>Text</Label>
            <Input
              value={block.content.text as string || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div>
            <Label>URL</Label>
            <Input
              value={block.content.url as string || ""}
              onChange={(e) => handleChange("url", e.target.value)}
            />
          </div>
          <div>
            <Label>Variant</Label>
            <Select
              value={block.content.variant as string || "default"}
              onValueChange={(value) => handleChange("variant", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select button variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-4">
          <div>
            <Label>Height (e.g., "32px" or "2rem")</Label>
            <Input
              value={block.content.height as string || "32px"}
              onChange={(e) => handleChange("height", e.target.value)}
              placeholder="32px"
            />
          </div>
          <div>
            <Label>Indentation (e.g., "16px" or "1rem")</Label>
            <Input
              value={block.content.indent as string || "0px"}
              onChange={(e) => handleChange("indent", e.target.value)}
              placeholder="0px"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 text-center text-gray-500">
          No properties available for this component type
        </div>
      );
  }
};