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
      <FilterPanel>
        <LogPanel>
          <MapPanel />
        </LogPanel>
      </FilterPanel>
    </Box>
  );
};

export default Dashboard;
