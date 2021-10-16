FROM node:16 as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
RUN yarn install

COPY ./src ./src
RUN yarn build

FROM node:16-alpine

RUN apk add dumb-init

ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node package.json yarn.lock tsconfig.json ./

RUN yarn install --production

EXPOSE 3000
ENTRYPOINT [ "dumb-init", "--"]
CMD [ "node", "dist/main.js" ]
