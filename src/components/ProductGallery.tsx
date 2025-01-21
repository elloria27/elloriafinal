import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Media {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

interface ProductGalleryProps {
  media: Media[];
  productName: string;
}

const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const ProductGallery = ({ media, productName }: ProductGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
      {currentMedia.type === "video" ? (
        <div className="relative w-full h-full">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentMedia.url)}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <>
              <img
                src={currentMedia.thumbnail}
                alt={`${productName} video thumbnail`}
                className="w-full h-full object-cover"
              />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/30"
              >
                <Button
                  onClick={handlePlayVideo}
                  className="w-16 h-16 rounded-full bg-white hover:bg-white/90 text-primary"
                >
                  <Play className="w-8 h-8" />
                </Button>
              </motion.div>
            </>
          )}
        </div>
      ) : (
        <img 
          src={currentMedia.url} 
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      )}

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="rounded-full bg-white/80 hover:bg-white text-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="rounded-full bg-white/80 hover:bg-white text-gray-800"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 inset-x-4">
        <div className="flex gap-2 justify-center">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={item.type === "video" ? item.thumbnail || item.url : item.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};