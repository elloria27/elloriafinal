import { ContentBlock, BlockContent, DonationHeroContent, DonationImpactContent, DonationStoriesContent, DonationPartnersContent, DonationFAQContent, DonationJoinMovementContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DonationEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const DonationEditor = ({ block, onUpdate }: DonationEditorProps) => {
  const handleUpdate = (updates: Partial<BlockContent>) => {
    onUpdate(block.id, { ...block.content, ...updates });
  };

  const handleArrayUpdate = (
    field: string,
    index: number,
    updates: Record<string, any>
  ) => {
    const array = [...((block.content[field] as any[]) || [])];
    array[index] = { ...array[index], ...updates };
    handleUpdate({ [field]: array });
  };

  const handleAddItem = (field: string, defaultItem: any) => {
    const array = [...((block.content[field] as any[]) || [])];
    array.push(defaultItem);
    handleUpdate({ [field]: array });
  };

  const handleRemoveItem = (field: string, index: number) => {
    const array = [...((block.content[field] as any[]) || [])];
    array.splice(index, 1);
    handleUpdate({ [field]: array });
  };

  switch (block.type) {
    case "donation_hero":
      const heroContent = block.content as DonationHeroContent;
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={heroContent.title || ""}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={heroContent.subtitle || ""}
              onChange={(e) => handleUpdate({ subtitle: e.target.value })}
            />
          </div>
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={heroContent.backgroundImage || ""}
              onChange={(e) => handleUpdate({ backgroundImage: e.target.value })}
            />
          </div>
        </div>
      );

    case "donation_impact":
      const impactContent = block.content as DonationImpactContent;
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={impactContent.title || ""}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={impactContent.description || ""}
              onChange={(e) => handleUpdate({ description: e.target.value })}
            />
          </div>
          <div>
            <Label>Impact Items</Label>
            {(impactContent.impacts || []).map((impact, index) => (
              <div key={index} className="space-y-2 mt-2 p-4 border rounded-lg">
                <Input
                  placeholder="Icon"
                  value={impact.icon}
                  onChange={(e) =>
                    handleArrayUpdate("impacts", index, { icon: e.target.value })
                  }
                />
                <Input
                  placeholder="Title"
                  value={impact.title}
                  onChange={(e) =>
                    handleArrayUpdate("impacts", index, { title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={impact.description}
                  onChange={(e) =>
                    handleArrayUpdate("impacts", index, {
                      description: e.target.value,
                    })
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem("impacts", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleAddItem("impacts", {
                  icon: "",
                  title: "",
                  description: "",
                })
              }
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Impact
            </Button>
          </div>
        </div>
      );

    case "donation_stories":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleUpdate({ description: e.target.value })}
            />
          </div>
          <div>
            <Label>Stories</Label>
            {(block.content.stories || []).map((story, index) => (
              <div key={index} className="space-y-2 mt-2 p-4 border rounded-lg">
                <Input
                  placeholder="Name"
                  value={story.name}
                  onChange={(e) =>
                    handleArrayUpdate("stories", index, { name: e.target.value })
                  }
                />
                <Input
                  placeholder="Role"
                  value={story.role}
                  onChange={(e) =>
                    handleArrayUpdate("stories", index, { role: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Quote"
                  value={story.quote}
                  onChange={(e) =>
                    handleArrayUpdate("stories", index, { quote: e.target.value })
                  }
                />
                <Input
                  placeholder="Image URL"
                  value={story.image}
                  onChange={(e) =>
                    handleArrayUpdate("stories", index, { image: e.target.value })
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem("stories", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleAddItem("stories", {
                  name: "",
                  role: "",
                  quote: "",
                  image: "",
                })
              }
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Story
            </Button>
          </div>
        </div>
      );

    case "donation_partners":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleUpdate({ description: e.target.value })}
            />
          </div>
          <div>
            <Label>Partners</Label>
            {(block.content.partners || []).map((partner, index) => (
              <div key={index} className="space-y-2 mt-2 p-4 border rounded-lg">
                <Input
                  placeholder="Partner Name"
                  value={partner.name}
                  onChange={(e) =>
                    handleArrayUpdate("partners", index, { name: e.target.value })
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem("partners", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddItem("partners", { name: "" })}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Partner
            </Button>
          </div>
        </div>
      );

    case "donation_faq":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleUpdate({ description: e.target.value })}
            />
          </div>
          <div>
            <Label>FAQs</Label>
            {(block.content.faqs || []).map((faq, index) => (
              <div key={index} className="space-y-2 mt-2 p-4 border rounded-lg">
                <Input
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) =>
                    handleArrayUpdate("faqs", index, { question: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) =>
                    handleArrayUpdate("faqs", index, { answer: e.target.value })
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem("faqs", index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleAddItem("faqs", { question: "", answer: "" })
              }
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add FAQ
            </Button>
          </div>
        </div>
      );

    case "donation_join_movement":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleUpdate({ description: e.target.value })}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText || ""}
              onChange={(e) => handleUpdate({ buttonText: e.target.value })}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
