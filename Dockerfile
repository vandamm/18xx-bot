FROM node:16@sha256:d6a8cd069ab740759394a9338dc4bc4b9b32b15209cccd0c7faa32d438b1076e as base

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
RUN yarn install

COPY ./src ./src
RUN yarn build

FROM node:16-alpine@sha256:417b3856d2e5d06385123f3924c36f5735fb1f690289ca69f2ac9c35fd06c009 as prod

RUN apk add dumb-init

ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --chown=node:node --from=base /usr/src/app/dist ./dist
COPY --chown=node:node package.json yarn.lock tsconfig.json ./

RUN yarn install --production

EXPOSE 3000
ENTRYPOINT [ "dumb-init", "--"]
CMD [ "node", "dist/main.js" ]
