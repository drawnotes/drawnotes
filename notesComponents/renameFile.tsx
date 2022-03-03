import { Box, TextInput } from "@primer/react";
import type { NextPage } from "next";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { File } from "../types";

interface Props {
  handleRenameFile: (path: string) => void;
  handleCancelRename: () => void;
  file: File;
  depth: string;
}

const RenameFile: NextPage<Props> = ({
  handleRenameFile,
  handleCancelRename,
  file,
  depth,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>();
  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setInputValue(value);
  };
  const handleSubmit = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue) {
      const sanitizedInput = inputValue.replace(/ /g, "_");
      handleRenameFile(sanitizedInput);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = event.target as Element;
      if (ref.current && !ref.current.contains(element)) {
        handleCancelRename();
      }
    };
    const handleEscape = (event: any) => {
      if (event.key === "Escape") {
        handleCancelRename();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [ref]);

  return (
    <Box ml="2rem" ref={ref}>
      <Box ml={depth}>
        <TextInput
          type="text"
          aria-label="filename"
          name="filename"
          defaultValue={file.path.replace("/root/", "")}
          onChange={handleChange}
          onKeyPress={handleSubmit}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </Box>
    </Box>
  );
};

export default RenameFile;
