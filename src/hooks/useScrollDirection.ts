import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      // Don't do anything if scrolling less than 10px
      if (Math.abs(currentScroll - lastScroll) < 10) {
        return;
      }

      if (currentScroll > lastScroll) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return scrollDirection;
};