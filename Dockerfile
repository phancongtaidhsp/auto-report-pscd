FROM ghcr.io/puppeteer/puppeteer:20.1.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY . .
RUN npm run install
COPY . .

CMD ["npm", "run", "start:prod"]