import { Box, Link } from "@primer/react";
import type { NextPage } from "next";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { useGetBreakpoint } from "../utils/useGetBreakpoint";

interface Props {}

const Test: NextPage<Props> = ({}) => {
  const { breakpoint } = useGetBreakpoint();
  const bg = ["#227C9D", "#17C3B2", "#FFCB77", "#FE6D73"][breakpoint];
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      color="fg.default"
      // bg="canvas.default"
      bg={bg}
    >
      <ColorModeSwitcher />
      <Link href="/">Home</Link>
      <Box>{breakpoint}</Box>
    </Box>
  );
};

export default Test;
