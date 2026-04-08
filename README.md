# BuggyBank

BuggyBank es una app full-stack de banca simulada diseñada para practicar testing manual y automation en un entorno controlado.

La app incluye bugs intencionales (frontend, backend e integración) con fines educativos.

## Stack técnico

- Next.js (App Router)
- TypeScript (strict)
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod
- Playwright (smoke e2e)

## Requisitos previos

- Node.js 20+
- npm 10+
- Una base PostgreSQL accesible (Neon, Supabase, Vercel Postgres, Railway, etc.)

Verificación rápida:

```bash
node -v
npm -v
```

## Instalación local

1. Instalar dependencias:

```bash
npm run install:deps
```

2. Crear `.env`:

```bash
cp .env.example .env
```

3. Editar `.env` y completar `DATABASE_URL` con tu Postgres.

Ejemplo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/buggybank?sslmode=require"
NEXT_PUBLIC_ENABLE_QA_MODE=true
NEXT_PUBLIC_BUG_WEAK_VALIDATION=true
NEXT_PUBLIC_BUG_INCONSISTENT_ERRORS=true
NEXT_PUBLIC_BUG_DOUBLE_SUBMIT=true
NEXT_PUBLIC_BUG_STALE_DASHBOARD_BALANCE=true
NEXT_PUBLIC_BUG_HISTORY_ORDER=true
NEXT_PUBLIC_BUG_BROKEN_FILTER=true
NEXT_PUBLIC_BUG_INCONSISTENT_DATES=true
NEXT_PUBLIC_BUG_EDGE_CASES=true
NEXT_PUBLIC_BUG_FAKE_DISABLED_BUTTON=true
```

## Prisma (schema + seed)

Aplicar esquema en la DB:

```bash
npm run db:migrate
```

Cargar seed:

```bash
npm run db:seed
```

Flujo completo:

```bash
npm run setup
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abrir: [http://localhost:3000](http://localhost:3000)

## Ejecutar en modo producción local

```bash
npm run build
npm run start
```

## Deploy en Vercel

### 1) Conectar repo

- Push del proyecto a GitHub/GitLab/Bitbucket.
- Importar proyecto en Vercel.

### 2) Variables de entorno en Vercel

En `Project Settings > Environment Variables`, crear:

- `DATABASE_URL` (Postgres productiva o staging)
- `NEXT_PUBLIC_ENABLE_QA_MODE`
- `NEXT_PUBLIC_BUG_WEAK_VALIDATION`
- `NEXT_PUBLIC_BUG_INCONSISTENT_ERRORS`
- `NEXT_PUBLIC_BUG_DOUBLE_SUBMIT`
- `NEXT_PUBLIC_BUG_STALE_DASHBOARD_BALANCE`
- `NEXT_PUBLIC_BUG_HISTORY_ORDER`
- `NEXT_PUBLIC_BUG_BROKEN_FILTER`
- `NEXT_PUBLIC_BUG_INCONSISTENT_DATES`
- `NEXT_PUBLIC_BUG_EDGE_CASES`
- `NEXT_PUBLIC_BUG_FAKE_DISABLED_BUTTON`

### 3) Build y deploy

Vercel usará:

- `npm install`
- `npm run build` (incluye `prisma generate`)

### 4) Aplicar schema en la DB remota

Antes del primer uso, ejecutar contra la misma `DATABASE_URL`:

```bash
npm run db:push
npm run db:seed
```

Nota: para sandbox educativo `db push` es práctico; para pipelines productivos formales conviene estrategia de migraciones versionadas (`prisma migrate`).

## Usuarios de prueba (seed)

- `maria@buggybank.local / Pass1234`
- `diego@buggybank.local / Pass1234`
- `sofie@buggybank.local / Pass1234`

## Estructura básica

```text
buggybank/
├─ prisma/                  # schema y seed
├─ src/
│  ├─ app/                  # páginas y route handlers (/api)
│  ├─ components/           # UI, layout, QA
│  ├─ data/                 # catálogos configurables (hints)
│  ├─ lib/                  # auth, prisma, bugs engine
│  └─ config/               # configuración/flags
├─ tests/                   # Playwright
├─ BUG_CATALOG.md           # catálogo interno de bugs intencionales
└─ README.md
```

## QA Mode

QA Mode ayuda a pensar como tester sin spoilear el bug directamente:

- Toggle global visible
- Hints contextuales
- Tooltips sutiles
- Panel lateral de observaciones
- Hints progresivos por acciones del usuario

Hints configurables en:

- `src/data/qa-hints-catalog.ts`

## Bugs intencionales

BuggyBank contiene fallas sembradas deliberadamente para entrenamiento.

- Se activan/desactivan con flags (`NEXT_PUBLIC_BUG_*`)
- Lógica centralizada en `src/lib/bugs`
- Catálogo en [BUG_CATALOG.md](./BUG_CATALOG.md)

No usar este repositorio como base para un sistema financiero real en producción.
