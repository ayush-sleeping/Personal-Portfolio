# syntax=docker/dockerfile:1
#
# Local development and preview in Docker (README, "Docker"). Not used for deploying: GitHub Pages
# serves the static out/ folder, built by CI. Two targets, run through compose.yaml:
#
#   dev      next dev with the repo bind-mounted, so edits reload live   -> http://localhost:7300/
#   preview  the static export served under basePath, like GitHub Pages  -> http://localhost:7301/Personal-Portfolio/
#
# The preview's URL prefix is the NEXT_PUBLIC_BASE_PATH build arg, read the same way as
# `npm run preview`: /Personal-Portfolio by default, "" for a root build served at
# http://localhost:7301/ (as after the rename to ayush-sleeping.github.io, task.md T9). It's baked
# into the export at build time, so it's a build arg, passed through by compose.yaml.

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
ARG NEXT_PUBLIC_BASE_PATH=/Personal-Portfolio
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
COPY . .
RUN npm run build

# Just the exported files and the dependency-free static server.
FROM node:22-alpine AS preview
ARG NEXT_PUBLIC_BASE_PATH=/Personal-Portfolio
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
WORKDIR /app
COPY scripts/serve.mjs scripts/serve.mjs
COPY --from=build /app/out out
EXPOSE 7301
# A shell, so the base comes from the variable (quoted: "" serves at the root); exec keeps node
# as PID 1 so `docker compose stop` reaches it.
CMD ["sh", "-c", "exec node scripts/serve.mjs --dir out --base \"$NEXT_PUBLIC_BASE_PATH\" --port 7301"]
