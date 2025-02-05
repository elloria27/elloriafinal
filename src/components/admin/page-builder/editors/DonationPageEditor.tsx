import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { ContentBlock, BlockContent, DonationHeroContent, DonationFormContent, DonationImpactContent, DonationStoriesContent, DonationPartnersContent, DonationFAQContent, DonationJoinMovementContent } from "@/types/content-blocks";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";

interface DonationPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const DonationPageEditor = ({ block, onUpdate }: DonationPageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string>("");

  const handleImageSelect = (url: string) => {
    const updatedContent = { ...block.content };
    if (currentImageField === "backgroundImage") {
      updatedContent.backgroundImage = url;
    } else if (currentImageField.startsWith("story_")) {
      const index = parseInt(currentImageField.split("_")[1]);
      const stories = [...(updatedContent.stories || [])];
      stories[index] = { ...stories[index], image: url };
      updatedContent.stories = stories;
    }
    onUpdate(block.id, updatedContent);
    setShowMediaLibrary(false);
  };

  const openMediaLibrary = (field: string) => {
    setCurrentImageField(field);
    setShowMediaLibrary(true);
  };

  switch (block.type) {
    case "donation_hero":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as DonationHeroContent).title || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content as DonationHeroContent).subtitle || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="flex gap-2">
              <Input
                value={(block.content as DonationHeroContent).backgroundImage || ""}
                readOnly
                placeholder="Select an image..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => openMediaLibrary("backgroundImage")}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={(block.content as DonationHeroContent).buttonText || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, buttonText: e.target.value })
              }
            />
          </div>
        </div>
      );

    case "donation_form":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as DonationFormContent).title || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content as DonationFormContent).subtitle || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Default Amounts (comma-separated)</Label>
            <Input
              value={(block.content as DonationFormContent).defaultAmounts?.join(", ") || ""}
              onChange={(e) =>
                onUpdate(block.id, {
                  ...block.content,
                  defaultAmounts: e.target.value.split(",").map((v) => v.trim()),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={(block.content as DonationFormContent).buttonText || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, buttonText: e.target.value })
              }
            />
          </div>
        </div>
      );

    case "donation_impact":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as DonationImpactContent).title || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content as DonationImpactContent).subtitle || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Impact Items</Label>
            <div className="space-y-4">
              {(block.content as DonationImpactContent).impacts?.map((impact, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <Input
                    placeholder="Icon name"
                    value={impact.icon}
                    onChange={(e) => {
                      const impacts = [...(block.content.impacts || [])];
                      impacts[index] = { ...impact, icon: e.target.value };
                      onUpdate(block.id, { ...block.content, impacts });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={impact.title}
                    onChange={(e) => {
                      const impacts = [...(block.content.impacts || [])];
                      impacts[index] = { ...impact, title: e.target.value };
                      onUpdate(block.id, { ...block.content, impacts });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={impact.description}
                    onChange={(e) => {
                      const impacts = [...(block.content.impacts || [])];
                      impacts[index] = { ...impact, description: e.target.value };
                      onUpdate(block.id, { ...block.content, impacts });
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const impacts = [...(block.content.impacts || [])];
                      impacts.splice(index, 1);
                      onUpdate(block.id, { ...block.content, impacts });
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Impact
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const impacts = [...(block.content.impacts || [])];
                  impacts.push({ icon: "", title: "", description: "" });
                  onUpdate(block.id, { ...block.content, impacts });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Impact
              </Button>
            </div>
          </div>
        </div>
      );

    case "donation_stories":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as DonationStoriesContent).title || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content as DonationStoriesContent).subtitle || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Stories</Label>
            <div className="space-y-4">
              {(block.content as DonationStoriesContent).stories?.map((story, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <Input
                    placeholder="Name"
                    value={story.name}
                    onChange={(e) => {
                      const stories = [...(block.content.stories || [])];
                      stories[index] = { ...story, name: e.target.value };
                      onUpdate(block.id, { ...block.content, stories });
                    }}
                  />
                  <Input
                    placeholder="Role"
                    value={story.role}
                    onChange={(e) => {
                      const stories = [...(block.content.stories || [])];
                      stories[index] = { ...story, role: e.target.value };
                      onUpdate(block.id, { ...block.content, stories });
                    }}
                  />
                  <Textarea
                    placeholder="Quote"
                    value={story.quote}
                    onChange={(e) => {
                      const stories = [...(block.content.stories || [])];
                      stories[index] = { ...story, quote: e.target.value };
                      onUpdate(block.id, { ...block.content, stories });
                    }}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      value={story.image || ""}
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openMediaLibrary(`story_${index}`)}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const stories = [...(block.content.stories || [])];
                      stories.splice(index, 1);
                      onUpdate(block.id, { ...block.content, stories });
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Story
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const stories = [...(block.content.stories || [])];
                  stories.push({ name: "", role: "", quote: "", image: "" });
                  onUpdate(block.id, { ...block.content, stories });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Story
              </Button>
            </div>
          </div>
        </div>
      );

    case "donation_partners":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as DonationPartnersContent).title || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content as DonationPartnersContent).subtitle || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Partners (one per line)</Label>
            <Textarea
              value={(block.content as DonationPartnersContent).partners?.join("\n") || ""}
              onChange={(e) =>
                onUpdate(block.id, {
                  ...block.content,
                  partners: e.target.value.split("\n").filter(Boolean),
                })
              }
            />
          </div>
        </div>
      );

    case "donation_faq":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as DonationFAQContent).title || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content as DonationFAQContent).subtitle || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>FAQs</Label>
            <div className="space-y-4">
              {(block.content as DonationFAQContent).faqs?.map((faq, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const faqs = [...(block.content.faqs || [])];
                      faqs[index] = { ...faq, question: e.target.value };
                      onUpdate(block.id, { ...block.content, faqs });
                    }}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const faqs = [...(block.content.faqs || [])];
                      faqs[index] = { ...faq, answer: e.target.value };
                      onUpdate(block.id, { ...block.content, faqs });
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const faqs = [...(block.content.faqs || [])];
                      faqs.splice(index, 1);
                      onUpdate(block.id, { ...block.content, faqs });
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove FAQ
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const faqs = [...(block.content.faqs || [])];
                  faqs.push({ question: "", answer: "" });
                  onUpdate(block.id, { ...block.content, faqs });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </div>
        </div>
      );

    case "donation_join_movement":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as DonationJoinMovementContent).title || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content as DonationJoinMovementContent).subtitle || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, subtitle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={(block.content as DonationJoinMovementContent).buttonText || ""}
              onChange={(e) =>
                onUpdate(block.id, { ...block.content, buttonText: e.target.value })
              }
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
