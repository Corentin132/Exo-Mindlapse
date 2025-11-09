FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de configuration pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Installer pnpm
RUN npm install -g pnpm

# Copier les packages
COPY apps/front ./apps/front

# Installer les dépendances
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/front

EXPOSE 3000

CMD ["pnpm", "dev"]
