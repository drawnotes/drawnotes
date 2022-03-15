import { ChevronDownIcon, ChevronRightIcon } from "@primer/octicons-react";
import { Box, StyledOcticon } from "@primer/react";
import { ActionList } from "@primer/react/drafts";
import { memo, useMemo } from "react";
import ContextMenu from "../components/ContextMenu";
import FileStatus from "../notesComponents/fileStatus";
import RenameFile from "../notesComponents/renameFile";
import { File } from "../types";

interface Props {
  handleOpen: (file: File) => void;
  handleDownload: (file: File) => void;
  handleRename: (file: File) => void;
  handleRenameFile: (path: string) => void;
  handleCancelRename: () => void;
  handleDelete: (file: File) => void;
  files: File[];
  newFiles: string[];
  pendingChanges: string[];
  selectedFile: File | undefined;
  showRenameFile: File | undefined;
}

const FileList = ({
  handleOpen,
  handleDownload,
  handleRename,
  handleRenameFile,
  handleCancelRename,
  handleDelete,
  files,
  newFiles,
  pendingChanges,
  selectedFile,
  showRenameFile,
}: Props) => {
  const sortedFiles = useMemo(
    () =>
      files
        .filter((file) => file.name !== ".git")
        .filter((file) => {
          const emptyDir = (file: File) =>
            file.type === "dir" && file.files.length === 0;
          return !emptyDir(file);
        })
        .sort((a: any, b: any) => a.type - b.type),
    [files]
  );

  return (
    <ActionList id="actionlist" selectionVariant="single">
      {sortedFiles &&
        sortedFiles.map((file, index) => {
          if (file.type === "file") {
            return (
              <Box key={index}>
                {showRenameFile && showRenameFile.path === file.path ? (
                  <RenameFile
                    handleRenameFile={handleRenameFile}
                    handleCancelRename={handleCancelRename}
                    file={file}
                    depth={`${20 + file.depth * 10}px`}
                  />
                ) : (
                  <ContextMenu
                    file={file}
                    handleOpen={handleOpen}
                    handleDownload={handleDownload}
                    handleRename={handleRename}
                    handleDelete={handleDelete}
                  >
                    <Box ml={`${20 + file.depth * 10}px`}>
                      <ActionList.Item
                        onSelect={() => handleOpen(file)}
                        selected={
                          selectedFile && selectedFile.path === file.path
                            ? true
                            : false
                        }
                      >
                        <Box display="flex" justifyContent="space-between">
                          <Box width="100%">{file.name}</Box>
                          <FileStatus
                            file={file}
                            newFiles={newFiles}
                            pendingChanges={pendingChanges}
                          />
                        </Box>
                      </ActionList.Item>
                    </Box>
                  </ContextMenu>
                )}
              </Box>
            );
          } else {
            return (
              <Box key={index} ml={`${file.depth}px`}>
                {showRenameFile && showRenameFile.path === file.path ? (
                  <RenameFile
                    handleRenameFile={handleRenameFile}
                    handleCancelRename={handleCancelRename}
                    file={file}
                    depth={`${file.depth}px`}
                  />
                ) : (
                  <ContextMenu
                    file={file}
                    handleOpen={handleOpen}
                    handleDownload={handleDownload}
                    handleRename={handleRename}
                    handleDelete={handleDelete}
                  >
                    <ActionList.Item onSelect={() => handleOpen(file)}>
                      <Box width="100%">
                        {file.files.length > 0 ? (
                          <StyledOcticon
                            sx={{ mr: 1 }}
                            size={16}
                            icon={ChevronDownIcon}
                          />
                        ) : (
                          <StyledOcticon
                            sx={{ mr: 1 }}
                            size={16}
                            icon={ChevronRightIcon}
                          />
                        )}
                        {file.name}
                      </Box>
                    </ActionList.Item>
                  </ContextMenu>
                )}
                <FileList
                  files={file.files}
                  handleOpen={handleOpen}
                  handleDownload={handleDownload}
                  handleRename={handleRename}
                  handleRenameFile={handleRenameFile}
                  handleDelete={handleDelete}
                  newFiles={newFiles}
                  pendingChanges={pendingChanges}
                  selectedFile={selectedFile}
                  showRenameFile={showRenameFile}
                  handleCancelRename={handleCancelRename}
                />
              </Box>
            );
          }
        })}
    </ActionList>
  );
};

export default memo(FileList);
