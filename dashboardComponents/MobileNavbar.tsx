import {
  FilterIcon,
  GlobeIcon,
  GraphIcon,
  MoonIcon,
  SunIcon,
  TerminalIcon,
} from "@primer/octicons-react";
import { StyledOcticon } from "@primer/react";
import { FunctionComponent } from "react";
import { Navbar, NavbarLink, NavbarLinks } from "../components/Navbar";

interface Props {
  selected: string;
  handleSetSelected: (view: string) => void;
  colorMode: string;
}

export const MobileNavbar: FunctionComponent<Props> = ({
  selected,
  handleSetSelected,
  colorMode,
}) => {
  return (
    <Navbar aria-label="Main">
      <NavbarLinks>
        <NavbarLink
          selected={selected === "map"}
          onClick={() => handleSetSelected("map")}
        >
          <StyledOcticon size={20} icon={GlobeIcon} />
        </NavbarLink>
        <NavbarLink
          selected={selected === "filters"}
          onClick={() => handleSetSelected("filters")}
        >
          <StyledOcticon size={20} icon={FilterIcon} />
        </NavbarLink>
        <NavbarLink
          selected={selected === "charts"}
          onClick={() => handleSetSelected("charts")}
        >
          <StyledOcticon size={20} icon={GraphIcon} />
        </NavbarLink>
        <NavbarLink
          selected={selected === "logs"}
          onClick={() => handleSetSelected("logs")}
        >
          <StyledOcticon size={20} icon={TerminalIcon} />
        </NavbarLink>
        <NavbarLink
          selected={selected === "preferences"}
          onClick={() => handleSetSelected("preferences")}
        >
          <StyledOcticon
            size={20}
            icon={colorMode === "night" ? MoonIcon : SunIcon}
          />
        </NavbarLink>
      </NavbarLinks>
    </Navbar>
  );
};
