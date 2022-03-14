import { Box } from "@primer/react";
import { NextPage } from "next";
import { Resizable } from "re-resizable";

interface Props {}

const mapPanel: NextPage<Props> = ({}) => {
  return (
    <Resizable
      defaultSize={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        width="100%"
        height="100%"
        borderStyle="solid"
        borderColor="border.default"
      >
        mapPanel
      </Box>
    </Resizable>
  );
};

export default mapPanel;
