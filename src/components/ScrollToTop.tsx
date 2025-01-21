import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("Route changed, scrolling to top");
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Using instant instead of smooth for immediate feedback
    });
  }, [pathname]);

  return null;
}