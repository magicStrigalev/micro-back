FROM node:12

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 4020
EXPOSE 3020

CMD ["npm", "run", "start"]
