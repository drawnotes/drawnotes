import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";

export const STORAGE_KEYS = {
  LOCAL_STORAGE_ELEMENTS: "excalidraw",
  LOCAL_STORAGE_APP_STATE: "excalidraw-state",
  LOCAL_STORAGE_LIBRARY: "excalidraw-library",
};

export const saveToLocalStorage = (
  elements: readonly ExcalidrawElement[],
  appState: AppState
) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
      JSON.stringify(elements)
    );
    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_APP_STATE,
      JSON.stringify(appState)
    );
  } catch (error: any) {
    // Unable to access window.localStorage
    console.error(error);
  }
};

export const isLocalData = () => {
  return localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS) &&
    localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE)
    ? true
    : false;
};

export const importFromLocalStorage = () => {
  let savedElements = null;
  let savedState = null;

  try {
    savedElements = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
    savedState = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE);
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }
  let elements: ExcalidrawElement[] = [];
  if (savedElements) {
    try {
      elements = JSON.parse(savedElements);
    } catch (error: any) {
      console.error(error);
      // Do nothing because elements array is already empty
    }
  }
  let appState = null;
  if (savedState) {
    try {
      appState = JSON.parse(savedState) as Partial<AppState>;
    } catch (error: any) {
      console.error(error);
      // Do nothing because appState is already null
    }
  }
  return { elements, appState };
};
