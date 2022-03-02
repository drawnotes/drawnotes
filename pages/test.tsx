import { Box, Link } from "@primer/react";
import type { NextPage } from "next";
import ColorModeSwitcher from "../components/ColorModeSwitcher";

interface Props {}

const Test: NextPage<Props> = ({}) => {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      color="fg.default"
      bg="canvas.default"
    >
      <ColorModeSwitcher />
      <Link href="/">Home</Link>
      <Box>Test</Box>
    </Box>
  );
};

export default Test;
