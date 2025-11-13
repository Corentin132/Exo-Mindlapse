# Admin Dashboard

pnpm workspaces monorepo composed of:

- **apps/front** – React app built with TypeScript and Vite (Vitest, Testing Library, ESLint)
- **apps/api** – AdonisJS 6 API using Kysely with PostgreSQL (Japa, ESLint)
- **packages/** – shared libraries (`shared-ui`, `types`)

## 🚀 Quick start

### Prerequisites

- Node.js >= 22
- pnpm >= 8
- Docker & Docker Compose

### Install dependencies

```bash
pnpm install
```
## Make sure to use .env.example as .env file  ! 
```bash 
cp ./.env.example ./.env 
```

### Run with Docker Compose

```bash
docker compose up --build
```

### Local development (without Docker)

```bash
# Frontend (port 3000)
pnpm front:dev

# Backend (port 3333)
pnpm api:dev
```

## 📦 Repository layout

```text
admin-dashboard/
├── apps/
│   ├── front/              # React  (Vite)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/                # AdonisJS API (Japa)
│       ├── app/
│       ├── config/
│       ├── database/
│       ├── start/
│       ├── tests/
│       ├── Dockerfile
│       └── package.json
├── packages/
│   ├── shared-ui/          # Shared UI components (MUI)
│   │   ├── components/
│   │   └── theme/
│   └── types/              # Shared TypeScript types
│       └── src/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
└── README.md
```

## 🧪 Tests

```bash
# Frontend tests
pnpm front:test

# API tests (Japa)
pnpm --filter api test
```

## 🔍 Linting

```bash
# Frontend lint
pnpm front:lint

# API lint
pnpm api:lint
```

## 🌐 Local endpoints

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3333](http://localhost:3333)
- **PostgreSQL**: `localhost:5432`

## 🗄️ Database credentials

Default PostgreSQL configuration:

- **User**: admin
- **Password**: admin123
- **Database**: admin_dashboard
- **Port**: 5432

## 📝 Available scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services with Docker Compose |
| `pnpm dev:build` | Rebuild images then start all services |
| `pnpm down` | Stop Docker services |
| `pnpm down:clean` | Stop Docker services and remove volumes |
| `pnpm front:dev` | Run the frontend in dev mode |
| `pnpm front:build` | Build the frontend |
| `pnpm front:test` | Run frontend tests |
| `pnpm front:lint` | Lint the frontend |
| `pnpm api:dev` | Run the API in dev mode |
| `pnpm api:build` | Build the API |
| `pnpm api:test` | Run API tests |
| `pnpm api:lint` | Lint the API |

## 🛠️ Tech stack

### Frontend

- React 18
- TypeScript
- Vite
- ESLint
- Vitest + Testing Library

### Backend

- AdonisJS 6
- TypeScript
- Kysely + PostgreSQL
- Japa + @japa/api-client
- ESLint

### Database

- PostgreSQL 16

## 📄 License

MIT
