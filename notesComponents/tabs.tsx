import {
  FileDirectoryIcon,
  GitBranchIcon,
  PersonIcon,
  SearchIcon,
  ToolsIcon,
} from "@primer/octicons-react";
import { Box } from "@primer/react";
import type { NextPage } from "next";
import ColorModeIcon from "../components/ColorModeIcon";
import IconPair from "../components/IconPair";
import SideNav from "../components/SideNav";
import { useGetBreakpoint } from "../utils/useGetBreakpoint";

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
  const { breakpoint, width } = useGetBreakpoint();

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
          onClick={() => handleSelectedTab("search")}
          selected={selectedTab === "search"}
        >
          <IconPair size={size} icon={SearchIcon} />
        </SideNav.Link>
        <SideNav.Link
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
          onClick={() => handleSelectedTab("settings")}
          selected={selectedTab === "settings"}
        >
          <IconPair size={size} icon={ToolsIcon} />
        </SideNav.Link>
        <SideNav.Link
          onClick={() => handleSelectedTab("user")}
          selected={selectedTab === "user"}
        >
          <IconPair size={size} icon={PersonIcon} />
        </SideNav.Link>
      </SideNav>
      {breakpoint < 2 && <ColorModeIcon />}
    </Box>
  );
};

export default Tabs;
