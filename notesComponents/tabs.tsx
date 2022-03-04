import {
  FileDirectoryIcon,
  GitBranchIcon,
  PersonIcon,
  SearchIcon,
  ToolsIcon,
} from "@primer/octicons-react";
import { Box, SideNav } from "@primer/react";
import type { NextPage } from "next";
import IconPair from "../components/IconPair";

interface Props {
  handleSelectedTab: (tab: string) => void;
  selectedTab: string;
  newFileCount?: number;
  pendingChangesCount?: number;
}

const Tabs: NextPage<Props> = ({
  handleSelectedTab,
  selectedTab,
  newFileCount,
  pendingChangesCount,
}: Props) => {
  const size = 20;

  return (
    <Box
      bg="canvas.subtle"
      borderColor="border.default"
      borderRightWidth={1}
      borderRightStyle="solid"
    >
      <SideNav>
        <SideNav.Link
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => handleSelectedTab("explorer")}
          selected={selectedTab === "explorer"}
        >
          <IconPair
            size={size}
            icon={FileDirectoryIcon}
            count={newFileCount && newFileCount > 0 ? newFileCount : undefined}
          />
        </SideNav.Link>
        <SideNav.Link
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => handleSelectedTab("search")}
          selected={selectedTab === "search"}
        >
          <IconPair size={size} icon={SearchIcon} />
        </SideNav.Link>
        <SideNav.Link
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => handleSelectedTab("git")}
          selected={selectedTab === "git"}
        >
          <IconPair
            size={size}
            icon={GitBranchIcon}
            count={
              pendingChangesCount && pendingChangesCount > 0
                ? pendingChangesCount
                : undefined
            }
          />
        </SideNav.Link>
        <SideNav.Link
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => handleSelectedTab("settings")}
          selected={selectedTab === "settings"}
        >
          <IconPair size={size} icon={ToolsIcon} />
        </SideNav.Link>
        <SideNav.Link
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => handleSelectedTab("user")}
          selected={selectedTab === "user"}
        >
          <IconPair size={size} icon={PersonIcon} />
        </SideNav.Link>
      </SideNav>
    </Box>
  );
};

export default Tabs;
