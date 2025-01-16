import { useEffect } from "react";

const useScrollLock = (isLocked) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isLocked) {
      // Prevent scroll
      document.body.style.overflow = "hidden";
      // Add padding to prevent layout shift when scrollbar disappears
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      // Restore original scroll behavior and padding
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "0px";
    };
  }, [isLocked]);
};

export default useScrollLock;
