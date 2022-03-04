import { MarkGithubIcon } from "@primer/octicons-react";
import {
  Box,
  ButtonPrimary,
  Header,
  Heading,
  Link,
  StyledOcticon,
} from "@primer/react";
import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

interface Props {
  handleNewProject: () => void;
  handleOpenDemo: () => void;
}

const Blankslate: NextPage<Props> = ({ handleNewProject, handleOpenDemo }) => {
  const [show, setShow] = useState<boolean>(true);

  const handleClose = () => {
    handleOpenDemo();
    setShow(false);
  };

  const handleNewProjectClose = () => {
    handleNewProject();
    setShow(false);
  };
  return (
    <>
      {show && (
        <Box
          height="100%"
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderColor="border.default"
            borderWidth={1}
            borderStyle="solid"
            borderRadius={2}
            bg="canvas.subtle"
            p={[1, 1, 3, 3]}
            m={2}
            mt={[2, 2, "20%", "20%"]}
          >
            <Box>
              <Image src="/assets/Code_hosting.svg" height={150} width={150} />
            </Box>
            <Box color="fg.default" m={3}>
              <Heading sx={{ fontSize: 3 }}>Welcome to DrawNotes!</Heading>
            </Box>
            <Box
              color="fg.default"
              fontSize={2}
              width="75%"
              maxWidth={500}
              m={3}
            >
              Start a new project by creating or selecting a GitHub repo from
              the Settings tab, or log in and continue working on your last
              project.
            </Box>
            <Box m={2}>
              <ButtonPrimary onClick={handleNewProjectClose}>
                New Project
              </ButtonPrimary>
            </Box>
            <Box m={3}>
              <Link as="button" onClick={handleClose}>
                Explore Demo Project
              </Link>
            </Box>
            <Box m={3}>
              <Header>
                <Header.Item>
                  <Header.Link href="/api/login">
                    <Box display="flex">
                      <Box mr={2}>
                        <StyledOcticon icon={MarkGithubIcon} />
                      </Box>
                      <Box>Login with GitHub</Box>
                    </Box>
                  </Header.Link>
                </Header.Item>
              </Header>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Blankslate;
