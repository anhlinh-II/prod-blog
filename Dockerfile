FROM node:24-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:24-alpine

WORKDIR /app
COPY --from=build /app ./

# Update Alpine packages to reduce vulnerabilities
RUN apk update && apk upgrade

EXPOSE 3000
CMD ["npm", "start"]