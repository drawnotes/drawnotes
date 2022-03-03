import { useEffect, useState } from "react";

export const useGetOrientation = () => {
  const [orientation, setOrientation] = useState<any>();

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      );
    }
  }, []);
  useEffect(() => {
    const handleOrientationChange = (event: any) => {
      if (event.matches) {
        setOrientation("portrait");
      } else {
        setOrientation("landscape");
      }
    };
    if (typeof window !== undefined) {
      const mediaQueryList = window.matchMedia("(orientation: portrait)");
      mediaQueryList.addEventListener("change", handleOrientationChange);
    }
    return () => {
      const mediaQueryList = window.matchMedia("(orientation: portrait)");
      mediaQueryList.removeEventListener("change", handleOrientationChange);
    };
  });

  return { orientation };
};
