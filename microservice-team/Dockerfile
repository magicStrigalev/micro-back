FROM node:12

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 4040
EXPOSE 3040

CMD ["npm", "run", "start"]
