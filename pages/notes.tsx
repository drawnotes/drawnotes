import LightningFS from "@isomorphic-git/lightning-fs";
import { Box, Button, ButtonDanger, Dialog, Text } from "@primer/react";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { OperationResult } from "urql";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import {
  RepositoryVisibility,
  useCreateRepoMutation,
  useUpdateTopicsMutation,
} from "../generated/graphql";
import Blankslate from "../notesComponents/blankslate";
import Editor from "../notesComponents/editor";
import ExplorerPanel from "../notesComponents/explorerPanel";
import FileList from "../notesComponents/fileList";
import FileLoading from "../notesComponents/fileLoading";
import GitPanel from "../notesComponents/gitPanel";
import Menu from "../notesComponents/menu";
import NewFile from "../notesComponents/newFile";
import Preview from "../notesComponents/preview";
import SearchPanel from "../notesComponents/searchPanel";
import SettingsPanel from "../notesComponents/settingsPanel";
import Tabs from "../notesComponents/tabs";
import UserPanel from "../notesComponents/userPanel";
import { File } from "../types";
import { GITHUB_GIT_PROXY } from "../utils/constants";
import {
  importFromLocalFiles,
  isLocalFiles,
  saveToLocalFiles,
} from "../utils/localFiles";
import { readDir } from "../utils/readDir";
import useFetchUser from "../utils/useFetchUser";

const demoRepo = "https://github.com/drawnotes/drawnotes-sample-files";

interface Props {}

