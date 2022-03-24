import { Box, BoxProps } from "@primer/react";
import { FunctionComponent } from "react";

type NavbarProps = {} & BoxProps;

export const Navbar: FunctionComponent<NavbarProps> = ({
  children,
  ...props
}) => {
  return (
    <Box {...props} width="100%">
      {children}
    </Box>
  );
};

type NavbarLinksProps = {} & BoxProps;

export const NavbarLinks: FunctionComponent<NavbarLinksProps> = ({
  children,
  ...props
}) => {
  return (
    <Box {...props} display="flex" justifyContent="space-between" width="100%">
      {children}
    </Box>
  );
};

type NavbarLinkProps = {
  selected?: boolean;
} & BoxProps;

export const NavbarLink: FunctionComponent<NavbarLinkProps> = ({
  selected = false,
  children,
  ...props
}) => {
  return (
    <Box
      bg={selected ? "accent.emphasis" : "canvas.subtle"}
      color={selected ? "fg.onEmphasis" : "accent.fg"}
      width="100%"
      p={2}
      textAlign="center"
      borderColor="border.default"
      borderWidth={1}
      borderStyle="solid"
      {...props}
    >
      {children}
    </Box>
  );
};
