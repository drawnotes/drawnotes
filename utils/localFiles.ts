export const STORAGE_KEYS = {
  NEW_FILES: "new-files",
  PENDING_CHANGES: "pending-changes",
};

export const saveToLocalFiles = (
  newFiles: string[],
  pendingChanges: string[]
) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NEW_FILES, JSON.stringify(newFiles));
    localStorage.setItem(
      STORAGE_KEYS.PENDING_CHANGES,
      JSON.stringify(pendingChanges)
    );
  } catch (error: any) {
    // Unable to access window.localStorage
    console.error(error);
  }
};

export const isLocalFiles = () => {
  return localStorage.getItem(STORAGE_KEYS.NEW_FILES) &&
    localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES)
    ? true
    : false;
};

export const importFromLocalFiles = () => {
  let localNewFiles = null;
  let localPendingChanges = null;

  try {
    localNewFiles = localStorage.getItem(STORAGE_KEYS.NEW_FILES);
    localPendingChanges = localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES);
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }
  let savedNewFiles: string[] = [];
  if (localNewFiles) {
    try {
      savedNewFiles = JSON.parse(localNewFiles);
    } catch (error: any) {
      console.error(error);
      // Do nothing because elements array is already empty
    }
  }
  let savedPendingChanges: string[] = [];
  if (localPendingChanges) {
    try {
      savedPendingChanges = JSON.parse(localPendingChanges);
    } catch (error: any) {
      console.error(error);
      // Do nothing because appState is already null
    }
  }
  return { savedNewFiles, savedPendingChanges };
};
