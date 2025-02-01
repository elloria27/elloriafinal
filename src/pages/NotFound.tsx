import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";

export default function NotFound() {
  console.log('Rendering 404 page');
  
  return (
    <>
      <SEOHead
        title="Page Not Found - 404 Error"
        description="The page you are looking for could not be found. Please check the URL or navigate back to our homepage."
        noindex={true}
      />
      
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/">Go to Homepage</Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}