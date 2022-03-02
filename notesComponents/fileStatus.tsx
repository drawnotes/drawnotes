import { Box, Text, Tooltip } from "@primer/react";
import type { NextPage } from "next";
import { File } from "../types";

interface Props {
  file: File;
  newFiles: string[];
  pendingChanges: string[];
}

const FileStatus: NextPage<Props> = ({
  newFiles,
  file,
  pendingChanges,
}: Props) => {
  return (
    <Box color="fg.default">
      <Text>
        {newFiles.includes(file.path) ? (
          <Tooltip aria-label="Untracked" direction="w">
            U
          </Tooltip>
        ) : pendingChanges.includes(file.path) ? (
          <Tooltip aria-label="Modified" direction="w">
            M
          </Tooltip>
        ) : null}
      </Text>
    </Box>
  );
};

export default FileStatus;
