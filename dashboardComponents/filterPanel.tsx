import { Box, Text } from "@primer/react";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Resizable } from "re-resizable";
import routeNames from "../sampledata/routeNames.json";

interface Props {}

const filterPanel: NextPage<Props> = ({ children }) => {
  const router = useRouter();

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
          <Box
            m={4}
            onClick={() => router.push("https://www.stm.info/en")}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            <Image src="/assets/stmlogo.png" width="104px" height="48px" />
          </Box>
          <Box m={4}>
            <Text>Montreal Realtime Transit Information</Text>
          </Box>
          <Box m={4}>
            <Box mb={2}>Transit</Box>
            <Box>transit filters</Box>
          </Box>
          <Box m={4}>
            <Box mb={2}>Bike Paths</Box>
            <Box>bike path filters</Box>
          </Box>
          <Box m={4} overflow="scroll" height="100%">
            {routeNames.data.map((route, index) => {
              if (index === routeNames.data.length - 1) {
                return (
                  <Box
                    key={index}
                    mb="400px"
                  >{`${route.route_id} ${route.route_long_name},`}</Box>
                );
              } else {
                return (
                  <Box
                    key={index}
                  >{`${route.route_id} ${route.route_long_name},`}</Box>
                );
              }
            })}
          </Box>
        </Box>
      </Resizable>
    </Box>
  );
};

export default filterPanel;
