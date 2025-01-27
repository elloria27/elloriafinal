import { MediaLibrary } from "@/components/admin/media/MediaLibrary";

const Media = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Media Library</h1>
      <MediaLibrary />
    </div>
  );
};

export default Media;