# LinkyForge 🔗

> Your developer identity, forged in one link.

LinkyForge is a full-stack developer profile platform — part Linktree, part portfolio, part public showcase. Create your profile, add your links, showcase your projects, and share everything at a single public URL.

**Live Demo → [linkyforge.vercel.app](https://linkyforge.vercel.app)**

---

## What it does

- **Custom public profile** at `/u/your-slug` — shareable, clean, yours
- **Link management** — add, reorder, toggle visibility, categorize by platform
- **Project showcase** — title, description, live URL, repo URL, tech stack, skill tags
- **Dashboard** — manage everything from a single settings-style interface
- **Themes** — profile theming support built into the schema

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma (with custom output path) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Manual JWT — httpOnly cookies + bcrypt |
| Validation | Zod |
| Testing | Vitest |
| Containerization | Docker + Docker Compose |
| CI | GitHub Actions |
| Deployment | Vercel + Neon |

---

## Architecture Decisions

**Manual JWT over Auth.js/Better Auth**
Chose to implement auth from scratch — bcrypt for password hashing, signed JWTs stored in httpOnly cookies. No framework magic, full understanding of every step. Easier to reason about, easier to debug.

**Server Actions over API Routes**
All data mutations go through Next.js server actions. Zod schemas validate input before anything touches the database. Same schema reused on both client (react-hook-form) and server — write once, validate on both ends.

**Prisma with custom output path**
Prisma client generated to `app/generated/prisma` to play nicely with Next.js module resolution and the new `prisma.config.ts` setup in Prisma v6.

**Multi-stage Docker build**
Dockerfile uses three stages — `deps`, `builder`, `runner` — keeping the final image lean. PostgreSQL runs alongside via Docker Compose with a healthcheck to ensure the DB is ready before the app starts.

---

## Running Locally

**Prerequisites:** Node.js 22+, PostgreSQL

```bash
# Clone the repo
git clone https://github.com/yourusername/linkyforge.git
cd linkyforge

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env

# Run database migrations
npx prisma migrate dev

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Running with Docker

```bash
# Copy env file and add your JWT_SECRET
cp .env.example .env

# Build and start everything (app + postgres)
docker compose up --build

# Stop
docker compose down

# Stop and wipe the database
docker compose down -v
```

The app will be available at [http://localhost:3000](http://localhost:3000)

> **Note:** Migrations run automatically on container start via `scripts/start.sh`

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/linkyforge
JWT_SECRET=your-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

---

## Running Tests

```bash
npm run test
```

Tests cover the core auth server actions — register and login — with Prisma and bcrypt fully mocked via Vitest. CI runs the same suite on every push via GitHub Actions.

---

## Project Structure

```
linkyforge/
├── app/
│   ├── (auth)/         # login, register pages
│   ├── dashboard/      # profile, links, projects management
│   ├── u/[slug]/       # public profile page
│   └── generated/      # prisma client output
├── actions/            # server actions (auth, profile, links, projects)
├── components/         # ui components
├── lib/                # db client, jwt helpers, session utils
├── prisma/             # schema, migrations, config
├── validations/        # zod schemas
├── scripts/            # docker startup script
└── __tests__/          # vitest test files
```

---

## CI/CD

- **CI** — GitHub Actions runs Vitest on every push to `main` and `dev`
- **CD** — Vercel auto-deploys on every merge to `main`

---

## Schema Overview

```
User ──── Profile ──── Link[]
                  └─── Project[] ──── ProjectSkill[] ──── Skill
```

- One user has one profile
- Profile owns all links and projects
- Projects connect to skills through a join table with optional skill level (BEGINNER / INTERMEDIATE / ADVANCED)
- Public profile is served at `/u/[slug]` — slug is independent of username

---

Made by [Atharva](https://github.com/ASPR175)
