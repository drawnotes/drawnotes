import { MarkGithubIcon, RepoIcon } from "@primer/octicons-react";
import {
  Box,
  ButtonPrimary,
  Header,
  Heading,
  Link,
  StyledOcticon,
  Text,
  TextInput,
} from "@primer/react";
import type { NextPage } from "next";
import Image from "next/image";
import { Resizable } from "re-resizable";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { OperationResult } from "urql";
import { useFetchDrawNotesReposQuery } from "../generated/graphql";
import { User } from "../types";

interface Props {
  children?: ReactNode;
  handleCreateRepo: (name: string) => void;
  user: User | undefined;
  handleLoadProject: (url: string) => void;
  createRepoData: OperationResult<any, any> | undefined;
  gitMessage: string | undefined;
}

const SettingsPanel: NextPage<Props> = ({
  children,
  handleCreateRepo,
  user,
  handleLoadProject,
  createRepoData,
  gitMessage,
}) => {
  const [inputValue, setInputValue] = useState<string>();
  const [drawNotesRepos, executeQuery] = useFetchDrawNotesReposQuery({
    requestPolicy: "cache-and-network",
    pause: user?.login === "",
    variables: { query: `topic:drawnotes user:${user?.login}` },
  });
  const projectRepos = drawNotesRepos.data
    ? drawNotesRepos.data.search.nodes?.map((repo: any) => ({
        name: repo.name,
        url: repo.url,
      }))
    : null;

  useEffect(() => {
    executeQuery();
  }, [createRepoData]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setInputValue(value);
  };

  const handleSubmit = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue) {
      const sanitizedInput = inputValue.replace(/ /g, "-");
      handleCreateRepo(sanitizedInput);
    }
  };

  const handleButton = () => {
    if (inputValue && inputValue !== "") {
      handleCreateRepo(inputValue);
    }
  };

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
        color="fg.default"
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
          <Heading sx={{ fontSize: 1 }}>Settings</Heading>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box m={3}>
            <Image src="/assets/API.svg" height={100} width={100} />
          </Box>
        </Box>
        {!user?.isLoggedIn ? (
          <Box display="flex" flexDirection="column" alignItems="center">
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
        ) : (
          <Box>
            <Box m={3}>
              Create a new repo on GitHub to save your work, or connect to an
              existing repo.
            </Box>
            <Box m={3} display="flex">
              <TextInput
                type="text"
                aria-label="Repo name"
                name="repoName"
                placeholder="Repo name"
                m={1}
                onChange={handleChange}
                onKeyPress={handleSubmit}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <Box m={1}>
                <ButtonPrimary onClick={handleButton}>
                  <StyledOcticon icon={RepoIcon} />
                  <Text m={1}>New</Text>
                </ButtonPrimary>
              </Box>
            </Box>
            {createRepoData && createRepoData.error ? (
              <Box color="danger.fg" ml={3}>
                <Text fontSize="medium">
                  {createRepoData.error.message.replace("[GraphQL] ", "")}
                </Text>
              </Box>
            ) : (
              createRepoData && (
                <Box color="success.fg" ml={6}>
                  <Text fontSize="medium">Success!</Text>
                </Box>
              )
            )}
            {gitMessage && (
              <Box ml={6} mt={2}>
                <Text fontSize="medium">{gitMessage}</Text>
              </Box>
            )}
            {projectRepos && (
              <Box ml={3} mt={6} mb={3}>
                <Text fontWeight="bold">DrawNotes Projects:</Text>
              </Box>
            )}
            {projectRepos?.map((repo, index) => (
              <Box key={index} ml={3} my={1}>
                <Link as="button" onClick={() => handleLoadProject(repo.url)}>
                  {repo.name}
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Resizable>
  );
};

export default SettingsPanel;
