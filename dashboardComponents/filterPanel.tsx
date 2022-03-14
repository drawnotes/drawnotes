import { Box } from "@primer/react";
import { NextPage } from "next";
import { Resizable } from "re-resizable";

interface Props {}

const filterPanel: NextPage<Props> = ({}) => {
  return (
    <Resizable
      defaultSize={{
        width: 300,
        height: "100%",
      }}
      minWidth={150}
      maxWidth={800}
    >
      <Box
        width="100%"
        height="100%"
        borderStyle="solid"
        borderColor="border.default"
      >
        filterPanel
      </Box>
    </Resizable>
  );
};

export default filterPanel;
