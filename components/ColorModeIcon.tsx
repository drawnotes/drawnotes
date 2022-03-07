import { MoonIcon, SunIcon } from "@primer/octicons-react";
import {
  Box,
  ButtonInvisible,
  SelectMenu,
  StyledOcticon,
  useTheme,
} from "@primer/react";

function ColorModeIcon() {
  const { setDayScheme, setNightScheme, colorScheme } = useTheme();

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
      name: "Light colorblind",
      value: "light_colorblind",
      icon: SunIcon,
    },
    {
      name: "Dark",
      value: "dark",
      icon: MoonIcon,
    },
    {
      name: "Dark colorblind",
      value: "dark_colorblind",
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
      borderWidth={1}
      borderStyle="solid"
      borderColor="border.default"
      bg="neutral.subtle"
      color="fg.default"
      sx={{
        "&:hover": {
          cursor: "pointer",
          bg: "neutral.muted",
        },
      }}
    >
      <SelectMenu>
        <ButtonInvisible as="summary" variant="small">
          <Box my={2}>
            <StyledOcticon color="fg.default" icon={current.icon} size={20} />
          </Box>
        </ButtonInvisible>
        <Box position="absolute" top="25%" left="10%">
          <SelectMenu.Modal>
            <SelectMenu.List>
              {schemes.map((scheme) => (
                <SelectMenu.Item
                  key={scheme.value}
                  selected={scheme.value === colorScheme}
                  onClick={() => setScheme(scheme.value)}
                >
                  {scheme.name}
                </SelectMenu.Item>
              ))}
            </SelectMenu.List>
          </SelectMenu.Modal>
        </Box>
      </SelectMenu>
    </Box>
  );
}

export default ColorModeIcon;
