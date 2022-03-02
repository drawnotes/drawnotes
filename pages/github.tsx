import LightningFS from "@isomorphic-git/lightning-fs";
import { Box, Button, Link } from "@primer/react";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import { NextPage } from "next";
import { useState } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import {
  RepositoryVisibility,
  useCreateRepoMutation,
  useFetchMoreReposQuery,
  useFetchReposQuery,
  useUpdateTopicsMutation,
} from "../generated/graphql";
import { GITHUB_GIT_PROXY } from "../utils/constants";

const repoName = "created-from-graphql";
const url = `https://github.com/anselbrandt/${repoName}`;

interface Props {}

const Github: NextPage<Props> = ({}) => {
  let fs: LightningFS;
  if (typeof window !== "undefined") {
    fs = new LightningFS("fs");
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const dir = "/tutorial";
  const [, create] = useCreateRepoMutation();
  const [, update] = useUpdateTopicsMutation();
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState<any | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [initialRepos] = useFetchReposQuery();
  const [cursor, setCursor] = useState<string>("");
  const [moreRepos] = useFetchMoreReposQuery({
    variables: {
      cursor: cursor,
    },
  });

  const handleFetchRepos = () => {
    const pageInfo = initialRepos.data!.viewer.repositories.pageInfo;
    if (pageInfo.hasNextPage) {
      setCursor(pageInfo.endCursor!);
    }
    setData(pageInfo);
  };

  const handleFetchMoreRepos = () => {
    const pageInfo = moreRepos.data!.viewer.repositories.pageInfo;
    setData(pageInfo);
  };

  const handleCreateRepo = async () => {
    const repo = await create({
      name: repoName,
      description: "created from Github GraphQL API",
      visibility: RepositoryVisibility.Private,
      ownerId: "",
    });
    if (repo.data && repo.data.createRepository) {
      setData(repo.data.createRepository.repository);
    } else {
      setData(repo.error?.message.replace("[GraphQL] ", ""));
    }
  };

  const handleUpdateTopic = async () => {
    const repo = await update({
      repositoryId: "R_kgDOG1qWLw",
      topicNames: "drawnotes",
    });
    if (repo.error && repo.error.message) {
      setData(repo.error?.message.replace("[GraphQL] ", ""));
    } else if (repo.data && repo.data.updateTopics) {
      setData(repo.data.updateTopics);
    }
  };

  const handleInit = async () => {
    try {
      await fs.promises.mkdir(dir);
      setMessage("File system initialized!");
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleWrite = async () => {
    try {
      const file = {
        name: "/tutorial/README.md",
        contents: `# Iso-git Readme
        
        Created in the browser
        `,
      };
      await fs.promises.writeFile(file.name, encoder.encode(file.contents));
      setMessage("File written!");
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleLs = async () => {
    try {
      const files = await fs.promises.readdir(dir);
      setMessage(files);
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleRead = async () => {
    try {
      const file = (await fs.promises.readFile(
        "/tutorial/README.md"
      )) as BufferSource;
      setMessage(decoder.decode(file));
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleGitInit = async () => {
    try {
      await git.init({ fs, dir });
      await git.addRemote({ fs, dir, url, remote: "origin" });
      setMessage("Local repo initialized!");
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleGitAdd = async () => {
    try {
      await git.add({ fs, dir, filepath: "." });
      setMessage("Files added to repo");
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handleCommit = async () => {
    try {
      const commit = {
        author: { name: "me", email: "email@me.com" },
        message: "Added README",
      };
      await git.commit({
        fs,
        dir,
        message: commit.message,
        author: commit.author,
      });
      setMessage(commit);
    } catch (error) {
      if (error) setMessage(error);
    }
  };

  const handlePush = async () => {
    try {
      setMessage("");
      setIsLoading(true);
      const options = {
        fs: new LightningFS("fs"),
        http,
        dir,
        corsProxy: GITHUB_GIT_PROXY,
        url: url,
        ref: "master",
        singleBranch: true,
        depth: 10,
      };
      await git.push(options);
      setIsLoading(false);
      setMessage("Repo pushed!");
    } catch (error) {
      if (error) {
        setIsLoading(false);
        setMessage(error);
        console.error(error);
      }
    }
  };

  const handleClone = async () => {
    try {
      setMessage("");
      setIsLoading(true);
      const options = {
        fs: new LightningFS("fs"),
        http,
        dir,
        corsProxy: GITHUB_GIT_PROXY,
        url: url,
        ref: "master",
        singleBranch: true,
        depth: 10,
      };
      await git.clone(options);
      setIsLoading(false);
      setMessage("Repo cloned!");
    } catch (error) {
      if (error) {
        setIsLoading(false);
        setMessage(error);
        console.error(error);
      }
    }
  };

  const handleLog = async () => {
    try {
      const logs = await git.log({ fs, dir });
      setMessage(logs);
    } catch (error) {
      setMessage(error);
    }
  };

  const handleStatus = async () => {
    try {
      const status = await git.status({ fs, dir, filepath: "README.md" });
      setMessage(status);
    } catch (error) {
      setMessage(error);
    }
  };

  const handleReadDir = async () => {
    try {
      const files = await fs.promises.readdir(dir);
      const details = await Promise.all(
        files.map(async (file) => {
          const path = `${dir}/${file}`;
          const detail = await fs.promises.stat(path);
          return {
            name: file,
            path: path,
            type: detail.type,
          };
        })
      );
      setMessage(details);
    } catch (error) {
      setMessage(error);
    }
  };

  const handleWipe = async () => {
    setMessage("IndexedDB Cleared");
    console.clear();
    // @ts-ignore
    fs = new LightningFS("fs", { wipe: true });
  };
  return (
    <>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color="fg.default"
        bg="canvas.default"
      >
        <ColorModeSwitcher />
        <Link href="/">Home</Link>
        <br />
        <Box>
          <Button onClick={handleFetchRepos}>Fetch Repos</Button>
          <Button onClick={handleFetchMoreRepos}>Fetch More Repos</Button>
          <Button onClick={handleCreateRepo}>Create new GitHub repo</Button>
          <Button onClick={handleUpdateTopic}>Update Topic</Button>
          <Button onClick={handleInit}>Initialize File System</Button>
          <Button onClick={handleWrite}>Write File</Button>
          <Button onClick={handleLs}>List Files</Button>
          <Button onClick={handleRead}>Read File</Button>
          <Button onClick={handleGitInit}>Git Init</Button>
          <Button onClick={handleGitAdd}>Git Add</Button>
          <Button onClick={handleCommit}>Git Commit</Button>
          <Button onClick={handlePush}>Git Push</Button>
          <Button onClick={handleClone}>Clone Repo</Button>
          <Button onClick={handleLog}>Read Git Log</Button>
          <Button onClick={handleStatus}>README.md Status</Button>
          <Button onClick={handleReadDir}>Read Directory</Button>
          <Button onClick={handleWipe}>Clear IndexedDB</Button>
        </Box>
        <Box>
          <pre>{data && JSON.stringify(data, null, 2)}</pre>
          <pre>{message && JSON.stringify(message, null, 2)}</pre>
          <pre>{isLoading && "Loading..."}</pre>
        </Box>
      </Box>
    </>
  );
};

export default Github;
