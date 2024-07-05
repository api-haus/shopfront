FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && pnpm i -g pnpm@9.4.0

#COPY . /app
COPY ["package.json", "pnpm-lock.yaml", "./"]
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS runtime

ENV NODE_ENV=production
ENV NODE_OPTIONS="--enable-source-maps"
EXPOSE 8080

FROM runtime AS serve
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

CMD [ "pnpm", "bin:serve" ]

FROM runtime AS cron
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

CMD [ "pnpm", "bin:cron" ]

