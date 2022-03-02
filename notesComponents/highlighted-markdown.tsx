import { useTheme } from "@primer/react";
import hljs from "highlight.js";
import Markdown from "markdown-to-jsx";
import { useEffect, useRef } from "react";
import useGetClasses from "../utils/useGetClasses";

interface HighlightedMarkdownProps {
  children: string;
}

function HighlightedMarkdown({ children }: HighlightedMarkdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { colorScheme } = useTheme();
  const theme = colorScheme!.includes("dark") ? "dark" : "light";
  const { classes } = useGetClasses(theme);

  useEffect(() => {
    rootRef.current!.querySelectorAll("pre code").forEach((element: any) => {
      hljs.highlightElement(element);
    });
  }, [children]);

  return (
    <div ref={rootRef}>
      <Markdown className={theme === "dark" ? classes.dark : classes.light}>
        {children}
      </Markdown>
    </div>
  );
}

export default HighlightedMarkdown;
