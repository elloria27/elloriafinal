import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentBlock, BlockContent, FeatureItem, SustainabilityContent, CompetitorComparisonContent, TestimonialsContent, BlogPreviewContent, ContactFAQContent, AboutMissionContent, AboutSustainabilityContent, AboutTeamContent, AboutCustomerImpactContent, AboutCtaContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: BlockContent) => void;
}

const availableIcons = ["Shrink", "Shield", "Droplets", "Leaf", "Heart", "Sparkles", "Recycle", "Package", "Factory"];

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: any) => {
    console.log('Updating content:', key, value);
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const getContentValue = (key: string): string => {
    if (!content) return '';
    return (content as any)[key]?.toString() || '';
  };

  const getFeatures = (): FeatureItem[] => {
    if (!content || !('features' in content)) {
      return [];
    }

    const features = content.features;
    if (!Array.isArray(features)) {
      return [];
    }

    return features.map(feature => {
      if (typeof feature === 'object' && feature !== null) {
        return {
          icon: String(feature.icon || 'Shield'),
          title: String(feature.title || ''),
          description: String(feature.description || ''),
          detail: String(feature.detail || '')
        };
      }
      return {
        icon: 'Shield',
        title: '',
        description: '',
        detail: ''
      };
    });
  };

  const getCustomerTestimonials = () => {
    if (!content || !('testimonials' in content)) {
      return [];
    }
    const testimonials = (content as AboutCustomerImpactContent).testimonials || [];
    return Array.isArray(testimonials) ? testimonials : [];
  };

  const addTestimonial = () => {
    const testimonials = getCustomerTestimonials();
    handleChange('testimonials', [...testimonials, {
      quote: "New testimonial",
      author: "Customer name",
      location: "Location"
    }]);
  };

  const removeTestimonial = (index: number) => {
    const testimonials = getCustomerTestimonials();
    const newTestimonials = testimonials.filter((_, i) => i !== index);
    handleChange('testimonials', newTestimonials);
  };

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    const testimonials = getCustomerTestimonials();
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    handleChange('testimonials', newTestimonials);
  };

  const getValues = () => {
    if (!content || !('values' in content)) {
      return [];
    }
    const values = (content as AboutMissionContent).values || [];
    return Array.isArray(values) ? values : [];
  };

  const getTimelineItems = () => {
    if (!content || !('timelineItems' in content)) {
      return [];
    }
    const items = (content as SustainabilityContent).timelineItems || [];
    return Array.isArray(items) ? items : [];
  };

  const getMetrics = () => {
    if (!content || !('metrics' in content)) {
      return [];
    }
    const metrics = (content as CompetitorComparisonContent).metrics || [];
    return Array.isArray(metrics) ? metrics : [];
  };

  const getBlogArticles = () => {
    if (!content || !('articles' in content)) {
      return [];
    }
    const articles = (content as BlogPreviewContent).articles || [];
    return Array.isArray(articles) ? articles : [];
  };

  const getFAQs = () => {
    if (!content || !('faqs' in content)) {
      return [];
    }
    const faqs = (content as ContactFAQContent).faqs || [];
    return Array.isArray(faqs) ? faqs : [];
  };

  const handleFeatureChange = (index: number, field: keyof FeatureItem, value: string) => {
    const features = getFeatures();
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleChange('features', newFeatures);
  };

  const addFeature = () => {
    const newFeature: FeatureItem = {
      icon: "Shield",
      title: "New Feature",
      description: "Feature description",
      detail: ""
    };
    
    const features = getFeatures();
    handleChange('features', [...features, newFeature]);
  };

  const removeFeature = (index: number) => {
    const features = getFeatures();
    const newFeatures = features.filter((_, i) => i !== index);
    handleChange('features', newFeatures);
  };

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
      case 'about_hero_section':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={getContentValue('backgroundImage')}
                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                placeholder="Enter background image URL"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={getContentValue('buttonText')}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={getContentValue('buttonLink')}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="Enter button link"
              />
            </div>
          </div>
        );

      case 'about_story':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={getContentValue('content')}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter story content"
                className="min-h-[200px]"
              />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input
                value={getContentValue('videoUrl')}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="Enter video URL"
              />
            </div>
            <div>
              <Label>Video Thumbnail URL</Label>
              <Input
                value={getContentValue('videoThumbnail')}
                onChange={(e) => handleChange('videoThumbnail', e.target.value)}
                placeholder="Enter video thumbnail URL"
              />
            </div>
          </div>
        );

      case 'about_mission':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={getContentValue('description')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Values</Label>
                <Button 
                  onClick={() => {
                    const values = (content as AboutMissionContent).values || [];
                    handleChange('values', [...values, {
                      icon: 'Heart',
                      title: "New Value",
                      description: "Value description"
                    }]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>
              
              {((content as AboutMissionContent).values || []).map((value, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Value {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newValues = [...((content as AboutMissionContent).values || [])];
                        newValues.splice(index, 1);
                        handleChange('values', newValues);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={value.icon}
                      onValueChange={(newValue) => {
                        const newValues = [...((content as AboutMissionContent).values || [])];
                        newValues[index] = { ...newValues[index], icon: newValue as 'Leaf' | 'Star' | 'Heart' };
                        handleChange('values', newValues);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leaf">Leaf</SelectItem>
                        <SelectItem value="Star">Star</SelectItem>
                        <SelectItem value="Heart">Heart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={value.title}
                      onChange={(e) => {
                        const newValues = [...((content as AboutMissionContent).values || [])];
                        newValues[index] = { ...newValues[index], title: e.target.value };
                        handleChange('values', newValues);
                      }}
                      placeholder="Enter value title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={value.description}
                      onChange={(e) => {
                        const newValues = [...((content as AboutMissionContent).values || [])];
                        newValues[index] = { ...newValues[index], description: e.target.value };
                        handleChange('values', newValues);
                      }}
                      placeholder="Enter value description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about_sustainability':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={getContentValue('description')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Stats</Label>
                <Button 
                  onClick={() => {
                    const stats = (content as AboutSustainabilityContent).stats || [];
                    handleChange('stats', [...stats, {
                      icon: 'Leaf',
                      value: "New Stat",
                      label: "Stat Label",
                      description: "Stat description"
                    }]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stat
                </Button>
              </div>
              
              {((content as AboutSustainabilityContent).stats || []).map((stat, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Stat {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newStats = [...((content as AboutSustainabilityContent).stats || [])];
                        newStats.splice(index, 1);
                        handleChange('stats', newStats);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={stat.icon}
                      onValueChange={(newValue) => {
                        const newStats = [...((content as AboutSustainabilityContent).stats || [])];
                        newStats[index] = { ...newStats[index], icon: newValue as 'Leaf' | 'Recycle' | 'TreePine' };
                        handleChange('stats', newStats);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leaf">Leaf</SelectItem>
                        <SelectItem value="Recycle">Recycle</SelectItem>
                        <SelectItem value="TreePine">Tree Pine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...((content as AboutSustainabilityContent).stats || [])];
                        newStats[index] = { ...newStats[index], value: e.target.value };
                        handleChange('stats', newStats);
                      }}
                      placeholder="Enter stat value"
                    />
                  </div>

                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...((content as AboutSustainabilityContent).stats || [])];
                        newStats[index] = { ...newStats[index], label: e.target.value };
                        handleChange('stats', newStats);
                      }}
                      placeholder="Enter stat label"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={stat.description}
                      onChange={(e) => {
                        const newStats = [...((content as AboutSustainabilityContent).stats || [])];
                        newStats[index] = { ...newStats[index], description: e.target.value };
                        handleChange('stats', newStats);
                      }}
                      placeholder="Enter stat description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about_team':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Team Members</Label>
                <Button 
                  onClick={() => {
                    const members = (content as AboutTeamContent).members || [];
                    handleChange('members', [...members, {
                      name: "New Member",
                      role: "Role",
                      image: "",
                      quote: ""
                    }]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
              
              {((content as AboutTeamContent).members || []).map((member, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Member {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newMembers = [...((content as AboutTeamContent).members || [])];
                        newMembers.splice(index, 1);
                        handleChange('members', newMembers);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div>
                    <Label>Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...((content as AboutTeamContent).members || [])];
                        newMembers[index] = { ...newMembers[index], name: e.target.value };
                        handleChange('members', newMembers);
                      }}
                      placeholder="Enter member name"
                    />
                  </div>

                  <div>
                    <Label>Role</Label>
                    <Input
                      value={member.role}
                      onChange={(e) => {
                        const newMembers = [...((content as AboutTeamContent).members || [])];
                        newMembers[index] = { ...newMembers[index], role: e.target.value };
                        handleChange('members', newMembers);
                      }}
                      placeholder="Enter member role"
                    />
                  </div>

                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={member.image}
                      onChange={(e) => {
                        const newMembers = [...((content as AboutTeamContent).members || [])];
                        newMembers[index] = { ...newMembers[index], image: e.target.value };
                        handleChange('members', newMembers);
                      }}
                      placeholder="Enter member image URL"
                    />
                  </div>

                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={member.quote}
                      onChange={(e) => {
                        const newMembers = [...((content as AboutTeamContent).members || [])];
                        newMembers[index] = { ...newMembers[index], quote: e.target.value };
                        handleChange('members', newMembers);
                      }}
                      placeholder="Enter member quote"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about_customer_impact':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={getContentValue('description')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Stats</Label>
                <Button 
                  onClick={() => {
                    const stats = (content as AboutCustomerImpactContent).stats || [];
                    handleChange('stats', [...stats, {
                      value: "New Stat",
                      label: "Stat Label"
                    }]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stat
                </Button>
              </div>
              
              {((content as AboutCustomerImpactContent).stats || []).map((stat, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Stat {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newStats = [...((content as AboutCustomerImpactContent).stats || [])];
                        newStats.splice(index, 1);
                        handleChange('stats', newStats);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...((content as AboutCustomerImpactContent).stats || [])];
                        newStats[index] = { ...newStats[index], value: e.target.value };
                        handleChange('stats', newStats);
                      }}
                      placeholder="Enter stat value"
                    />
                  </div>

                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...((content as AboutCustomerImpactContent).stats || [])];
                        newStats[index] = { ...newStats[index], label: e.target.value };
                        handleChange('stats', newStats);
                      }}
                      placeholder="Enter stat label"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Testimonials</Label>
                <Button 
                  onClick={() => {
                    const testimonials = (content as AboutCustomerImpactContent).testimonials || [];
                    handleChange('testimonials', [...testimonials, {
                      quote: "New Testimonial",
                      author: "Customer Name",
                      role: "Customer Role",
                      rating: 5
                    }]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
              
              {((content as AboutCustomerImpactContent).testimonials || []).map((testimonial, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Testimonial {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newTestimonials = [...((content as AboutCustomerImpactContent).testimonials || [])];
                        newTestimonials.splice(index, 1);
                        handleChange('testimonials', newTestimonials);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => {
                        const newTestimonials = [...((content as AboutCustomerImpactContent).testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], quote: e.target.value };
                        handleChange('testimonials', newTestimonials);
                      }}
                      placeholder="Enter testimonial quote"
                    />
                  </div>

                  <div>
                    <Label>Author</Label>
                    <Input
                      value={testimonial.author}
                      onChange={(e) => {
                        const newTestimonials = [...((content as AboutCustomerImpactContent).testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], author: e.target.value };
                        handleChange('testimonials', newTestimonials);
                      }}
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <Label>Role</Label>
                    <Input
                      value={testimonial.role}
                      onChange={(e) => {
                        const newTestimonials = [...((content as AboutCustomerImpactContent).testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], role: e.target.value };
                        handleChange('testimonials', newTestimonials);
                      }}
                      placeholder="Enter author role"
                    />
                  </div>

                  <div>
                    <Label>Rating (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => {
                        const newTestimonials = [...((content as AboutCustomerImpactContent).testimonials || [])];
                        newTestimonials[index] = { ...newTestimonials[index], rating: parseInt(e.target.value) || 5 };
                        handleChange('testimonials', newTestimonials);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about_cta':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter CTA title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter CTA subtitle"
              />
            </div>
            <div>
              <Label>Primary Button Text</Label>
              <Input
                value={getContentValue('primaryButtonText')}
                onChange={(e) => handleChange('primaryButtonText', e.target.value)}
                placeholder="Enter primary button text"
              />
            </div>
            <div>
              <Label>Primary Button Link</Label>
              <Input
                value={getContentValue('primaryButtonLink')}
                onChange={(e) => handleChange('primaryButtonLink', e.target.value)}
                placeholder="Enter primary button link"
              />
            </div>
            <div>
              <Label>Secondary Button Text</Label>
              <Input
                value={getContentValue('secondaryButtonText')}
                onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
                placeholder="Enter secondary button text"
              />
            </div>
            <div>
              <Label>Secondary Button Link</Label>
              <Input
                value={getContentValue('secondaryButtonLink')}
                onChange={(e) => handleChange('secondaryButtonLink', e.target.value)}
                placeholder="Enter secondary button link"
              />
            </div>
            <div>
              <Label>Background Gradient</Label>
              <Input
                value={getContentValue('backgroundGradient')}
                onChange={(e) => handleChange('backgroundGradient', e.target.value)}
                placeholder="Enter background gradient"
              />
            </div>
          </div>
        );

      // ... keep existing code (other cases)
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Edit {block.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </h3>
      {renderFields()}
    </div>
  );
};
