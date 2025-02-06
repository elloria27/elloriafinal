import { ComponentRegistryItem } from '@/types/page-builder';
import { Type, Image, FileText } from 'lucide-react';

export const componentRegistry: ComponentRegistryItem[] = [
  {
    type: 'text',
    name: 'Text Block',
    description: 'A simple text block with formatting options',
    icon: <Type className="w-4 h-4" />,
    component: ({ content }) => <div>{content.text}</div>,
    defaultContent: { text: 'Enter your text here' }
  },
  {
    type: 'image',
    name: 'Image',
    description: 'Add an image with caption',
    icon: <Image className="w-4 h-4" />,
    component: ({ content }) => (
      <figure>
        <img src={content.url} alt={content.alt} className="w-full h-auto" />
        {content.caption && (
          <figcaption className="text-sm text-gray-500 mt-2">{content.caption}</figcaption>
        )}
      </figure>
    ),
    defaultContent: {
      url: '',
      alt: '',
      caption: ''
    }
  },
  {
    type: 'rich-text',
    name: 'Rich Text Editor',
    description: 'Advanced text editor with formatting',
    icon: <FileText className="w-4 h-4" />,
    component: ({ content }) => <div dangerouslySetInnerHTML={{ __html: content.html }} />,
    defaultContent: { html: '' }
  }
];