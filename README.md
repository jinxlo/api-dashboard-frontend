# Atlas AI Platform

Atlas AI Platform is a secure multi-tenant developer dashboard for provisioning and managing access to a large language model. It provides self-service account creation, API key management powered by Kong Gateway, a chat-style playground, and profile controls built on Next.js 15.

## Features

- 🔐 Authentication with NextAuth.js credentials provider and Prisma adapter
- 🔑 API key lifecycle management integrated with the Kong Admin API
- 💬 Interactive LLM playground backed by a platform-level evaluation key
- 👤 Profile and password management with inline validation
- 📊 Responsive dashboard with usage cards and API key table

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
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXT_PUBLIC_KONG_API_URL="http://localhost:8000"
KONG_ADMIN_API_URL="http://localhost:8001"
KONG_PLAYGROUND_KEY="replace-with-eval-api-key"
```

## Database

Run the Prisma migrations to create the authentication schema:

```bash
npx prisma migrate deploy
```

Generate the Prisma client:

```bash
npx prisma generate
```

If you are in an offline environment you can bypass engine checksum checks with `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the application. Create an account via the sign up page, then access the dashboard, playground, and settings areas.

## Kong Integration

The application expects Kong to manage API keys via the Key Authentication plugin. The `/api/keys` API route will:

1. Ensure a consumer exists for the logged-in user (using the user ID as `custom_id`).
2. Create new key credentials via `POST /consumers/{consumer}/key-auth`.
3. Return generated keys directly to the client without persisting them.

Revoking a key issues `DELETE /consumers/{consumer}/key-auth/{keyId}`. The dashboard lists available keys by calling the Kong Admin API.

## Testing the Playground

The playground proxy (`/api/playground/chat`) forwards prompts to the public Kong gateway using the `KONG_PLAYGROUND_KEY`. This isolates evaluation traffic from production API keys.

## Security Considerations

- Full API keys are never stored in the application database.
- All protected routes, including API endpoints, are guarded by NextAuth middleware.
- Passwords are hashed with `bcrypt` before persistence.

## License

This project is provided for demonstration purposes.
