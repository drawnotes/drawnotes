import { Box, Link } from "@primer/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { links } from "../links";

const logout = "/api/logout";

interface Props {}

const Home: NextPage<Props> = ({}) => {
  const router = useRouter();
  const handleLogout = (event: MouseEvent) => {
    event.preventDefault();
    localStorage.clear();
    indexedDB.deleteDatabase("fs");
    router.push(logout);
  };
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
      {links.map((link, index) => (
        <Box key={index} padding=".5em">
          <Link href={link.url}>{link.title}</Link>
        </Box>
      ))}
      <Box padding=".5em">
        <Link onClick={handleLogout} href={logout}>
          Logout
        </Link>
      </Box>
    </Box>
  );
};

export default Home;
