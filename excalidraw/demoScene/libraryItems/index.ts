import { LibraryItems } from "@excalidraw/excalidraw/types/types";
import { appServer } from "./appServer";
import { cdn } from "./cdn";
import { cloud } from "./cloud";
import { cylinder } from "./cylinder";
import { db } from "./db";
import { device } from "./device";
import { hexagon } from "./hexagon";
import { layers } from "./layers";
import { notes } from "./notes";
import { pipe } from "./pipe";
import { server } from "./server";
import { web } from "./web";

export const libraryItems: LibraryItems = [
  hexagon,
  server,
  layers,
  cylinder,
  notes,
  web,
  device,
  cdn,
  appServer,
  db,
  pipe,
  cloud,
];
