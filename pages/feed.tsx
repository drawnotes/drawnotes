import { Box } from "@primer/react";
import { NextPage } from "next";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { APIKEY } from "../utils/constants";
import useFetch from "../utils/useFetch";

interface Props {}

const url = "/api/gtfs";
const URL = "https://api.stm.info/pub/od/gtfs-rt/ic/v2/vehiclePositions";
const options = {
  method: "GET",
  headers: {
    apikey: APIKEY,
    url: URL,
  },
};

const FeedPage: NextPage<Props> = ({}) => {
  const { data, error } = useFetch(url, options);

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
        {data && JSON.stringify(data, null, 2)}
        {error && JSON.stringify(error, null, 2)}
      </pre>
    </Box>
  );
};

export default FeedPage;
