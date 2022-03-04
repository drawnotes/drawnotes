import { MarkGithubIcon, RepoPushIcon } from "@primer/octicons-react";
import {
  Box,
  Header,
  Heading,
  StyledOcticon,
  Text,
  Tooltip,
} from "@primer/react";
import type { NextPage } from "next";
import Image from "next/image";
import { Resizable } from "re-resizable";
import { ReactNode } from "react";
import { File, User } from "../types";
import FileStatus from "./fileStatus";
interface Props {
  children?: ReactNode;
  user: User | undefined;
  files: File[];
  newFiles: string[];
  pendingChanges: string[];
  handleAddCommitPush: () => void;
  isPushing: boolean;
}

const GitPanel: NextPage<Props> = ({
  children,
  user,
  files,
  newFiles,
  pendingChanges,
  handleAddCommitPush,
  isPushing,
}) => {
  const changesCount = newFiles.length + pendingChanges.length;
  const changedFiles = [...newFiles, ...pendingChanges];
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
          <Heading sx={{ fontSize: 1 }}>Git</Heading>
          {user?.isLoggedIn && (
            <Box
              display="flex"
              flexDirection="row"
              onClick={handleAddCommitPush}
            >
              <Tooltip aria-label="Save to GitHub" direction="w">
                <StyledOcticon icon={RepoPushIcon} size={20} />
              </Tooltip>
            </Box>
          )}
        </Box>
        <Box height="100%">
          <Box color="fg.default">
            {changesCount > 0 && (
              <Box>
                <Box display="flex" justifyContent="space-between" m={3}>
                  <Text>Changes</Text>
                  <Tooltip aria-label="Total changes" direction="w">
                    <Text>{changesCount}</Text>
                  </Tooltip>
                </Box>
                <Box m={3}>
                  {!isPushing
                    ? files
                        .filter((file) => changedFiles.includes(file.path))
                        .map((file, index) => (
                          <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                            my={1}
                            ml={2}
                          >
                            <Text fontSize="medium">{file.name}</Text>
                            <FileStatus
                              file={file}
                              newFiles={newFiles}
                              pendingChanges={pendingChanges}
                            />
                          </Box>
                        ))
                    : "Pushing..."}
                </Box>
              </Box>
            )}
          </Box>
          {!user?.isLoggedIn ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              color="fg.default"
            >
              <Box m={3}>
                <Image
                  src="/assets/Git_and_GitHub.svg"
                  height={100}
                  width={100}
                />
              </Box>
              <Box m={3}>Login to connect to a repository.</Box>
              <Box m={3}>
                <Header>
                  <Header.Item>
                    <Header.Link href="/api/login">
                      <Box display="flex">
                        <Box mr={2}>
                          <StyledOcticon icon={MarkGithubIcon} />
                        </Box>
                        <Box>Login with GitHub</Box>
                      </Box>
                    </Header.Link>
                  </Header.Item>
                </Header>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Resizable>
  );
};

export default GitPanel;
