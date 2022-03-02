import { File } from "../types";

interface FileDetails {
  name: string;
  extension: string;
  path: string;
  depth: number;
}

export const flatten = (arr: File[]) => {
  let result: FileDetails[] = [];
  arr.forEach((file) => {
    if (file.files.length) {
      result = [...result, ...flatten(file.files)];
    } else if (file.type === "file" && file.extension) {
      result.push({
        name: file.name,
        extension: file.extension,
        path: file.path,
        depth: file.depth,
      });
    }
  });
  return result;
};
