FROM node:14-alpine as builder

WORKDIR /code

RUN npm install pnpm -g

ADD package.json pnpm-lock.yaml /code/
RUN pnpm i

ADD . /code/
RUN pnpm build 

CMD node index.js
