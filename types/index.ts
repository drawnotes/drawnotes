export interface File {
  name: string;
  path: string;
  type: string;
  extension: string | null;
  files: File[] | [];
  depth: number;
}

export type User = {
  isLoggedIn: boolean;
  login: string;
  id: string;
  avatar: string;
  url: string;
  name: string;
  email: string;
  accessToken?: string;
};

export type githubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: null;
  bio: null;
  twitter_username: null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
  accessToken: string;
};

export interface VisibleLayers {
  vehicles: boolean;
  paths: boolean;
  metro: boolean;
  bus: boolean;
  stops: boolean;
  separated: boolean;
  shared: boolean;
  multiUse: boolean;
}
