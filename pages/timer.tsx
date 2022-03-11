import { Box } from "@primer/react";
import { NextPage } from "next";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { GTFS } from "../utils/transit";
import useIntervalFetch from "../utils/useIntervalFetch";

interface Props {}

const url = "/api/gtfs";
const URL = "https://api.stm.info/pub/od/gtfs-rt/ic/v2/vehiclePositions";
const options = {
  method: "GET",
  headers: {
    url: URL,
  },
};

const FeedPage: NextPage<Props> = ({}) => {
  const { data, error } = useIntervalFetch<GTFS>(url, 20000, options);
  const now = data
    ? new Date(parseInt(data.header.timestamp) * 1000)
    : new Date();
  const time = now.toLocaleTimeString();
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
      <pre>
        {data && JSON.stringify(time, null, 2)}
        {error && JSON.stringify(error, null, 2)}
      </pre>
    </Box>
  );
};

export default FeedPage;
