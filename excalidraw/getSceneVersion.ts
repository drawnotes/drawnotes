import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

export const getSceneVersion = (elements: readonly ExcalidrawElement[]) =>
  elements.reduce((acc, el) => acc + el.version, 0);
