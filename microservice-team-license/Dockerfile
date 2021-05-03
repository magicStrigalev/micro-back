FROM node:12

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 4030
EXPOSE 3030

CMD ["npm", "run", "start"]
