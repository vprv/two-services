FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies, если NODE_ENV не равен production)
RUN npm install

# Устанавливаем Nest CLI глобально, чтобы команда "nest" была доступна
RUN npm install -g @nestjs/cli
RUN npm install --save-dev @types/node


COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]
