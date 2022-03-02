import type App from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import LightningFS from "@isomorphic-git/lightning-fs";
import MonacoEditor, { OnChange } from "@monaco-editor/react";
import { Box, useTheme } from "@primer/react";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { libraryItems } from "../excalidraw/demoScene/libraryItems";
import { getSceneVersion } from "../excalidraw/getSceneVersion";
import { decodeSvgMetadata, encodeSvgMetadata } from "../excalidraw/image";
import tomorrowNight from "../notesComponents/tomorrowNight.json";
import tomorrowNightEighties from "../notesComponents/tomorrowNightEighties.json";
import { File } from "../types";
import { getVsTheme } from "../utils/getVsTheme";

interface Props {
  selectedFile: File | undefined;
  selectedFileContent: string | undefined;
  fs: LightningFS;
  handleSetPendingChanges: () => void;
}

const Editor: NextPage<Props> = ({
  children,
  selectedFile,
  selectedFileContent,
  fs,
  handleSetPendingChanges,
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme!.includes("dark") ? "dark" : "light";
  const vsTheme = getVsTheme(colorScheme);
  const editorRef = useRef(null);
  const [Excalidraw, setExcalidraw] = useState<typeof App>();
  const [Utils, setUtils] = useState<any>(null);
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
  const [sceneVersion, setSceneVersion] = useState<number | null>(null);
  const debounceRef = useRef<number | undefined>();

  function handleEditorDidMount(editor: any, monaco: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
    monaco.editor.defineTheme("tomorrowNightEighties", tomorrowNightEighties);
    monaco.editor.defineTheme("tomorrowNight", tomorrowNight);
    monaco.editor.setTheme(vsTheme);
  }

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => {
      setExcalidraw(comp.default);
    });
  }, []);

  useEffect(() => {
    import("@excalidraw/utils").then((comp) => {
      setUtils(comp);
    });
  }, []);

  useEffect(() => {
    const updateScene = async (selectedSvg: string) => {
      try {
        setSceneVersion(null);
        const decoded = await decodeSvgMetadata({ svg: selectedSvg });
        const { elements, appState } = JSON.parse(
          decoded.replace(/draw/g, "freedraw")
        );
        const scene = {
          elements: elements,
          appState: appState,
          libraryItems: libraryItems,
          scrollToContent: true,
        };
        excalidrawRef.current?.updateScene(scene);
        excalidrawRef.current?.scrollToContent();
        const version = getSceneVersion(scene.elements);
        setSceneVersion(version);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedFileContent && selectedFile?.extension === "svg") {
      updateScene(selectedFileContent);
    }
  }, [Excalidraw, selectedFile, selectedFileContent]);

  const handleEditorChange: OnChange = (value, event) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      await fs.promises.writeFile(selectedFile!.path, value!);
      handleSetPendingChanges();
    }, 500);
  };

  const handleOnDrawingChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState
  ) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      const currentVersion = getSceneVersion(elements);
      if (currentVersion > 0 && currentVersion !== sceneVersion) {
        const elementsRaw = excalidrawRef.current!.getSceneElements();
        const elementsString = JSON.stringify(elementsRaw).replace(
          /freedraw/g,
          "draw"
        );
        const elements = JSON.parse(elementsString);
        const svg: Promise<SVGSVGElement> = await Utils.exportToSvg({
          elements: elements,
          embedScene: true,
        });
        const svgElement = (await svg).outerHTML;
        const sceneData = {
          type: "excalidraw",
          version: 2,
          source: window.location.href,
          appState: {
            viewBackgroundColor: "#ffffff",
          },
          elements: elements,
        };
        const sceneDataText = JSON.stringify(sceneData);
        const payload = await encodeSvgMetadata({ text: sceneDataText });
        const sourceTag = "<!-- svg-source:excalidraw -->";
        const sourceTagWithPayload = `${sourceTag}${payload}`;
        const data = svgElement.replace(sourceTag, sourceTagWithPayload);
        await fs.promises.writeFile(selectedFile!.path, data);
        handleSetPendingChanges();
        setSceneVersion(currentVersion);
      }
    }, 500);
  };

  return (
    <Box height="100%" width="100%" bg="canvas.default">
      <Box position="absolute" left="40%" top="20%" zIndex={10}>
        {children}
      </Box>
      {selectedFile &&
        (() => {
          switch (selectedFile.extension) {
            case "svg":
              return (
                Excalidraw && (
                  <Excalidraw
                    ref={excalidrawRef}
                    initialData={{ libraryItems: libraryItems }}
                    theme={theme}
                    langCode={"en"}
                    name={"Excalidraw"}
                    onChange={handleOnDrawingChange}
                  />
                )
              );
            default:
              return (
                <MonacoEditor
                  theme={vsTheme}
                  height="100%"
                  path={
                    selectedFile.extension === "geojson"
                      ? selectedFile.name.replace(".geojson", ".json")
                      : selectedFile.name
                  }
                  value={selectedFileContent}
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                />
              );
          }
        })()}
    </Box>
  );
};

export default Editor;
