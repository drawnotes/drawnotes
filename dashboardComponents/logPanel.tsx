import { Box } from "@primer/react";
import { NextPage } from "next";
import { Resizable } from "re-resizable";

interface Props {}

const logPanel: NextPage<Props> = ({}) => {
  return (
    <Resizable
      defaultSize={{
        width: "100%",
        height: 300,
      }}
      minHeight={150}
      maxHeight={800}
    >
      <Box
        width="100%"
        height="100%"
        borderStyle="solid"
        borderColor="border.default"
      >
        logPanel
      </Box>
    </Resizable>
  );
};

export default logPanel;
