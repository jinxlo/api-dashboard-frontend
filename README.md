# Atlas AI Platform

Atlas AI Platform is a secure multi-tenant developer dashboard for provisioning and managing access to a large language model. It provides self-service account creation, API key management powered by Kong Gateway, a chat-style playground, and profile controls built on Next.js 15.

## Features

- 🔐 Authentication with NextAuth.js credentials provider and Prisma adapter
- 🔑 API key lifecycle management integrated with the Kong Admin API, including model-scoped keys
- 💬 Multi-modal playground covering language, text-to-speech, and text-to-image previews
- 👤 Profile and password management with inline validation and graceful demo-mode messaging
- 📊 Redesigned dashboard with environment overview, model catalogue, and key analytics

## Tech Stack

- [Next.js 15 (App Router)](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/) inspired component primitives

## Prerequisites

- Node.js 18+
- PostgreSQL database instance
- Kong Gateway with admin API access

## Environment Variables

Create a `.env` file based on the provided `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aiplatform?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/aiplatform?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXT_PUBLIC_KONG_API_URL="http://localhost:8000"
KONG_ADMIN_API_URL="http://localhost:8001"
KONG_PLAYGROUND_KEY="replace-with-eval-api-key"
# Optional overrides for the demo login
# DEMO_USER_EMAIL="demo@atlas.ai"
# DEMO_USER_PASSWORD="AtlasDemo!2025"
# DEMO_USER_PASSWORD_HASH=""
# DEMO_USER_NAME="Atlas Demo"
# DEMO_USER_ID="demo-user"
# DEMO_DATA_DIR="/tmp/atlas-demo-data"
```

## Database

Run the Prisma migrations to create the authentication schema (required for account creation and profile editing):

```bash
npx prisma migrate deploy
```

Generate the Prisma client:

```bash
npx prisma generate
```

Seed the demo login (defaults to `demo@atlas.ai` / `AtlasDemo!2025` unless `DEMO_USER_*` variables are supplied):

```bash
npm run db:seed
```

If you are in an offline environment you can bypass engine checksum checks with `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the application. Create an account via the sign up page, then access the dashboard, playground, and settings areas.

The seeded demo credentials (`demo@atlas.ai` / `AtlasDemo!2025`) are always available after `npm run db:seed` unless you override them with `DEMO_USER_*` values.

If a database connection is not configured (for example in preview deployments), the application automatically falls back to the demo credentials so you can still explore the experience. Settings will surface deployment instructions until the database connection is in place. Set `DEMO_USER_PASSWORD_HASH` if you prefer to keep the password value private—when present the login form will prompt users to obtain the password from the environment instead of displaying it inline. Use `DEMO_DATA_DIR` to control where fallback demo data is persisted (defaults to `.data` locally and `/tmp/atlas-demo-data` on serverless platforms).

## Kong Integration

The application expects Kong to manage API keys via the Key Authentication plugin. The `/api/keys` API route will:

1. Ensure a consumer exists for the logged-in user (using the user ID as `custom_id`).
2. Create new key credentials via `POST /consumers/{consumer}/key-auth`.
3. Tag each key with the selected model scopes (`model:{id}`) so the dashboard can display access levels.

Revoking a key issues `DELETE /consumers/{consumer}/key-auth/{keyId}`. The dashboard lists available keys by calling the Kong Admin API. When `KONG_ADMIN_API_URL` is not present (for example in local demos) the application falls back to a filesystem-backed store (defaulting to `.data/demo-api-keys.json` locally and `/tmp/atlas-demo-data/demo-api-keys.json` on Vercel) so you can still exercise the UI without external dependencies. Override the directory with `DEMO_DATA_DIR` if you need a different location.

## Testing the Playground

- `/api/playground/chat` proxies requests to the language models using `KONG_PLAYGROUND_KEY` when configured and returns explanatory responses otherwise.
- `/api/playground/tts` generates synthetic audio previews so you can validate the UI before wiring in a production speech endpoint.
- `/api/playground/image` produces branded SVG placeholders to illustrate prompt outputs without invoking a real diffusion service.

## Security Considerations

- Full API keys are never stored in the application database.
- All protected routes, including API endpoints, are guarded by NextAuth middleware.
- Passwords are hashed with `bcrypt` before persistence.

## Deploying on Vercel with Supabase

1. **Create a Supabase project** – once the instance is ready, open **Project Settings → Database → Connection string** and copy both values under the `Node.js` tab:
   - Use the `Connection pooling` string (pgbouncer) for `DATABASE_URL`.
   - Use the `Direct connection` string for `DIRECT_URL` (Prisma migrations bypass the pooler).
2. **Add environment variables in Vercel** – configure the following for each environment (Preview/Production):
   - `DATABASE_URL` – Supabase connection pooling string with `?pgbouncer=true&connection_limit=1`.
   - `DIRECT_URL` – Supabase direct connection string (no pooling) for migrations and seeding.
   - `NEXTAUTH_URL` – e.g. `https://your-app.vercel.app`.
   - `NEXTAUTH_SECRET` – generate a strong random value so session tokens remain valid across deploys.
   - `KONG_ADMIN_API_URL`, `KONG_PLAYGROUND_KEY`, plus any `DEMO_USER_*` overrides or `DEMO_DATA_DIR` customizations you rely on.
   - (Optional) `SUPABASE_DB_URL` or `SUPABASE_PRISMA_URL` if you prefer to keep the original Supabase variable names; the app will map them automatically.
3. **Run migrations against Supabase** – pull the Vercel environment locally and execute Prisma with the direct string:
   ```bash
   vercel env pull .env.production.local
   DIRECT_URL=$(grep DIRECT_URL .env.production.local | cut -d'=' -f2-) \
   DATABASE_URL=$(grep DATABASE_URL .env.production.local | cut -d'=' -f2-) \
   npx prisma migrate deploy
   DIRECT_URL=$(grep DIRECT_URL .env.production.local | cut -d'=' -f2-) \
   DATABASE_URL=$(grep DATABASE_URL .env.production.local | cut -d'=' -f2-) \
   npm run db:seed
   ```
   The seed script provisions the demo login (`demo@atlas.ai` / `AtlasDemo!2025` by default) using the Supabase database.
4. **Deploy** – with the schema migrated and seed executed, run `vercel deploy`. The build pipeline already runs `prisma generate` so the Prisma client stays in sync even with cached installs.

After deployment you can log in with the seeded credentials or register new users; all data persists in Supabase.

## License

This project is provided for demonstration purposes.
