import { Box } from "@primer/react";
import { NextPage } from "next";
import { Resizable } from "re-resizable";

interface Props {}

const filterPanel: NextPage<Props> = ({ children }) => {
  return (
    <Box display="flex" alignItems="flex-end">
      {children}
      <Resizable
        boundsByDirection
        defaultSize={{
          width: 500,
          height: "100vh",
        }}
      >
        <Box
          height="100%"
          width="100%"
          bg="canvas.subtle"
          borderWidth={1}
          borderStyle="solid"
          borderColor="border.default"
        >
          Filters
        </Box>
      </Resizable>
    </Box>
  );
};

export default filterPanel;
