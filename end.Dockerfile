FROM node:14-alpine as builder

WORKDIR /code

RUN npm install pnpm -g

ADD ./UNO-server/package.json ./UNO-server/pnpm-lock.yaml /code/
RUN pnpm i

ADD ./UNO-server /code/
RUN pnpm build 

CMD node ./dist/index.js
