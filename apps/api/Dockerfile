# syntax=docker/dockerfile:1
FROM node:26-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g --allow-scripts=pnpm pnpm@12.16.1 && pnpm --version

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version ./
COPY apps/api/package.json apps/api/
COPY apps/mobile/package.json apps/mobile/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --prod --filter @kaw/api...

COPY apps/api/src apps/api/src
COPY packages/shared/src packages/shared/src

USER node
EXPOSE 3000
CMD ["node", "apps/api/src/server.ts"]