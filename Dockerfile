# build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# just for testing, you can remove it later
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]