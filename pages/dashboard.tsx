import { Box } from "@primer/react";
import { NextPage } from "next";
import { Resizable } from "re-resizable";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
// import FilterPanel from "../dashboardComponents/filterPanel";
// import LogPanel from "../dashboardComponents/logPanel";
// import MapPanel from "../dashboardComponents/mapPanel";

interface Props {}

const Dashboard: NextPage<Props> = ({}) => {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
  };
  return (
    <Box color="fg.default" bg="canvas.default" width="100vw" height="100vh">
      <ColorModeSwitcher />
      <Box display="flex" alignItems="flex-end">
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
        >
          <Box>Map</Box>
          <Resizable
            style={style}
            defaultSize={{
              width: "100%",
              height: 100,
            }}
          >
            Logs
          </Resizable>
        </Box>
        <Resizable
          style={style}
          defaultSize={{
            width: 200,
            height: "100vh",
          }}
        >
          Filters
        </Resizable>
      </Box>
    </Box>
  );
};

export default Dashboard;
