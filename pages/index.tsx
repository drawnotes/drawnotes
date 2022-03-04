import "@fontsource/libre-baskerville";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Box, StyledOcticon, Text, useTheme } from "@primer/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import NotesLogo from "../components/NotesLogo";

interface Props {}

const Home: NextPage<Props> = ({}) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const theme = colorScheme!.includes("dark") ? "dark" : "light";
  const darkTheme = theme === "dark";

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

      <Box display="flex" flexDirection="column" alignItems="center">
        <Box fontFamily="Libre Baskerville" m={4}>
          <Box fontSize={[40, 60, 80, 100]}>
            <Text>ansel brandt</Text>
          </Box>
          <Box fontSize={[10, 12, 15, 20]} mt={4}>
            <Box m={2}>
              <Text>Typescript, React, Next.js, GraphQL</Text>
            </Box>
            <Box m={2}>
              <Text>Realtime data visualization</Text>
            </Box>
            <Box m={2}>
              <Text>Mapping, GIS</Text>
            </Box>
            <Box m={2}>
              <Text>IoT</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        mt={6}
        onClick={() => router.push("/notes")}
        sx={{
          "&:hover": {
            color: "accent.fg",
            cursor: "pointer",
          },
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box m={1} width={[50, 60, 80, 100]}>
          <NotesLogo />
        </Box>
        <Box fontFamily="Libre Baskerville" m={1}>
          <Text>Draw Notes</Text>
        </Box>
      </Box>
      <Box
        mt={10}
        onClick={() => router.push("https://github.com/anselbrandt")}
        sx={{
          "&:hover": {
            color: "accent.fg",
            cursor: "pointer",
          },
        }}
      >
        <StyledOcticon icon={MarkGithubIcon} size={25} />
      </Box>
    </Box>
  );
};

export default Home;
