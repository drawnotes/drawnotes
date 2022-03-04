# [Draw Notes](https://github.com/drawnotes/drawnotes) is a [Next.js](https://nextjs.org) based application for visual and text-based notes.

[Monaco Editor](https://microsoft.github.io/monaco-editor/) is used for Markdown and source code files, while [Excalidraw](https://excalidraw.com/) powers diagram sketching.

Excalidraw drawings are stored inside a standard SVG file as base64-encoded JSON metadata. This allows them to be previewed and used as normal, but means that only SVGs exported by Excalidraw can be opened in Excalidraw. An SVG import solution is [in development](https://github.com/excalidraw/svg-to-excalidraw)

Draw Notes is 100% stateless and all application data is only stored client-side. The virtual file system is persisted to IndexedDB, application state is saved to localStorage and user details are stored in an [encrypted cookie](https://github.com/vvo/iron-session)

GitHub is currently the only integrated storage solution, with Git operations done entirely in browser by [isomorphic-git](https://github.com/isomorphic-git/isomorphic-git)

**Bonus**

GeoJSON files can be previewed and will be rendered to canvas with [deck.gl](https://deck.gl)

CSV files can be previewed with basic filtering and sorting provided by [react-table](https://react-table.tanstack.com)

## Running Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
1. Build your container: `docker build -t nextjs-docker .`.
1. Run your container: `docker run -p 3000:3000 nextjs-docker`.

You can view your images created with `docker images`.

## Deploy to [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/drawnotes/drawnotes&project-name=drawnotes&repository-name=drawnotes)
