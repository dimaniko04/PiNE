FROM node:18 AS server-build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18
WORKDIR /app
COPY --from=server-build /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/index.js"]
