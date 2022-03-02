import { Box } from "@primer/react";
import type { NextPage } from "next";

const FileLoading: NextPage = ({ children }) => {
  return (
    <Box
      height="100%"
      width="100%"
      color="fg.default"
      bg="canvas.default"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box>Loading...</Box>
    </Box>
  );
};

export default FileLoading;
