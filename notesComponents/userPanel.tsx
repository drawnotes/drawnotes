import { MarkGithubIcon, SignOutIcon } from "@primer/octicons-react";
import {
  Avatar,
  Box,
  Header,
  Heading,
  StyledOcticon,
  Text,
} from "@primer/react";
import type { NextPage } from "next";
import Image from "next/image";
import { Resizable } from "re-resizable";
import { ReactNode } from "react";
import { User } from "../types";

interface Props {
  children?: ReactNode;
  user: User | undefined;
}

const UserPanel: NextPage<Props> = ({ children, user }) => {
  return (
    <Resizable
      defaultSize={{
        width: 300,
        height: "100%",
      }}
      minWidth={150}
      maxWidth={800}
    >
      <Box
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.default"
        backgroundColor="canvas.subtle"
        height="100%"
        width="100%"
        overflow={"scroll"}
        color="fg.default"
      >
        <Box
          borderStyle="solid"
          borderColor="border.default"
          borderWidth={0}
          borderBottomWidth={1}
          p={3}
          color="fg.muted"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Heading sx={{ fontSize: 1 }}>User</Heading>
        </Box>
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {user?.isLoggedIn ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box m={3}>
                <Avatar src={user.avatar} size={100} />
              </Box>
              <Box m={3}>Signed in as</Box>
              <Box mb={3}>
                <Text fontWeight="bold">{user.login}</Text>
              </Box>
              <Box m={3}>
                <Header>
                  <Header.Item>
                    <Header.Link href="/api/logout">
                      <Box display="flex">
                        <Box mr={2}>
                          <StyledOcticon icon={SignOutIcon} />
                        </Box>
                        <Box>Logout</Box>
                      </Box>
                    </Header.Link>
                  </Header.Item>
                </Header>
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box m={3}>
                <Image
                  src="/assets/Developer_identity.svg"
                  height={100}
                  width={100}
                />
              </Box>
              <Box m={3}>Login to connect to a repository.</Box>
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
          )}
        </Box>
      </Box>
    </Resizable>
  );
};

export default UserPanel;
