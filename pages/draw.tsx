import type App from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import { Box, Button, useTheme } from "@primer/react";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { demoScene } from "../excalidraw/demoScene";
import { shadedCube } from "../excalidraw/demoScene/libraryItems/shadedCube";
import { shadedCylinder } from "../excalidraw/demoScene/libraryItems/shadedCylinder";
import { encodeSvgMetadata } from "../excalidraw/image";
import {
  importFromLocalStorage,
  isLocalData,
  saveToLocalStorage,
} from "../excalidraw/localStorage";
import { exportElements } from "../utils/excalidrawPatch";

interface Props {}

const Draw: NextPage<Props> = ({}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme!.includes("dark") ? "dark" : "light";
  const [Utils, setUtils] = useState<any>(null);

  const [Excalidraw, setExcalidraw] = useState<typeof App>();
  const ref = useRef<ExcalidrawImperativeAPI>(null);
  const [height, setHeight] = useState<string>();
  const [langCode, setLangCode] = useState<string | undefined>("en");
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    function handleResize() {
      setHeight(`${window.innerHeight}px`);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  });

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
    if (typeof document !== "undefined") {
      if (isLocalData()) {
        const { elements, appState } = importFromLocalStorage();
        delete appState!.collaborators;
        const libraryItems = demoScene.libraryItems;
        const scene = {
          elements: elements,
          appState: appState,
          libraryItems: libraryItems,
          scrollToContent: true,
        };
        setInitialData(scene);
        setHasLoaded(true);
      } else {
        setInitialData(demoScene);
        setHasLoaded(true);
      }
    }
  }, []);

  // library imports currently not completely compatible with package version of excalidraw
  // Browse Library link hidden with _app.css
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (window.location.hash) {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const libraryUrl = hash.get("addLibrary");
        const token = hash.get("token");
        setDebugInfo(`${libraryUrl} ${token}`);
      }
    }
  }, []);

  const updateScene = () => {
    const sceneData: any = {
      elements: [...shadedCylinder, ...shadedCube],
      appState: {
        viewBackgroundColor: "#edf2ff",
      },
    };
    ref.current!.updateScene(sceneData);
  };

  const handleReset = () => {
    ref.current!.resetScene();
  };

  const handleSetViewMode = () => setViewModeEnabled(!viewModeEnabled);

  const handleSetZenMode = () => setZenModeEnabled(!zenModeEnabled);

  const handleSetGridMode = () => setGridModeEnabled(!gridModeEnabled);

  const handleExportWithDarkMode = () =>
    setExportWithDarkMode(!exportWithDarkMode);

  const handleDownloadPNG = async () => {
    const elements = exportElements(ref.current!.getSceneElements());
    const blob = await Utils.exportToBlob({
      elements: elements,
      mimeType: "image/png",
      appState: {
        ...initialData.appState,
        exportWithDarkMode,
      },
    });
    const newBlob = new Blob([blob]);
    const blobUrl = window.URL.createObjectURL(newBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "image.png");
    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleGetSvgWithScene = async () => {
    const elements = exportElements(ref.current!.getSceneElements());
    const svg: Promise<SVGSVGElement> = await Utils.exportToSvg({
      elements: elements,
      appState: {
        ...initialData.appState,
        exportWithDarkMode,
        width: 300,
        height: 100,
      },
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
    const svgWithScene = svgElement.replace(sourceTag, sourceTagWithPayload);
    const newBlob = new Blob([svgWithScene], {
      type: "image/svg+xml",
    });
    // download
    const blobUrl = window.URL.createObjectURL(newBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "imageWithScene.svg");
    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleOnChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState
  ) => {
    if (hasLoaded) {
      saveToLocalStorage(elements, appState);
    }
  };

  const handleSetLang = (lang: string) => {
    setDebugInfo(lang);
    setLangCode(lang);
    localStorage.setItem("excalidraw-lang", lang);
  };

  const handlePointerUpdate = (payload: {
    pointer: {
      x: number;
      y: number;
    };
    button: "up" | "down";
    pointersMap: Map<
      number,
      Readonly<{
        x: number;
        y: number;
      }>
    >;
  }) => console.info(payload);

  // const handleDecode = async () => {
  //   const decoded = await decodeSvgMetadata({ svg: sampleSvg });
  //   setDebugInfo(decoded);
  // };

  return (
    <Box height={height} bg="canvas.default" color="fg.default">
      <ColorModeSwitcher />
      <Box display="flex">
        <Box m={1}>
          <Button onClick={updateScene}>Update Scene</Button>
        </Box>
        <Box m={1}>
          <Button onClick={handleReset}>Reset Scene</Button>
        </Box>
        <Box m={1} mt={2}>
          <label>
            <input
              type="checkbox"
              checked={viewModeEnabled}
              onChange={handleSetViewMode}
            />
            View mode
          </label>
        </Box>
        <Box m={1} mt={2}>
          <label>
            <input
              type="checkbox"
              checked={zenModeEnabled}
              onChange={handleSetZenMode}
            />
            Zen mode
          </label>
        </Box>
        <Box m={1} mt={2}>
          <label>
            <input
              type="checkbox"
              checked={gridModeEnabled}
              onChange={handleSetGridMode}
            />
            Grid mode
          </label>
        </Box>
        <Box m={1}>
          <Button onClick={handleDownloadPNG}>Download PNG</Button>
        </Box>
        <Box m={1}>
          <Button onClick={handleGetSvgWithScene}>
            Download SVG With Scene
          </Button>
        </Box>
        <Box m={1} mt={2}>
          <label>
            <input
              type="checkbox"
              checked={exportWithDarkMode}
              onChange={handleExportWithDarkMode}
            />
            Export with dark mode
          </label>
        </Box>
      </Box>
      <div>
        <pre>{debugInfo}</pre>
      </div>
      {Excalidraw && (
        <Excalidraw
          ref={ref}
          initialData={initialData}
          theme={theme}
          langCode={langCode}
          name={"Excalidraw"}
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          onChange={handleOnChange}
          // onPointerUpdate={handlePointerUpdate}
          // libraryReturnUrl={`${window.location.href}&version=2`}
        />
      )}
    </Box>
  );
};

export default Draw;
