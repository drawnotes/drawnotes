import { PlusIcon } from "@primer/octicons-react";
import { Box, StyledOcticon, TextInput } from "@primer/react";
import type { NextPage } from "next";
import React, { FormEvent, useEffect, useRef, useState } from "react";

interface Props {
  handleAddNewFile: (filename: string) => void;
  handleCancelNewFile: () => void;
}

const newFile: NextPage<Props> = ({
  handleAddNewFile,
  handleCancelNewFile,
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
      handleAddNewFile(sanitizedInput);
    }
  };

  useEffect(() => {
    const handleEscape = (event: any) => {
      if (event.key === "Escape") {
        handleCancelNewFile();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      const element = event.target as Element;
      if (ref.current && !ref.current.contains(element)) {
        handleCancelNewFile();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <Box ml="2rem" ref={ref}>
      <StyledOcticon icon={PlusIcon} />
      <TextInput
        type="text"
        aria-label="filename"
        name="filename"
        placeholder="filename.extension"
        onChange={handleChange}
        onKeyPress={handleSubmit}
        autoComplete="off"
      />
    </Box>
  );
};

export default newFile;
