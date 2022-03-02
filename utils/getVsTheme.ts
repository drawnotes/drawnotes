export const getVsTheme = (colorScheme: string | undefined) => {
  switch (colorScheme) {
    case "light":
      return "light";
    case "light_colorblind":
      return "light";
    case "dark":
      return "tomorrowNight";
    case "dark_colorblind":
      return "tomorrowNight";
    case "dark_high_contrast":
      return "tomorrowNightEighties";
    case "dark_dimmed":
      return "tomorrowNightEighties";
    default:
      return "light";
  }
};
