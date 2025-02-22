import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Page Not Found - 404 Error"
        description="The page you are looking for could not be found. Please check the URL or navigate back to our homepage."
      />
      
      <div className="min-h-[70vh] flex items-center justify-center px-4 mt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-8">
            The page you are looking for could not be found.
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="default"
            >
              Go to Homepage
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}