# ---- Build stage ----------------------------------------------------------
# The site is a fully static export, so the runtime image only needs the files
# produced in `out/`.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Root deploy: no base path inside the container.
ENV NEXT_PUBLIC_BASE_PATH=""
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runtime stage --------------------------------------------------------
FROM nginx:1.27-alpine AS runner
LABEL org.opencontainers.image.title="guia-licencia-web"
LABEL org.opencontainers.image.description="Guía de estudio del teórico del permiso B"
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
