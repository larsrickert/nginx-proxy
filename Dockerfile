# build stage
FROM node:24 AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# install pnpm as defined in package.json
RUN corepack enable
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . ./
RUN pnpm build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
