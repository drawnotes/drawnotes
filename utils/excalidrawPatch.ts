import {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types";

// @excalidraw/utils does not yet accept 'freedraw' elements
// exported images are generated from less-refined 'draw' elements

export const exportElements = (
  elements: readonly NonDeletedExcalidrawElement[]
) => {
  const elementsString = JSON.stringify(elements).replace(/freedraw/g, "draw");
  return JSON.parse(elementsString);
};

export const importElements = (elements: ExcalidrawElement[]) => {
  const elementsString = JSON.stringify(elements).replace(/draw/g, "freedraw");
  return JSON.parse(elementsString);
};
