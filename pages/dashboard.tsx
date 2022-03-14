import { Box } from "@primer/react";
import { NextPage } from "next";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import FilterPanel from "../dashboardComponents/filterPanel";
import LogPanel from "../dashboardComponents/logPanel";
import MapPanel from "../dashboardComponents/mapPanel";

interface Props {}

const Dashboard: NextPage<Props> = ({}) => {
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
          <MapPanel />
          <LogPanel />
        </Box>
        <FilterPanel />
      </Box>
    </Box>
  );
};

export default Dashboard;
