FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY scripts ./scripts

EXPOSE 4000

# On start: ensure tables exist, then run the API
CMD ["sh", "-c", "npx prisma db push && node src/server.js"]
