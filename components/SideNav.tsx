import { Box, BoxProps, useTheme } from "@primer/react";
import { FunctionComponent, ReactNode } from "react";

const SideNav: FunctionComponent<BoxProps> = (props) => {
  return (
    <Box {...props} display="inline-block">
      {props.children}
    </Box>
  );
};

interface SideNavLinkProps {
  props?: BoxProps;
  children?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

const SideNavLink: FunctionComponent<SideNavLinkProps> = ({
  props,
  children,
  selected,
  onClick,
}) => {
  const { colorScheme } = useTheme();
  const selectedColor =
    colorScheme && colorScheme.includes("dark")
      ? "rgb(247, 129, 102)"
      : "rgb(253, 140, 115)";
  return (
    <Box
      {...props}
      as="nav"
      p="15px"
      borderWidth={1}
      borderStyle="solid"
      borderColor="border.default"
      bg="neutral.subtle"
      color="fg.default"
      borderLeftColor={selected ? selectedColor : "border.default"}
      borderLeftWidth={selected ? 3 : 1}
      onClick={onClick}
      sx={{
        "&:hover": {
          cursor: "pointer",
          bg: "neutral.muted",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default Object.assign(SideNav, { Link: SideNavLink });
