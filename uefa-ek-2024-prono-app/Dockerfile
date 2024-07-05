ARG NGINX_VERSION="1.17.6"
ARG NODE_VERSION="20.12.2-alpine"

FROM node:$NODE_VERSION as build

WORKDIR /app
COPY . .

ARG NPM_REGISTRY=" https://registry.npmjs.org"

RUN npm install && \
    npm run build

FROM nginx:alpine AS runtime


COPY  --from=build /app/dist/uefa-ek-2024-prono-app/browser/ /usr/share/nginx/html/

RUN chmod a+rwx /var/cache/nginx /var/run /var/log/nginx                        && \
    sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf && \
    sed -i.bak -E 's|^(\s*index  index.html index.htm;.*)|\1\n\ttry_files $uri $uri/ /index.html =404;|' /etc/nginx/conf.d/default.conf && \
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf


EXPOSE 8080

USER nginx

HEALTHCHECK     CMD     [ "service", "nginx", "status" ]docker 