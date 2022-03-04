import { Box, Heading } from "@primer/react";
import type { NextPage } from "next";
import Image from "next/image";
import { Resizable } from "re-resizable";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const SearchPanel: NextPage<Props> = ({ children }) => {
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
        borderRightWidth="1px"
        borderRightStyle="solid"
        borderColor="border.default"
        backgroundColor="canvas.subtle"
        height="100%"
        width="100%"
        overflow={"scroll"}
        color="fg.default"
      >
        <Box
          borderStyle="solid"
          borderColor="border.default"
          borderWidth={0}
          borderBottomWidth={1}
          p={3}
          color="fg.muted"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Heading sx={{ fontSize: 1 }}>Search</Heading>
        </Box>
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box m={3}>
            <Image
              src="/assets/Magnifying_glass.svg"
              height={100}
              width={100}
            />
          </Box>
          <Box m={3}>Search</Box>
        </Box>
      </Box>
    </Resizable>
  );
};

export default SearchPanel;
