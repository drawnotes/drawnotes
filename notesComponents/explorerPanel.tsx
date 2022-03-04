import { FileIcon, SyncIcon } from "@primer/octicons-react";
import {
  Box,
  Heading,
  Link,
  StyledOcticon,
  Text,
  Tooltip,
} from "@primer/react";
import type { NextPage } from "next";
import { Resizable } from "re-resizable";
import { memo, ReactNode } from "react";
import { useDropzone } from "react-dropzone";
import { getRepoName } from "../utils/getRepoName";

interface Props {
  handleRevert: () => void;
  isLoading: boolean;
  onDrop: (acceptedFiles: any) => void;
  children: ReactNode;
  repoUrl: string;
  handleNewFile: () => void;
  loadingMessage: string | undefined;
}

const ExplorerPanel: NextPage<Props> = ({
  children,
  handleRevert,
  isLoading,
  onDrop,
  repoUrl,
  handleNewFile,
  loadingMessage,
}) => {
  const { isDragActive, getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });
  return (
    <Resizable
      defaultSize={{
        width: 300,
        height: "100%",
      }}
      minWidth={150}
      maxWidth={800}
    >
      <Box
        borderRightWidth="1px"
        borderRightStyle="solid"
        borderColor="border.default"
        backgroundColor="canvas.subtle"
        height="100%"
        width="100%"
        overflow={"scroll"}
      >
        <Box
          borderStyle="solid"
          borderColor="border.default"
          borderWidth={0}
          borderBottomWidth={1}
          p={3}
          color="fg.muted"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Heading sx={{ fontSize: 1 }}>Explorer</Heading>
          <Box display="flex" flexDirection="row" onClick={handleRevert}>
            <Tooltip aria-label="Discard all changes and revert" direction="w">
              <StyledOcticon icon={SyncIcon} size={20} />
            </Tooltip>
          </Box>
        </Box>
        {isLoading ? (
          <Box color="fg.default">
            <Box p={3}>Loading...</Box>
            <Box p={3}>{loadingMessage}</Box>
          </Box>
        ) : (
          <>
            <Box
              m={2}
              mr={3}
              display="flex"
              justifyContent="space-between"
              color="fg.default"
            >
              <Text fontSize="medium">{repoUrl && getRepoName(repoUrl)}</Text>
              <Box onClick={handleNewFile}>
                <Tooltip aria-label="Add new file" direction="w">
                  <StyledOcticon icon={FileIcon} size={18} />
                </Tooltip>
              </Box>
            </Box>
            {children}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={10}
              color="fg.default"
              borderColor="border.default"
              borderWidth={6}
              borderStyle={isDragActive ? "dashed" : "none"}
              borderRadius={10}
              m={3}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Box>
                  <StyledOcticon icon={FileIcon} size={30} />
                </Box>
                {isDragActive ? (
                  <Box mt={4}>
                    <Text fontWeight="bold">Drop to upload your files</Text>
                  </Box>
                ) : (
                  <Box>
                    <Box mt={4}>
                      <Text fontWeight="bold">Drag files here to add them</Text>
                    </Box>
                    <Box mt={4}>
                      <Text>
                        Or{" "}
                        <Link as="button" onClick={open}>
                          choose files
                        </Link>
                      </Text>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Resizable>
  );
};

export default memo(ExplorerPanel);
