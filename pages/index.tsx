import "@fontsource/libre-baskerville";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Box, StyledOcticon, Text, useTheme } from "@primer/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AiOutlineLinkedin } from "react-icons/ai";
import { VscFilePdf } from "react-icons/vsc";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import NotesLogo from "../components/NotesLogo";
import { useGetOrientation } from "../utils/useGetOrientation";

interface Props {}

const Home: NextPage<Props> = ({}) => {
  const { orientation, height } = useGetOrientation();
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
        <Box
          fontFamily="Libre Baskerville"
          m={2}
          mt={height && height < 800 ? 0 : 10}
        >
          <Box fontSize={height && height < 800 ? 50 : [40, 60, 80, 100]}>
            <Text>ansel brandt</Text>
          </Box>
          <Box fontSize={[14, 14, 16, 20]} mt={height && height < 800 ? 0 : 4}>
            <Box m={2}>
              <Text>Typescript, React, Next.js, GraphQL</Text>
            </Box>
            <Box m={2}>
              <Text>Mapping, GIS, data wrangling</Text>
            </Box>
            <Box m={2}>
              <Text>Realtime data visualization</Text>
            </Box>
            <Box m={2}>
              <Text>IoT</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        mt={height && height < 800 ? 0 : 6}
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
      <Box display="flex" mt={height && height < 800 ? 0 : 10}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          m={4}
          onClick={() => router.push("/anselbrandt.pdf")}
          sx={{
            "&:hover": {
              color: "accent.fg",
              cursor: "pointer",
            },
          }}
        >
          <Box m={1}>
            <StyledOcticon icon={VscFilePdf} size={25} />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          m={4}
          onClick={() => router.push("https://github.com/anselbrandt")}
          sx={{
            "&:hover": {
              color: "accent.fg",
              cursor: "pointer",
            },
          }}
        >
          <Box m={1}>
            <StyledOcticon icon={MarkGithubIcon} size={25} />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          m={4}
          onClick={() => router.push("https://www.linkedin.com/in/anselbrandt")}
          sx={{
            "&:hover": {
              color: "accent.fg",
              cursor: "pointer",
            },
          }}
        >
          <Box m={1}>
            <StyledOcticon icon={AiOutlineLinkedin} size={25} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
