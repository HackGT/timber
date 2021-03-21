# Build container
FROM node:12-alpine AS build

WORKDIR /usr/src/timber/
COPY . /usr/src/timber/

RUN yarn install && yarn build

# Runtime container
FROM node:12-alpine

COPY --from=build /usr/src/timber/server/ /usr/src/timber/server/
COPY --from=build /usr/src/timber/client/ /usr/src/timber/client/

WORKDIR /usr/src/timber/server/

EXPOSE 3000
CMD ["yarn", "start-migrate"]
