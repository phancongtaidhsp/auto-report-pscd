FROM node:16.5.0
FROM ghcr.io/puppeteer/puppeteer:20.1.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
ENV NODE_ENV=production

USER root

COPY package*.json ./

RUN npm install -g @nestjs/cli@9.4.2

RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]