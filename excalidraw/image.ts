import { base64ToString, decode, encode, stringToBase64 } from "./encode";

const MIME_TYPES = {
  excalidraw: "application/vnd.excalidraw+json",
  excalidrawlib: "application/vnd.excalidrawlib+json",
  json: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  binary: "application/octet-stream",
} as const;

const EXPORT_DATA_TYPES = {
  excalidraw: "excalidraw",
  excalidrawClipboard: "excalidraw/clipboard",
  excalidrawLibrary: "excalidrawlib",
} as const;

export const encodeSvgMetadata = async ({ text }: { text: string }) => {
  const base64 = await stringToBase64(
    JSON.stringify(await encode({ text })),
    true /* is already byte string */
  );

  let metadata = "";
  metadata += `<!-- payload-type:${MIME_TYPES.excalidraw} -->`;
  metadata += `<!-- payload-version:2 -->`;
  metadata += "<!-- payload-start -->";
  metadata += base64;
  metadata += "<!-- payload-end -->";
  return metadata;
};

export const emptyDrawing = `{
  "type": "excalidraw",
  "version": 2,
  "source": "",
  "elements": [],
  "appState": {
    "viewBackgroundColor": "#ffffff"
  }
}`;

export const decodeSvgMetadata = async ({ svg }: { svg: string }) => {
  if (svg.includes(`payload-type:${MIME_TYPES.excalidraw}`)) {
    const match = svg.match(/<!-- payload-start -->(.+?)<!-- payload-end -->/);
    if (!match) {
      // throw new Error("INVALID");
      return emptyDrawing;
    }
    const versionMatch = svg.match(/<!-- payload-version:(\d+) -->/);
    const version = versionMatch?.[1] || "1";
    const isByteString = version !== "1";

    try {
      const json = await base64ToString(match[1], isByteString);
      const encodedData = JSON.parse(json);
      if (!("encoded" in encodedData)) {
        // legacy, un-encoded scene JSON
        if (
          "type" in encodedData &&
          encodedData.type === EXPORT_DATA_TYPES.excalidraw
        ) {
          return json;
        }
        throw new Error("FAILED");
      }
      const decoded = await decode(encodedData);
      return decoded;
    } catch (error: any) {
      console.error(error);
      throw new Error("FAILED");
    }
  }
  // throw new Error("INVALID");
  return emptyDrawing;
};
