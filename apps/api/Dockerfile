FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de configuration pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Installer pnpm
RUN npm install -g pnpm

# Copier le backend
COPY apps/api ./apps/api

# Installer les dépendances
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api

EXPOSE 3333

CMD ["pnpm", "dev"]
