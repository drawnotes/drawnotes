import "@fontsource/libre-baskerville";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Box, StyledOcticon, Text, useTheme } from "@primer/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import ColorModeSwitcher from "../components/ColorModeSwitcher";

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
          <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <path
                d="M21.02 25.516a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-.025 6.986a1.5 1.5 0 11-3-.001 1.5 1.5 0 013 0zm.013-20.993a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-.006 6.99a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                fill="currentColor"
              />
              <path
                d="M27 45v6l-5-2-5 2v-6a2 2 0 012-2h6a2 2 0 012 2z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g
                opacity="1"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M13 47h-2c-.978 0-2-.982-2-2V7c0-1.018 1.022-2 2-2h34c.978 0 2 .982 2 2v38c0 1.018-1.022 2-2 2H31" />
                <path d="M9 41c0-1.215 1.043-2.114 2-2h34c1.085-.114 2-.952 2-2M14.1 6.074v31.868" />
              </g>
            </g>
          </svg>
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