const Main: NextPage<Props> = ({}) => {
  let fs: LightningFS;
  if (typeof window !== "undefined") {
    fs = new LightningFS("fs");
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const dir = "/root";
  const [repoUrl, setRepoUrl] = useState<string>(demoRepo);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<string>("explorer");
  const [selectedView, setSelectedView] = useState<string>("editor");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [newFiles, setNewFiles] = useState<string[]>([]);
  const [pendingChanges, setPendingChanges] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [fileLoading, setFileLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const { user } = useFetchUser();
  const [showNewFile, setShowNewFile] = useState(false);
  const [showRenameFile, setShowRenameFile] = useState<File | undefined>();
  const [createRepoData, setCreateRepoData] = useState<
    OperationResult | undefined
  >();
  const [gitMessage, setGitMessage] = useState<string | undefined>();
  const [createRepoResult, createRepo] = useCreateRepoMutation();
  const [updateTopicResult, updateTopics] = useUpdateTopicsMutation();
  const [fileType, setFileType] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("saved-repo", JSON.stringify(repoUrl));
    }
  }, [repoUrl]);

  async function init() {
    if (files.length === 0) {
      setIsLoading(true);
      try {
        setLoadingMessage("Initializing filesystem...");
        await fs.promises.mkdir(dir);
        const options = {
          fs: fs,
          http,
          dir,
          corsProxy: GITHUB_GIT_PROXY,
          url: repoUrl,
          ref: "master",
          singleBranch: true,
          depth: 10,
        };
        setIsFirstLoad(true);
        setLoadingMessage("Cloning from GitHub...");
        await git.clone(options);
      } catch (err) {
        const error: any = err;
        if (error.message === "EEXIST") {
          setIsFirstLoad(false);
        }
      }
      setLoadingMessage("Reading files...");
      setFiles(await readDir(fs, dir));
      if (isLocalFiles()) {
        const { savedNewFiles, savedPendingChanges } = importFromLocalFiles();
        setNewFiles(savedNewFiles);
        setPendingChanges(savedPendingChanges);
      }
      setIsLoading(false);
    }
  }

  const openFile = async (file: File) => {
    const fileContents = await fs.promises.readFile(file.path);
    const isEmpty = fileContents.length === 0;
    switch (file.extension) {
      case "md":
        setFileType("markdown");
        setSelectedView(isEmpty ? "editor" : "markdownPreview");
        break;
      case "geojson":
        setFileType("geojson");
        setSelectedView(isEmpty ? "editor" : "mapPreview");
        break;
      case "csv":
        setFileType("csv");
        setSelectedView(isEmpty ? "editor" : "csvPreview");
        break;
      default:
        setFileType(undefined);
        setSelectedView("editor");
    }
    if (isEmpty) {
      setSelectedFile(undefined);
    } else {
      const contents = fileContents as BufferSource;
      const decoded = decoder.decode(contents);
      setSelectedFileContent(decoded);
    }
    setFileLoading(false);
    setSelectedFile(file);
  };

  const handleOpenDemo = async () => {
    setFileLoading(true);
    setIsFirstLoad(false);
    const file = {
      name: "sample.svg",
      path: "/root/sample.svg",
      type: "file",
      extension: "svg",
      files: [],
      depth: 0,
    };
    await openFile(file);
  };

  useEffect(() => {
    init();
  }, []);

  const resetState = () => {
    setSelectedFile(undefined);
    setSelectedFileContent(undefined);
    setFiles([]);
    setNewFiles([]);
    setPendingChanges([]);
    saveToLocalFiles([], []);
  };

  const handleDownload = async (file: File) => {
    if (file.type === "file") {
      const fileContents = await fs.promises.readFile(file.path);
      const blob = new Blob([fileContents]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }
  };

  const handleOpen = async (file: File) => {
    setIsFirstLoad(false);
    if (file.type === "file" && file !== selectedFile) {
      setFileLoading(true);
      setSelectedFileContent(undefined);
      await openFile(file);
    }
  };

  const handleRenameFile = async (str: string) => {
    const arr = str.split("/");
    const filename = arr[arr.length - 1];
    const file = {
      name: filename,
      path: str.includes("/")
        ? `${dir}/${arr.slice(0, arr.length - 1).join("/")}/${filename}`
        : `${dir}/${filename}`,
      type: "file",
      extension: filename.includes(".") ? filename.split(".")[1] : "",
      files: [],
      depth: 0,
    };
    const files = await readDir(fs, dir);
    const exists = files.some((f: File) => f.path === file.path);
    if (exists) {
      alert("A file with that name already exists.");
    } else {
      if (str.includes("/")) {
        let fullpath = dir;
        for (let folder of arr.slice(0, arr.length - 1)) {
          fullpath = fullpath + "/" + folder;
          await fs.promises.mkdir(fullpath);
        }
      }
      const oldPath = showRenameFile!.path;
      await fs.promises.rename(oldPath, file.path);
      setShowRenameFile(undefined);
      setFiles(await readDir(fs, dir));
      setNewFiles((prev) => {
        const updatedNewFiles = [...prev, file.path];
        saveToLocalFiles(updatedNewFiles, pendingChanges);
        return updatedNewFiles;
      });
    }
  };

  const handleCancelRename = () => setShowRenameFile(undefined);

  const handleRename = (file: File) => setShowRenameFile(file);

  const handleCancelDelete = () => {
    setIsOpen(false);
    setSelectedForDelete(undefined);
  };

  const handleRmFile = async () => {
    setIsOpen(false);
    const path = selectedForDelete.path;
    if (selectedFile && selectedFile.path === path) {
      setSelectedFile(undefined);
      setSelectedFileContent(undefined);
      setFileType(undefined);
    }
    if (newFiles.includes(path)) {
      setNewFiles((prev) => prev.filter((value) => value !== path));
    }
    if (pendingChanges.includes(path)) {
      setPendingChanges((prev) => prev.filter((value) => value !== path));
    }
    await fs.promises.unlink(path);
    setSelectedForDelete(undefined);
    setFiles(await readDir(fs, dir));
  };

  const handleDelete = (file: File) => {
    setIsOpen(true);
    setSelectedForDelete(file);
  };

  const handleSelectedTab = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleSelectedView = (view: string) => {
    setSelectedView(view);
  };

  const handleRevert = async () => {
    indexedDB.deleteDatabase("fs");
    setSelectedFile(undefined);
    setSelectedFileContent(undefined);
    setFiles([]);
    setNewFiles([]);
    setPendingChanges([]);
    saveToLocalFiles([], []);
    setIsLoading(true);
    try {
      const savedRepo = window.localStorage.getItem("saved-repo");
      const currentRepo = savedRepo ? JSON.parse(savedRepo) : demoRepo;
      setLoadingMessage("Initializing filesystem...");
      await fs.promises.mkdir(dir);
      const options = {
        fs: fs,
        http,
        dir,
        corsProxy: GITHUB_GIT_PROXY,
        url: currentRepo,
        ref: "master",
        singleBranch: true,
        depth: 10,
      };
      setLoadingMessage("Cloning from GitHub...");
      await git.clone(options);
    } catch (err) {
      const error: any = err;
      if (error.message !== "EEXIST") {
      }
    }
    setLoadingMessage("Reading files...");
    setFiles(await readDir(fs, dir));
    if (isLocalFiles()) {
      const { savedNewFiles, savedPendingChanges } = importFromLocalFiles();
      setNewFiles(savedNewFiles);
      setPendingChanges(savedPendingChanges);
    }
    setIsLoading(false);
  };

  const handleAddNewFile = async (str: string) => {
    const arr = str.split("/");
    const filename = arr[arr.length - 1];
    const file = {
      name: filename,
      path: str.includes("/")
        ? `${dir}/${arr.slice(0, arr.length - 1).join("/")}/${filename}`
        : `${dir}/${filename}`,
      type: "file",
      extension: filename.includes(".") ? filename.split(".")[1] : "",
      files: [],
      depth: 0,
    };
    const files = await readDir(fs, dir);
    const exists = files.some((f: File) => f.path === file.path);
    if (exists) {
      alert("A file with that name already exists.");
    } else {
      if (str.includes("/")) {
        let fullpath = dir;
        for (let folder of arr.slice(0, arr.length - 1)) {
          fullpath = fullpath + "/" + folder;
          await fs.promises.mkdir(fullpath);
        }
      }
      await fs.promises.writeFile(file.path, "");
      setShowNewFile(false);
      setFiles(await readDir(fs, dir));
      setNewFiles((prev) => {
        const updatedNewFiles = [...prev, file.path];
        saveToLocalFiles(updatedNewFiles, pendingChanges);
        return updatedNewFiles;
      });
    }
  };

  const handleNewFile = () => {
    setShowNewFile(true);
  };

  const handleCancelNewFile = () => {
    setShowNewFile(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();

      // reader.onabort = () => console.log("file reading was aborted");
      // reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        // Do whatever you want with the file contents
        const filePath = dir + "/" + file.path;
        const files = await readDir(fs, dir);
        const exists = files.some((f: File) => f.path === filePath);
        if (exists) {
          alert("A file with that name already exists.");
        } else {
          const buffer = reader.result as ArrayBuffer;
          const arr = new Uint8Array(buffer);
          await fs.promises.writeFile(filePath, arr);
          setFiles(await readDir(fs, dir));
          setNewFiles((prev) => {
            const updatedNewFiles = [...prev, filePath];
            saveToLocalFiles(updatedNewFiles, pendingChanges);
            return updatedNewFiles;
          });
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleUpdateTopic = async (repoId: string) => {
    const repo = await updateTopics({
      repositoryId: repoId,
      topicNames: "drawnotes",
    });
    if (repo.error && repo.error.message) {
      console.log(repo.error?.message.replace("[GraphQL] ", ""));
    } else if (repo.data && repo.data.updateTopics) {
    }
  };

  const handleMkdir = async (dir: string) => {
    try {
      await fs.promises.mkdir(dir);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWriteFile = async ({
    name,
    contents = "",
  }: {
    name: string;
    contents: string;
  }) => {
    try {
      await fs.promises.writeFile(name, encoder.encode(contents));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGitAdd = async (files: string[]) => {
    try {
      for (const file of files) {
        await git.add({ fs, dir, filepath: file.replace("/root/", "") });
      }
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  };

  const handleCommit = async (message = "Update from DrawNotes") => {
    try {
      const commit = {
        author: { name: user!.login, email: user!.email },
        message: message,
      };
      await git.commit({
        fs,
        dir,
        message: commit.message,
        author: commit.author,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePush = async (url = repoUrl) => {
    try {
      const options = {
        fs: fs,
        http,
        dir,
        corsProxy: GITHUB_GIT_PROXY,
        url: url,
        ref: "master",
        singleBranch: true,
        depth: 10,
      };
      await git.push(options);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateRepo = async (repoName: string) => {
    try {
      const repo = await createRepo({
        name: repoName,
        description: "Draw Notes notes collection",
        visibility: RepositoryVisibility.Private,
        ownerId: "",
      });
      setCreateRepoData(repo);
      if (repo.error && repo.error.message) {
        setCreateRepoData(repo);
      } else {
        setGitMessage("Creating new project...");
        resetState();
        indexedDB.deleteDatabase("fs");
        fs = new LightningFS("fs");
        const newRepo = repo.data!.createRepository!.repository;
        await handleUpdateTopic(newRepo!.id);
        setGitMessage("Building file system...");
        await handleMkdir(dir);
        const file = {
          name: "/root/README.md",
          contents:
            "# " +
            repoName +
            "\n\nRepos created by DrawNotes will be tagged with the label `drawnotes` so they can be seen by DrawNotes.\n\n" +
            "Feel free to edit or remove this file.",
        };
        await handleWriteFile(file);
        await handleWriteFile({ name: "/root/untitled.svg", contents: "" });
        setGitMessage("Initizing git...");
        await git.init({ fs, dir });
        const files = ["README.md", "untitled.svg"];
        await handleGitAdd(files);
        const url = newRepo?.url;
        await handleCommit("first commit");
        await git.addRemote({ fs, dir, url, remote: "origin" });
        setGitMessage("Pushing to GitHub...");
        await handlePush(url);
        setCreateRepoData(undefined);
        setRepoUrl(url);
        setGitMessage("Refreshing file list...");
        setFiles(await readDir(fs, dir));
        setGitMessage(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCommitPush = async () => {
    const filesToAdd = files.map((file) => file.path);
    await handleGitAdd(filesToAdd);
    await handleCommit();
    await handlePush();
    setNewFiles([]);
    setPendingChanges([]);
    saveToLocalFiles([], []);
  };

  const handleLoadProject = async (url: string) => {
    indexedDB.deleteDatabase("fs");
    setRepoUrl(url);
    setSelectedTab("explorer");
    await handleRevert();
  };

  const handleNewProject = () => {
    setSelectedTab("settings");
  };

  const handleSetPendingChanges = () => {
    setPendingChanges((prev) => {
      if (prev.includes(selectedFile!.path)) {
        return prev;
      } else {
        const updatedPendingChanges = [...prev, selectedFile!.path];
        saveToLocalFiles(newFiles, updatedPendingChanges);
        return updatedPendingChanges;
      }
    });
  };

  return (
    <Box width="100vw" height="auto" overflow="hidden">
      <ColorModeSwitcher />
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id" justifyContent="center">
          <Box color="fg.default">Confirm Delete</Box>
        </Dialog.Header>
        <Box
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          color="fg.default"
        >
          <Box>
            <Text fontFamily="sans-serif">Are you sure?</Text>
          </Box>
          <Box display="flex" m={4}>
            <Box m={2}>
              <ButtonDanger onClick={handleRmFile}>Delete</ButtonDanger>
            </Box>
            <Box m={2}>
              <Button onClick={handleCancelDelete}>Cancel</Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
      <Box display={"flex"} height={"100vh"}>
        <Tabs
          handleSelectedTab={handleSelectedTab}
          selectedTab={selectedTab}
          newFileCount={newFiles.length}
          pendingChangesCount={newFiles.length + pendingChanges.length}
        />
        <Box>
          {(() => {
            switch (selectedTab) {
              case "explorer":
                return (
                  <ExplorerPanel
                    handleRevert={handleRevert}
                    isLoading={isLoading}
                    onDrop={onDrop}
                    repoUrl={repoUrl}
                    handleNewFile={handleNewFile}
                    loadingMessage={loadingMessage}
                  >
                    <FileList
                      files={files}
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
                    {showNewFile && (
                      <NewFile
                        handleAddNewFile={handleAddNewFile}
                        handleCancelNewFile={handleCancelNewFile}
                      />
                    )}
                  </ExplorerPanel>
                );
              case "search":
                return <SearchPanel />;
              case "git":
                return (
                  <GitPanel
                    user={user}
                    files={files}
                    newFiles={newFiles}
                    pendingChanges={pendingChanges}
                    handleAddCommitPush={handleAddCommitPush}
                    isPushing={false}
                  />
                );
              case "settings":
                return (
                  <SettingsPanel
                    handleCreateRepo={handleCreateRepo}
                    user={user}
                    handleLoadProject={handleLoadProject}
                    createRepoData={createRepoData}
                    gitMessage={gitMessage}
                  />
                );
              case "user":
                return <UserPanel user={user} />;
              default:
                return (
                  <ExplorerPanel
                    handleRevert={handleRevert}
                    isLoading={isLoading}
                    onDrop={onDrop}
                    repoUrl={repoUrl}
                    handleNewFile={handleNewFile}
                    loadingMessage={loadingMessage}
                  >
                    <FileList
                      files={files}
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
                    {showNewFile && (
                      <NewFile
                        handleAddNewFile={handleAddNewFile}
                        handleCancelNewFile={handleCancelNewFile}
                      />
                    )}
                  </ExplorerPanel>
                );
            }
          })()}
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          width="100%"
          height="100%"
        >
          <Menu
            handleSelectedView={handleSelectedView}
            selectedView={selectedView}
            fileType={fileType}
          />
          {fileLoading ? (
            <FileLoading />
          ) : (
            (() => {
              switch (selectedFile?.extension) {
                case "geojson":
                  return selectedView === "mapPreview" ? (
                    <Preview
                      selectedFile={selectedFile}
                      selectedFileContent={selectedFileContent}
                    />
                  ) : (
                    <Editor
                      selectedFile={selectedFile}
                      selectedFileContent={selectedFileContent}
                      fs={fs!}
                      handleSetPendingChanges={handleSetPendingChanges}
                    />
                  );
                case "md":
                  return selectedView === "markdownPreview" ? (
                    <Preview
                      selectedFile={selectedFile}
                      selectedFileContent={selectedFileContent}
                    />
                  ) : (
                    <Editor
                      selectedFile={selectedFile}
                      selectedFileContent={selectedFileContent}
                      fs={fs!}
                      handleSetPendingChanges={handleSetPendingChanges}
                    />
                  );
                case "csv":
                  return selectedView === "csvPreview" ? (
                    <Preview
                      selectedFile={selectedFile}
                      selectedFileContent={selectedFileContent}
                    />
                  ) : (
                    <Editor
                      selectedFile={selectedFile}
                      selectedFileContent={selectedFileContent}
                      fs={fs!}
                      handleSetPendingChanges={handleSetPendingChanges}
                    />
                  );
                default:
                  return (
                    <Editor
                      selectedFile={selectedFile}
                      selectedFileContent={selectedFileContent}
                      fs={fs!}
                      handleSetPendingChanges={handleSetPendingChanges}
                    >
                      {isFirstLoad && (
                        <Blankslate
                          handleNewProject={handleNewProject}
                          handleOpenDemo={handleOpenDemo}
                        />
                      )}
                    </Editor>
                  );
              }
            })()
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
