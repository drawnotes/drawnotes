import { ImportedDataState } from "@excalidraw/excalidraw/types/data/types";
import { drawingElements } from "./drawingElements";
import { libraryItems } from "./libraryItems";

export const demoScene: ImportedDataState = {
  elements: drawingElements,
  appState: {
    gridSize: null,
    viewBackgroundColor: "#ffffff",
  },
  scrollToContent: true,
  libraryItems: libraryItems,
};
