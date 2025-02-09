
import { useState } from 'react';
import { ContentBlock } from '@/types/content-blocks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CertificatesBlockEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const CertificatesBlockEditor = ({ block, onUpdate }: CertificatesBlockEditorProps) => {
  const [title, setTitle] = useState(block.content.title || '');
  const [description, setDescription] = useState(block.content.description || '');

  const handleUpdate = (field: string, value: string) => {
    const updatedContent = {
      ...block.content,
      [field]: value
    };
    onUpdate(block.id, updatedContent);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleUpdate('title', e.target.value);
          }}
          placeholder="Enter section title"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleUpdate('description', e.target.value);
          }}
          placeholder="Enter section description"
        />
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Note: Certificates are managed in the Certificates section of the admin panel.
          This block will display all active certificates.
        </p>
      </div>
    </div>
  );
};
