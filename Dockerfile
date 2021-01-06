# build env
FROM node:13.12.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache git
RUN npm ci
COPY . ./
RUN npm run build

# production env
FROM nginx:1.17.8-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
