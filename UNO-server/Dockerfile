FROM node:14-alpine as builder

WORKDIR /code

RUN npm config set registry https://registry.npm.taobao.org -g && npm install pnpm -g && npm install forever -g

ADD package.json pnpm-lock.yaml /code/
RUN pnpm i

ADD . /code/
RUN pnpm docker-deploy
