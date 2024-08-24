FROM node:20.16.0 AS angular

WORKDIR /app

# Copiar apenas os arquivos necessários para o npm install
COPY package*.json ./

RUN npm install --silent && npm cache clean --force

# Copiar o restante do código
COPY . .

# Rodar a build de produção
RUN npm run build -- --configuration=production

# Utilizar a versão 'alpine' para uma imagem mais leve
FROM nginx:alpine

# Copiar os arquivos construídos para o diretório padrão do Nginx
COPY --from=angular /app/docs /usr/share/nginx/html/sorteador

# docker build . -t angular-sorteador
# docker run -p 4200:80 angular-sorteador
