import { Box, useTheme } from "@primer/react";
import React, { ReactNode, useRef } from "react";
import { File } from "../types";
import useContextMenu from "../utils/useContextMenu";

interface Props {
  children: ReactNode;
  file: File;
  handleOpen: (file: File) => void;
  handleDownload: (file: File) => void;
  handleRename: (file: File) => void;
  handleDelete: (file: File) => void;
}

const Menu = ({
  file,
  children,
  handleOpen,
  handleDownload,
  handleRename,
  handleDelete,
}: Props) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme!.includes("dark");
  const ref = useRef<HTMLDivElement>(null);
  const { anchorPoint, show } = useContextMenu(ref);

  const items = [
    { text: "Open", onClick: handleOpen },
    { text: "Download", onClick: handleDownload },
  ];

  const items2 = [
    { text: "Rename", onClick: handleRename },
    { text: "Delete", onClick: handleDelete },
  ];

  return (
    <Box ref={ref}>
      {children}
      {show && (
        <Box
          borderRadius={1}
          fontSize={13}
          p={1}
          bg="canvas.subtle"
          color="fg.default"
          borderColor="border.default"
          borderWidth={1}
          borderStyle="solid"
          boxShadow={
            isDark ? "0 3px 6px #010409" : "0 3px 6px rgba(140,149,159,0.15)"
          }
          sx={{
            zIndex: 10,
            position: "absolute",
            top: anchorPoint.y,
            left: anchorPoint.x - 55,
          }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              px={3}
              py={1}
              sx={{
                "&:hover": {
                  bg: "accent.emphasis",
                  color: "fg.onEmphasis",
                },
              }}
              onClick={() => item.onClick(file)}
            >
              {item.text}
            </Box>
          ))}
          <hr />
          {items2.map((item, index) => (
            <Box
              key={index}
              px={3}
              py={1}
              sx={{
                "&:hover": {
                  bg: "accent.emphasis",
                  color: "fg.onEmphasis",
                },
              }}
              onClick={() => item.onClick(file)}
            >
              {item.text}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Menu;
