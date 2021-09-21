FROM node:14 AS builder
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY src ./src/
COPY tsconfig.json ./
RUN yarn build

FROM public.ecr.aws/lambda/nodejs:14 AS runner
COPY --from=builder package.json yarn.lock ./
COPY --from=builder dist ./
RUN npx yarn install --frozen-lockfile --prod
