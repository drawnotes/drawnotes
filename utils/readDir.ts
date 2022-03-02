import LightningFS from "@isomorphic-git/lightning-fs";
import { File } from "../types";

export const readDir = async (
  fs: LightningFS,
  dir: string,
  depth = 0
): Promise<File[]> => {
  const files = await fs.promises.readdir(dir);
  const details = await Promise.all(
    files.map(async (file) => {
      const name = file;
      const path = `${dir}/${file}`;
      const detail = await fs.promises.stat(path);
      const type = detail.type;
      const extension = type === "file" ? name.split(".")[1] : null;
      const files = type === "file" ? [] : await readDir(fs, path, depth + 1);
      return {
        name: name,
        path: path,
        type: type,
        extension: extension,
        files: files,
        depth: depth,
      };
    })
  );
  return details;
};
