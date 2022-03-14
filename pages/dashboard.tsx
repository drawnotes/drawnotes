import { Box } from "@primer/react";
import { NextPage } from "next";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import FilterPanel from "../dashboardComponents/filterPanel";
import LogPanel from "../dashboardComponents/logPanel";
import MapPanel from "../dashboardComponents/mapPanel";

interface Props {}

const Dashboard: NextPage<Props> = ({}) => {
  return (
    <Box
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      color="fg.default"
      bg="canvas.default"
    >
      <ColorModeSwitcher />
      <FilterPanel />
      <LogPanel />
      <MapPanel />
    </Box>
  );
};

export default Dashboard;
