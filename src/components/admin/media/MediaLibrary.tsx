import { FC } from 'react';

interface MediaLibraryProps {
  onSelect: (url: string) => void;
  type?: "image" | "video";
}

export const MediaLibrary: FC<MediaLibraryProps> = ({ onSelect, type = "image" }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Example media items - replace with your actual media library implementation */}
      <div 
        className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center"
        onClick={() => onSelect("/example-image-1.jpg")}
      >
        Image 1
      </div>
      <div 
        className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center"
        onClick={() => onSelect("/example-image-2.jpg")}
      >
        Image 2
      </div>
      <div 
        className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center"
        onClick={() => onSelect("/example-image-3.jpg")}
      >
        Image 3
      </div>
      <div 
        className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center"
        onClick={() => onSelect("/example-image-4.jpg")}
      >
        Image 4
      </div>
    </div>
  );
};