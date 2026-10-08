FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* values at build time. Relative URLs let nginx (see nginx.conf)
# proxy to the API, so the same build works on localhost and on the public tunnel URL.
ARG VITE_API_BASE_URL=/api
ARG VITE_HUB_URL=/hubs/notifications
ARG VITE_AGENT_BASE_URL=/agent
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_HUB_URL=$VITE_HUB_URL \
    VITE_AGENT_BASE_URL=$VITE_AGENT_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
