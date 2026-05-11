# build stage
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_SIGNUP_USE_MOCK=false
ARG VITE_SIGNUP_MOCK_CODE=246810

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SIGNUP_USE_MOCK=$VITE_SIGNUP_USE_MOCK
ENV VITE_SIGNUP_MOCK_CODE=$VITE_SIGNUP_MOCK_CODE

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]