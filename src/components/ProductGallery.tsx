import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
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
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlaying(false);
    setIsZoomed(false);
  }, [media.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
    setIsZoomed(false);
  }, [media.length]);

  const handlePlayVideo = () => setIsPlaying(true);
  const handleZoomToggle = () => setIsZoomed(!isZoomed);

  const currentMedia = media[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait">
          {isZoomed ? (
            <motion.div
              key="zoomed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomToggle}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
              <img
                src={currentMedia.url}
                alt={`${productName} - Zoomed view`}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            </motion.div>
          ) : (
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              {currentMedia.type === "video" ? (
                isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentMedia.url)}?autoplay=1&rel=0`}
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
                        className="w-20 h-20 rounded-full bg-white/90 hover:bg-white text-primary hover:scale-105 transition-transform"
                      >
                        <Play className="w-10 h-10" />
                      </Button>
                    </motion.div>
                  </>
                )
              ) : (
                <div className="relative h-full">
                  <img 
                    src={currentMedia.url} 
                    alt={`${productName} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover" // Changed from object-contain to object-cover
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomToggle}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                </div>
              )}

              {/* Navigation Arrows */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="rounded-full bg-white/80 hover:bg-white text-gray-800 pointer-events-auto transition-transform hover:scale-105"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="rounded-full bg-white/80 hover:bg-white text-gray-800 pointer-events-auto transition-transform hover:scale-105"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-2 snap-x"
        >
          {media.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
                setIsZoomed(false);
              }}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden snap-start ${
                currentIndex === index 
                  ? "ring-2 ring-primary ring-offset-2" 
                  : "ring-1 ring-gray-200"
              }`}
            >
              <img
                src={item.type === "video" ? item.thumbnail || item.url : item.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-6 h-6 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};