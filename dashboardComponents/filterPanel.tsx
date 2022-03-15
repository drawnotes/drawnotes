import { Box, Checkbox, FormControl, Text } from "@primer/react";
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
            <Box>
              <form>
                <FormControl>
                  <Checkbox id="vehicles" />
                  <FormControl.Label>Vehicles</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Checkbox id="paths" />
                  <FormControl.Label>Paths</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Checkbox id="routes" />
                  <FormControl.Label>Routes</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Checkbox id="stops" />
                  <FormControl.Label>Stops</FormControl.Label>
                </FormControl>
              </form>
            </Box>
          </Box>
          <Box m={4}>
            <Box mb={2}>Bike Paths</Box>
            <Box>
              <form>
                <FormControl>
                  <Checkbox id="separated" />
                  <FormControl.Label>Separated</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Checkbox id="shared" />
                  <FormControl.Label>Shared</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Checkbox id="multiUse" />
                  <FormControl.Label>Multi-Use</FormControl.Label>
                </FormControl>
              </form>
            </Box>
          </Box>
          <Box
            m={4}
            p={2}
            overflow="scroll"
            height="60vh"
            borderColor="border.default"
            borderWidth={1}
            borderStyle="solid"
            borderRadius={2}
            bg="canvas.default"
          >
            {routeNames.data.map((route, index) => {
              if (index === routeNames.data.length - 1) {
                return (
                  <Box
                    key={index}
                    mb="200px"
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
