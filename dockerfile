FROM node:12
WORKDIR /user/src/app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8000
CMD ["node", "dist/index.js"]
