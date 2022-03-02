import { Box, Text, UnderlineNav } from "@primer/react";
import type { NextPage } from "next";

interface Props {
  handleSelectedView: (view: string) => void;
  selectedView: string;
  fileType: string | undefined;
}

const Menu: NextPage<Props> = ({
  selectedView,
  handleSelectedView,
  fileType,
}: Props) => {
  return (
    <Box backgroundColor="canvas.subtle" width="100%">
      <UnderlineNav aria-label="Main">
        <UnderlineNav.Link
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => handleSelectedView("editor")}
          selected={selectedView === "editor"}
        >
          <Text>Editor</Text>
        </UnderlineNav.Link>
        {(() => {
          switch (fileType) {
            case "geojson":
              return (
                <UnderlineNav.Link
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleSelectedView("mapPreview")}
                  selected={selectedView === "mapPreview"}
                >
                  <Text>Map View</Text>
                </UnderlineNav.Link>
              );
            case "markdown":
              return (
                <UnderlineNav.Link
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleSelectedView("markdownPreview")}
                  selected={selectedView === "markdownPreview"}
                >
                  <Text>Markdown</Text>
                </UnderlineNav.Link>
              );
            case "csv":
              return (
                <UnderlineNav.Link
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleSelectedView("csvPreview")}
                  selected={selectedView === "csvPreview"}
                >
                  <Text>CSV Preview</Text>
                </UnderlineNav.Link>
              );
            default:
              return null;
          }
        })()}
      </UnderlineNav>
    </Box>
  );
};

export default Menu;
