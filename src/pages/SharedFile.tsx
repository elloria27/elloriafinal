import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SharedFile() {
  const { token } = useParams();
  const [fileData, setFileData] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedFile = async () => {
      try {
        console.log('Loading shared file with token:', token);
        
        const { data: shareData, error: shareError } = await supabase
          .from('file_shares')
          .select('*')
          .eq('share_token', token)
          .single();

        if (shareError) {
          console.error('Error fetching share data:', shareError);
          toast.error("Failed to load shared file");
          return;
        }

        if (!shareData) {
          toast.error("Share link not found or expired");
          return;
        }

        setFileData(shareData);
        
        const { data: file, error: downloadError } = await supabase.storage
          .from('files')
          .download(shareData.file_path);

        if (downloadError) {
          console.error('Error downloading file:', downloadError);
          toast.error("Failed to load file");
          return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setFileType(file.type);
        console.log('File loaded successfully. Type:', file.type);

      } catch (error) {
        console.error('Error in loadSharedFile:', error);
        toast.error("An error occurred while loading the file");
      } finally {
        setLoading(false);
      }
    };

    loadSharedFile();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [token]);

  const handleDownload = async () => {
    if (!fileData || !previewUrl) return;
    
    try {
      if (fileData.access_level === 'view') {
        toast.error("Download not allowed for this share");
        return;
      }

      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = fileData.file_path.split('/').pop() || 'downloaded-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("File download started");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download file");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully with', numPages, 'pages');
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setPdfError(error.message);
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!previewUrl || !fileType) {
      return (
        <div className="text-center py-8 text-gray-500">
          File preview not available
        </div>
      );
    }

    console.log('Rendering preview for file type:', fileType);

    // Handle PDF files
    if (fileType === 'application/pdf' || fileType === 'pdf' || fileData.file_path.toLowerCase().endsWith('.pdf')) {
      console.log('Rendering PDF preview');
      return (
        <div className="max-w-4xl mx-auto overflow-x-auto pdf-container">
          <Document
            file={previewUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
            error={
              <div className="text-center py-4 text-red-500">
                {pdfError || "Failed to load PDF. Please try downloading the file instead."}
              </div>
            }
          >
            {numPages && Array.from(new Array(numPages), (el, index) => (
              <Page 
                key={`page_${index + 1}`} 
                pageNumber={index + 1}
                className="mb-4 shadow-lg"
                width={Math.min(window.innerWidth - 48, 800)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                }
              />
            ))}
          </Document>
        </div>
      );
    }

    // Handle images
    if (fileType.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt="Shared file preview"
          className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg shadow-lg"
        />
      );
    }

    // Handle videos
    if (fileType.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[70vh] w-full rounded-lg shadow-lg">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Handle audio
    if (fileType.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    // Default case for unsupported file types
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-gray-600">Preview not available for this file type</p>
        {fileData.access_level === 'download' && (
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download to view
          </Button>
        )}
      </div>
    );
  };

  if (!fileData || !previewUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">File Not Found</h1>
          <p className="text-gray-600">This share link may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-xl font-semibold break-all">
              {fileData.file_path.split('/').pop()}
            </h1>
            
            {fileData.access_level === 'download' && (
              <Button 
                onClick={handleDownload}
                className="w-full md:w-auto flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download File
              </Button>
            )}
          </div>
          
          <div className="space-y-6">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}

