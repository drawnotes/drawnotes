export const getRepoName = (url: string) => {
  const parsedUrl = new URL(url);
  const splitUrl = parsedUrl.pathname.split("/");
  return splitUrl[splitUrl.length - 1];
};
