FROM node:20.16.0 as angular

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=angular /app/docs /usr/share/nginx/html/sorteador