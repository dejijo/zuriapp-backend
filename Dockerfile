FROM node:22-alpine
RUN npm install -g npm@11

RUN npm pack undici@6.29.1 --pack-destination /tmp \
    && mkdir -p /tmp/undici-patched \
    && tar -xzf /tmp/undici-6.29.1.tgz \
       --strip-components=1 -C /tmp/undici-patched \
    && cp -a /tmp/undici-patched/. \
       /usr/local/lib/node_modules/npm/node_modules/undici/ \
    && rm -rf /tmp/undici-patched /tmp/undici-6.29.1.tgz \
    && node -p "require('/usr/local/lib/node_modules/npm/node_modules/undici/package.json').version"

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server.js ./
COPY data ./data

USER node

EXPOSE 5000

CMD ["npm", "start"]
