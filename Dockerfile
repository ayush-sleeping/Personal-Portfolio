# syntax=docker/dockerfile:1
#
# Local development and preview in Docker (README, "Docker"). Not used for deploying: GitHub Pages
# serves the static out/ folder, built by CI. Two targets, run through compose.yaml:
#
#   dev      next dev with the repo bind-mounted, so edits reload live   -> http://localhost:7300/
#   preview  the static export served under basePath, like GitHub Pages  -> http://localhost:7301/Personal-Portfolio/

FROM node:22-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci

# The source comes from the bind mount in compose.yaml; node_modules stays the image's (Linux) copy.
FROM deps AS dev
EXPOSE 7300
CMD ["npm", "run", "dev"]

# `npm run build` validates the content JSON first (prebuild), then exports to out/.
FROM deps AS build
COPY . .
RUN npm run build

# Just the exported files and the dependency-free static server.
FROM node:22-alpine AS preview
WORKDIR /app
COPY scripts/serve.mjs scripts/serve.mjs
COPY --from=build /app/out out
EXPOSE 7301
CMD ["node", "scripts/serve.mjs", "--dir", "out", "--base", "/Personal-Portfolio", "--port", "7301"]
