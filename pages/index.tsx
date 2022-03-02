import { Box, Link } from "@primer/react";
import type { NextPage } from "next";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { links } from "../links";

interface Props {}

const Home: NextPage<Props> = ({}) => {
  return (
    <>
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
        {links.map((link, index) => (
          <Box key={index} padding=".5em">
            <Link href={link.url}>{link.title}</Link>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Home;
