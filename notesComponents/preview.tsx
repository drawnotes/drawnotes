import { Box } from "@primer/react";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { File } from "../types";
import CSVPreview from "./csvPreview";
import MapPreview from "./mapPreview";
import MarkdownPreview from "./markdownPreview";

interface Props {
  selectedFile: File | undefined;
  selectedFileContent: string | undefined;
}

const Preview: NextPage<Props> = ({ selectedFile, selectedFileContent }) => {
  const deckRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState<any>();

  useEffect(() => {
    function handleResize() {
      if (deckRef.current) {
        const width = deckRef.current.clientWidth;
        const height = deckRef.current.clientHeight;
        setMapSize({ width: width, height: height });
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const observer = useRef(
    new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setMapSize({ width: width, height: height });
    })
  );

  useEffect(() => {
    if (deckRef.current) {
      observer.current.observe(deckRef.current);
    }
    return () => {
      if (deckRef.current !== null) {
        observer.current.unobserve(deckRef.current);
      }
    };
  }, [deckRef, observer]);

  return (
    <Box
      height="100%"
      width="100%"
      ref={deckRef}
      bg="canvas.default"
      overflow="scroll"
    >
      {selectedFile &&
        selectedFileContent &&
        (() => {
          switch (selectedFile.extension) {
            case "geojson":
              return (
                mapSize && (
                  <MapPreview
                    geoData={JSON.parse(selectedFileContent)}
                    mapSize={mapSize}
                  />
                )
              );
            case "md":
              return (
                <MarkdownPreview selectedFileContent={selectedFileContent} />
              );
            case "csv":
              return <CSVPreview selectedFileContent={selectedFileContent} />;
            default:
              return null;
          }
        })()}
    </Box>
  );
};

export default Preview;
