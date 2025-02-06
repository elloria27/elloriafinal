import { useState } from 'react';
import { PageBuilderProps, PageComponent } from '@/types/page-builder';
import { componentRegistry } from './registry';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const PageBuilder = ({ components: initialComponents, onUpdate, isEditing = false }: PageBuilderProps) => {
  const [components, setComponents] = useState<PageComponent[]>(initialComponents);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleAddComponent = (type: string) => {
    const registryItem = componentRegistry.find(item => item.type === type);
    if (!registryItem) {
      toast.error('Component type not found');
      return;
    }

    const newComponent: PageComponent = {
      id: crypto.randomUUID(),
      type,
      content: registryItem.defaultContent,
      order: components.length,
      settings: registryItem.defaultSettings
    };

    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    onUpdate?.(updatedComponents);
    setIsPickerOpen(false);
    toast.success('Component added successfully');
  };

  const handleUpdateComponent = (id: string, content: any) => {
    const updatedComponents = components.map(component => 
      component.id === id ? { ...component, content } : component
    );
    setComponents(updatedComponents);
    onUpdate?.(updatedComponents);
  };

  const handleDeleteComponent = (id: string) => {
    const updatedComponents = components.filter(component => component.id !== id);
    setComponents(updatedComponents);
    onUpdate?.(updatedComponents);
    toast.success('Component removed');
  };

  return (
    <div className="space-y-4">
      {components.map((component) => {
        const Component = componentRegistry.find(item => item.type === component.type)?.component;
        if (!Component) return null;

        return (
          <div key={component.id} className="relative group">
            {isEditing && (
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteComponent(component.id)}
                >
                  Delete
                </Button>
              </div>
            )}
            <Component
              content={component.content}
              settings={component.settings}
              onUpdate={(content: any) => handleUpdateComponent(component.id, content)}
              isEditing={isEditing}
            />
          </div>
        );
      })}

      {isEditing && (
        <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose a Component</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 p-4">
              {componentRegistry.map((item) => (
                <Button
                  key={item.type}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleAddComponent(item.type)}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500 text-center">
                    {item.description}
                  </span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};