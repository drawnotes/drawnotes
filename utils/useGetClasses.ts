import { createUseStyles } from "react-jss";

export default function useGetClasses(theme: string) {
  const styles = (theme: string) => {
    const styleGenerator = (theme: string) => {
      const darkTheme = theme === "dark";
      const color = darkTheme ? "#c9d1d9" : "#24292f";
      const linkColor = darkTheme ? "#58a6ff" : "#0969da";
      const bgColor = darkTheme ? "#161b22" : "#f6f8fa";
      const borderColor = darkTheme ? "#30363d" : "#d0d7de";
      return {
        "& a": {
          color: linkColor,
        },
        "& a:hover": {
          textDecoration: "underline",
        },
        "& pre": {
          backgroundColor: bgColor,
          padding: "1rem",
          overflow: "scroll",
        },
        "& table": {
          padding: "1rem",
          border: "1px solid",
          borderColor: borderColor,
          marginBottom: "1rem",
        },
        "& th": {
          padding: ".5rem",
          border: "1px solid",
          borderColor: borderColor,
        },
        "& td": {
          padding: ".5rem",
          border: "1px solid",
          borderColor: borderColor,
        },
        "& tr:nth-child(2)": {
          backgroundColor: bgColor,
        },
        "& .hljs": {
          color: color,
          backgroundColor: bgColor,
        },
        "& .hljs-doctag, .hljs-keyword, .hljs-meta .hljs-keyword, .hljs-template-tag, .hljs-template-variable, .hljs-type,.hljs-variable.language_":
          {
            color: darkTheme ? "#ff7b72" : "#d73a49",
          },
        "& .hljs-title, .hljs-title.class_, .hljs-title.class_.inherited__, .hljs-title.function_":
          {
            color: darkTheme ? "#d2a8ff" : "#6f42c1",
          },
        "& .hljs-attr, .hljs-attribute, .hljs-literal, .hljs-meta, .hljs-number, .hljs-operator, .hljs-variable, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-id":
          {
            color: darkTheme ? "#79c0ff" : "#005cc5",
          },
        "& .hljs-regexp, .hljs-string, .hljs-meta .hljs-string": {
          color: darkTheme ? "#a5d6ff" : "#032f62",
        },
        "& .hljs-built_in, .hljs-symbol": {
          color: darkTheme ? "#ffa657" : "#e36209",
        },
        "& .hljs-comment, .hljs-code, .hljs-formula": {
          color: darkTheme ? "#8b949e" : "#6a737d",
        },
        "& .hljs-name, .hljs-quote, .hljs-selector-tag, .hljs-selector-pseudo":
          {
            color: darkTheme ? "#7ee787" : "#22863a",
          },
        "& .hljs-subst": { color: darkTheme ? "#c9d1d9" : "#24292e" },
        "& .hljs-section": {
          color: darkTheme ? "#1f6feb" : "#005cc5",
          "font-weight": "bold",
        },
        "& .hljs-bullet": { color: darkTheme ? "#f2cc60" : "#735c0f" },
        "& .hljs-emphasis": {
          color: darkTheme ? "#c9d1d9" : "#24292e",
          "font-style": "italic",
        },
        "& .hljs-strong": {
          color: darkTheme ? "#c9d1d9" : "#24292e",
          "font-weight": "bold",
        },
        "& .hljs-addition": {
          color: darkTheme ? "#aff5b4" : "#22863a",
          "background-color": "#f0fff4",
        },
        "& .hljs-deletion": {
          color: darkTheme ? "#ffdcd7" : "#b31d28",
          "background-color": "#ffeef0",
        },
        "& img": {
          width: "100%",
        },
        "& img[alt='excalidraw-svg']": {
          filter: darkTheme ? "invert(1)" : "invert(0)",
        },
      };
    };
    const darkStyles = styleGenerator("dark");
    const lightStyles = styleGenerator("light");
    return {
      dark: darkStyles,
      light: lightStyles,
    };
  };

  const useStyles = createUseStyles(styles(theme));

  const classes = useStyles();

  return { classes };
}
