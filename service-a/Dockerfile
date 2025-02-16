FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


RUN npm install -g @nestjs/cli
RUN npm install --save-dev @types/node

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
