import { Box } from "@primer/react";
import { NextPage } from "next";
import { Resizable } from "re-resizable";

interface Props {}

const logPanel: NextPage<Props> = ({ children }) => {
  return (
    <Box width="100%" height="100vh" display="flex" flexDirection="column">
      <Box width="100%" height="100%">
        {children}
      </Box>
      <Resizable
        defaultSize={{
          width: "100%",
          height: 300,
        }}
        boundsByDirection
      >
        <Box
          height="100%"
          width="100%"
          bg="canvas.subtle"
          borderWidth={1}
          borderStyle="solid"
          borderColor="border.default"
        >
          Logs
        </Box>
      </Resizable>
    </Box>
  );
};

export default logPanel;
