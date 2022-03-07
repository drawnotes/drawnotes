import { MoonIcon, SunIcon } from "@primer/octicons-react";
import { Box, Dialog, StyledOcticon, Text, useTheme } from "@primer/react";
import { ActionList } from "@primer/react/drafts";
import { useRef, useState } from "react";

function ColorModeIcon() {
  const anchorRef = useRef(null);
  const { setDayScheme, setNightScheme, colorScheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const setScheme = (schemeValue: string) => {
    if (schemeValue.includes("dark")) {
      document.cookie = `colorMode=night; samesite=strict; max-age=31536000`;
      document.cookie = `nightScheme=${schemeValue}; samesite=strict; max-age=31536000`;
    } else {
      document.cookie = `colorMode=day; samesite=strict; max-age=31536000`;
      document.cookie = `dayScheme=${schemeValue}; samesite=strict; max-age=31536000`;
    }
    setDayScheme(schemeValue);
    setNightScheme(schemeValue);
  };

  const schemes = [
    {
      name: "Light",
      value: "light",
      icon: SunIcon,
    },
    {
      name: "Light high contrast",
      value: "light_high_contrast",
      icon: SunIcon,
    },
    {
      name: "Dark",
      value: "dark",
      icon: MoonIcon,
    },
    {
      name: "Dark high contrast",
      value: "dark_high_contrast",
      icon: MoonIcon,
    },
    {
      name: "Dark Dimmed",
      value: "dark_dimmed",
      icon: MoonIcon,
    },
  ];

  const current = schemes.find((scheme) => scheme.value === colorScheme)!;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      borderStyle="solid"
      borderColor="border.default"
      bg="neutral.subtle"
      color="fg.default"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        ref={anchorRef}
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          "&:hover": {
            cursor: "pointer",
            bg: "neutral.muted",
          },
        }}
      >
        <Box my={3}>
          <StyledOcticon color="fg.default" icon={current.icon} size={20} />
        </Box>
      </Box>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        aria-labelledby="header-id"
      >
        <Box p={6} pt={10}>
          <ActionList selectionVariant="single">
            {schemes.map((scheme) => (
              <ActionList.Item
                key={scheme.value}
                onSelect={() => setScheme(scheme.value)}
                selected={colorScheme === scheme.value}
              >
                <Text fontSize={24}>{scheme.name}</Text>
              </ActionList.Item>
            ))}
          </ActionList>
        </Box>
      </Dialog>
    </Box>
  );
}

export default ColorModeIcon;
