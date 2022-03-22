import jsdom from "jsdom";

export const filter = (html: string) => {
  return html
    .toString()
    .replace(
      /<head([\s\S]*?)<\/head>/g,
      '<head><meta charset="UTF-8" /></head>'
    )
    .replace(/<script([\s\S]*?)<\/script>/g, "")
    .replace(/<style([\s\S]*?)<\/style>/g, "")
    .replace(/<header([\s\S]*?)<\/header>/g, "")
    .replace(/<textarea([\s\S]*?)<\/textarea>/g, "")
    .replace(/<footer([\s\S]*?)<\/footer>/g, "")
    .replace(/class="([\s\S]*?)"/g, "")
    .replace(/class="([\s\S]*?)"/g, "")
    .replace(/�/g, "-")
    .replace(/- -/g, "-");
};

const trim = (str: string) => {
  let trimmed = str;
  if (trimmed.substring(0, 2) === " -") {
    trimmed = trimmed.slice(2);
  }
  if (trimmed.substring(trimmed.length - 2, trimmed.length) === "- ") {
    trimmed = trimmed.slice(0, trimmed.length - 2);
  }
  return trimmed;
};

export const parse = (html: string) => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const links = document.querySelectorAll("a");
  const linksArray = Array.from(links);
  const results = linksArray.filter((el) => el.href.includes("/url?q="));
  const linksSet = new Set();
  const resultLinks = results
    .filter((el) => el.parentElement?.childElementCount === 1)
    .map((el) => {
      const href = decodeURIComponent(el.href.replace("/url?q=", "")).split(
        "&"
      )[0];
      const hostname = new URL(href).hostname;
      const source = hostname.replace("www.", "");
      const title = el.textContent
        ?.replace(/[\n\r]+|[\s]{2,}/g, " ")
        .replace(/[\n\r]+|[\s]{2,}/g, " ")
        .trim()
        .replace(hostname, "");
      const blurb = trim(
        el.parentElement?.parentElement?.textContent
          ?.replace(/[\n\r]+|[\s]{2,}/g, " ")
          .replace(/[\n\r]+|[\s]{2,}/g, " ")
          .trim()!
      )
        .replace(hostname, "")
        .replace(title!, "");
      return { href, title, blurb, source };
    })
    .filter((link) => {
      const exists = linksSet.has(link.href);
      if (exists) {
        return false;
      } else {
        linksSet.add(link.href);
        return true;
      }
    })
    .filter((link) => link.blurb)
    .filter(
      (link) => !(link.href.includes("wikipedia") && link.href.includes("#"))
    );
  return resultLinks;
};
