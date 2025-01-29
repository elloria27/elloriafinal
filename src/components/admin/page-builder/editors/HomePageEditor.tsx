import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { BlockContent } from "@/types/content-blocks";

interface EditorProps {
  block: {
    id: string;
    type: string;
    content: BlockContent;
  };
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: EditorProps) => {
  const handleChange = (content: any) => {
    onUpdate(block.id, content);
  };

  const handleArrayItemChange = (
    key: string,
    index: number,
    field: string,
    value: string
  ) => {
    const items = [...(block.content[key] || [])];
    items[index] = { ...items[index], [field]: value };
    handleChange({ ...block.content, [key]: items });
  };

  const handleAddArrayItem = (key: string, defaultItem: any) => {
    const items = [...(block.content[key] || []), defaultItem];
    handleChange({ ...block.content, [key]: items });
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    const items = [...(block.content[key] || [])];
    items.splice(index, 1);
    handleChange({ ...block.content, [key]: items });
  };

  switch (block.type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ''}
              onChange={(e) => handleChange({ ...block.content, subtitle: e.target.value })}
            />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input
              value={block.content.videoUrl || ''}
              onChange={(e) => handleChange({ ...block.content, videoUrl: e.target.value })}
            />
          </div>
        </div>
      );

    case 'features':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ''}
              onChange={(e) => handleChange({ ...block.content, subtitle: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ''}
              onChange={(e) => handleChange({ ...block.content, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Features</Label>
            {(block.content.features || []).map((feature: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Feature {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArrayItem('features', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Icon"
                  value={feature.icon || ''}
                  onChange={(e) => handleArrayItemChange('features', index, 'icon', e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={feature.title || ''}
                  onChange={(e) => handleArrayItemChange('features', index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={feature.description || ''}
                  onChange={(e) => handleArrayItemChange('features', index, 'description', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddArrayItem('features', {
                icon: '',
                title: '',
                description: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>
      );

    case 'game_changer':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ''}
              onChange={(e) => handleChange({ ...block.content, subtitle: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ''}
              onChange={(e) => handleChange({ ...block.content, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Features</Label>
            {(block.content.features || []).map((feature: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Feature {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArrayItem('features', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Icon"
                  value={feature.icon || ''}
                  onChange={(e) => handleArrayItemChange('features', index, 'icon', e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={feature.title || ''}
                  onChange={(e) => handleArrayItemChange('features', index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={feature.description || ''}
                  onChange={(e) => handleArrayItemChange('features', index, 'description', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddArrayItem('features', {
                icon: '',
                title: '',
                description: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>
      );

    case 'store_brands':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ''}
              onChange={(e) => handleChange({ ...block.content, subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Brands</Label>
            {(block.content.brands || []).map((brand: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Brand {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArrayItem('brands', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Name"
                  value={brand.name || ''}
                  onChange={(e) => handleArrayItemChange('brands', index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Logo URL"
                  value={brand.logo || ''}
                  onChange={(e) => handleArrayItemChange('brands', index, 'logo', e.target.value)}
                />
                <Input
                  placeholder="Link"
                  value={brand.link || ''}
                  onChange={(e) => handleArrayItemChange('brands', index, 'link', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddArrayItem('brands', {
                name: '',
                logo: '',
                link: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </div>
        </div>
      );

    case 'sustainability_hero':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ''}
              onChange={(e) => handleChange({ ...block.content, subtitle: e.target.value })}
            />
          </div>
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={block.content.backgroundImage || ''}
              onChange={(e) => handleChange({ ...block.content, backgroundImage: e.target.value })}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText || ''}
              onChange={(e) => handleChange({ ...block.content, buttonText: e.target.value })}
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={block.content.buttonLink || ''}
              onChange={(e) => handleChange({ ...block.content, buttonLink: e.target.value })}
            />
          </div>
        </div>
      );

    case 'sustainability_mission':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ''}
              onChange={(e) => handleChange({ ...block.content, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Stats</Label>
            {(block.content.stats || []).map((stat: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Stat {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArrayItem('stats', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Icon"
                  value={stat.icon || ''}
                  onChange={(e) => handleArrayItemChange('stats', index, 'icon', e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={stat.value || ''}
                  onChange={(e) => handleArrayItemChange('stats', index, 'value', e.target.value)}
                />
                <Input
                  placeholder="Label"
                  value={stat.label || ''}
                  onChange={(e) => handleArrayItemChange('stats', index, 'label', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={stat.description || ''}
                  onChange={(e) => handleArrayItemChange('stats', index, 'description', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddArrayItem('stats', {
                icon: '',
                value: '',
                label: '',
                description: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
        </div>
      );

    case 'sustainability_materials':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ''}
              onChange={(e) => handleChange({ ...block.content, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Materials</Label>
            {(block.content.materials || []).map((material: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Material {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArrayItem('materials', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Icon"
                  value={material.icon || ''}
                  onChange={(e) => handleArrayItemChange('materials', index, 'icon', e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={material.title || ''}
                  onChange={(e) => handleArrayItemChange('materials', index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={material.description || ''}
                  onChange={(e) => handleArrayItemChange('materials', index, 'description', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddArrayItem('materials', {
                icon: '',
                title: '',
                description: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>
      );

    case 'sustainability_faq':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ''}
              onChange={(e) => handleChange({ ...block.content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ''}
              onChange={(e) => handleChange({ ...block.content, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>FAQs</Label>
            {(block.content.faqs || []).map((faq: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>FAQ {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveArrayItem('faqs', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Question"
                  value={faq.question || ''}
                  onChange={(e) => handleArrayItemChange('faqs', index, 'question', e.target.value)}
                />
                <Textarea
                  placeholder="Answer"
                  value={faq.answer || ''}
                  onChange={(e) => handleArrayItemChange('faqs', index, 'answer', e.target.value)}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => handleAddArrayItem('faqs', {
                question: '',
                answer: ''
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
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