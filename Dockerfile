FROM node:14-alpine as builder

WORKDIR /code

RUN npm install pnpm -g

ADD package.json pnpm-lock.yaml /code/
RUN pnpm i

ADD . /code/
RUN pnpm build



FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/dist /usr/share/nginx/html
