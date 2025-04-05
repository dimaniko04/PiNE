FROM node:18-alpine AS client-build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=client-build /app/dist ./dist

RUN npm i -g serve

EXPOSE 3000
CMD [ "serve", "-s", "dist" ]