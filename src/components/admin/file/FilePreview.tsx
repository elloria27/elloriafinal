import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FilePreviewProps {
  fileName: string | null;
  onClose: () => void;
}

export const FilePreview = ({ fileName, onClose }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      if (!fileName) return;

      try {
        console.log('Loading preview for:', fileName);
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('files')
          .download(fileName);

        if (downloadError) {
          console.error('Error downloading file:', downloadError);
          return;
        }

        const url = URL.createObjectURL(fileData);
        setPreviewUrl(url);
        setFileType(fileData.type);
        console.log('File type:', fileData.type);

        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error in loadPreview:', error);
      }
    };

    loadPreview();
  }, [fileName]);

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
    if (!previewUrl) return null;

    if (fileType?.toLowerCase().includes('pdf')) {
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

    if (fileType?.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt="File preview"
          className="max-w-full max-h-[70vh] object-contain"
        />
      );
    }

    if (fileType?.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[70vh] w-full">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileType?.startsWith('audio/')) {
      return (
        <audio controls className="w-full">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    return (
      <div className="text-center py-8">
        Preview not available for this file type
      </div>
    );
  };

  return (
    <Dialog open={!!fileName} onOpenChange={() => onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold break-words">
            {fileName}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-x-auto">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};