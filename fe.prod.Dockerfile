FROM node:14-alpine as builder

WORKDIR /code

RUN npm install pnpm -g

ADD ./UNO-client/package.json ./UNO-client/pnpm-lock.yaml /code/
RUN pnpm i

ADD ./UNO-client /code/
RUN pnpm build

FROM nginx:alpine
ADD nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/dist /usr/share/nginx/html
