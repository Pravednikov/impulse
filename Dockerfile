FROM node:20.8.1-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20.8.1-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json .
RUN npm ci --omit=dev
CMD ["node", "./dist/main.js"]
