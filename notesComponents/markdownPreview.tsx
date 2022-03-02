import { Box } from "@primer/react";
import type { NextPage } from "next";
import HighlightedMarkdown from "./highlighted-markdown";

interface Props {
  selectedFileContent: string | undefined;
}

const MarkdownPreview: NextPage<Props> = ({ selectedFileContent }) => {
  return (
    <Box
      p="3rem"
      mb="10rem"
      bg="canvas.default"
      color="fg.default"
      maxHeight="100%"
      maxWidth={800}
    >
      {selectedFileContent && (
        <HighlightedMarkdown>{selectedFileContent}</HighlightedMarkdown>
      )}
    </Box>
  );
};

export default MarkdownPreview;
