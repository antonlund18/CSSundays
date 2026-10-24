# CSSundays

De fedeste Counter-Strike turneringer – [www.cssundays.dk](https://www.cssundays.dk)

A tournament platform for CS2: players sign up, create teams and invite teammates, register for
tournaments and play single-elimination brackets with a live ready check, map veto and match chat.

## Stack

| Part | Technology | Free hosting |
| --- | --- | --- |
| API (`server/`) | Node.js 24, TypeScript, GraphQL Yoga, Pothos (code-first schema), Prisma 7 | Render (free web service) |
| Database | PostgreSQL | Neon (free plan) |
| Frontend (`web/`) | React 19, Vite, TanStack Router + Query, gql.tada, Tailwind CSS 4, Radix UI | Cloudflare Pages |
| Images | S3-compatible storage | Cloudflare R2 (free tier) |
| E-mail | Resend | Resend (free tier) |

```
server/
  prisma/schema.prisma     data model; prisma/migrations/ holds the SQL migrations
  prisma/seed.ts           local test data
  src/services/            all business rules (auth, teams, tournaments, brackets, matches, Steam)
  src/schema/              GraphQL schema (Pothos): types, queries, mutations, subscriptions
  src/index.ts             HTTP server: /graphql, /health, /uploads (dev)
  schema.graphql           printed schema, used by the frontend for typed queries
web/
  src/api/                 typed GraphQL operations
  src/routes/              pages (file-based routing)
  src/features/            bracket, match, tournament, player and admin components
```

### How it works

- **Auth.** E-mail + password (argon2), with e-mail confirmation and password reset by link.
  Sessions are opaque bearer tokens (only a SHA-256 hash is stored), so the frontend and API can
  live on different domains.
- **Rules.** Every mutation goes through a service in `src/services/` that checks who is calling,
  validates input and runs in a database transaction. Errors are short codes (e.g. `TEAM_FULL`)
  that the frontend translates into Danish (`web/src/lib/errors.ts`).
- **Live updates.** GraphQL subscriptions over Server-Sent Events signal "this match / tournament
  / your notifications changed"; the frontend then refetches.
- **Timers.** Ready checks (60 s) and ban turns (30 s) are in-process timers. Deadlines are stored
  on the match, and pending ones are re-armed when the server starts, so a restart only delays a
  timeout. Nothing polls the database, which lets Neon scale to zero when the site is idle.
- **Single instance.** Timers, live events and per-tournament locks live in the API process, so
  run exactly one instance (which is what the free plan gives you anyway).

### How a tournament runs

1. Staff create a tournament (`/admin/tournaments`) and publish it.
2. A player registers one of their teams and becomes captain; teammates register with the same
   team (max 5).
3. Staff press **Opret bracket**. Registration closes and teams are placed in a single-elimination
   tree (byes go to round two, empty first-round matches are cancelled).
4. **Start turnering** puts every match with two teams into a 60-second ready check.
5. When both captains are ready (or time runs out) the map veto starts: captains alternate bans
   with 30 seconds per turn, a random map is banned on timeout, and the last map is played.
6. Staff set the server address (shown only to the two teams) and report the winner, who
   advances automatically. The final finishes the tournament.

Durations are `READY_CHECK_SECONDS` and `BAN_SECONDS` in `server/src/services/matches.ts`; the
map pool is managed at `/admin/maps`.

## Local development

Requirements: Node 22+ and Docker.

The repository is an npm workspace (`server`, `web`) driven by [Turborepo](https://turborepo.com).
Install once from the root; `npm run dev` starts the API and the frontend together.

```bash
# Postgres for development (database "cssundays") and tests ("cssundays_test")
docker compose up -d

npm install
cp server/.env.example server/.env
cp web/.env.example web/.env.local
npm run db:deploy -w server   # apply migrations
npm run db:seed -w server

# API on http://localhost:4000/graphql (GraphiQL is enabled in development)
# Frontend on http://localhost:5173
npm run dev
```

The root also has `build`, `test`, `lint` and `typecheck`, which run the task in every package
(`npx turbo run <task> --filter=cssundays-server` for just one).

Seeded accounts all use the password `password123`, e.g. `anton@cssundays.test` (admin),
`asdasd@cssundays.test` and `s1mple@cssundays.test`. Without a Resend key, e-mails (confirmation
and password-reset links) are printed in the API's console. Uploaded images go to `server/uploads/`.

### Tests

```bash
npm test                # both packages
npm test -w server      # integration tests against the cssundays_test database
npm test -w web         # unit tests
```

### Changing the data model or API

1. Edit `server/prisma/schema.prisma` and run `npx prisma migrate dev --name <change>`.
2. Update services and the Pothos schema in `server/src/`.
3. Run `npm run schema:print` in `server/` to update `schema.graphql`.
4. Run `npm run gen:graphql` in `web/` so the frontend's queries are type-checked against it.

CI (`.github/workflows/ci.yml`) runs the server tests against Postgres, checks that both generated
files are up to date, and lints, tests and builds the frontend.

## Deploying for free

The free tiers below were correct when this was written – check each provider's pricing page.

### 1. Database: Neon

1. Create a project at [neon.tech](https://neon.tech).
2. Copy two connection strings from **Connect**: the *pooled* one (host contains `-pooler`) for
   `DATABASE_URL`, and the *direct* one for `DIRECT_DATABASE_URL` (migrations).

### 2. Images: Cloudflare R2

1. Create an R2 bucket (e.g. `cssundays-images`) and enable public access (an `r2.dev` URL or a
   custom domain such as `images.cssundays.dk`).
2. Create an R2 API token with read/write access to the bucket.
3. You need `S3_ENDPOINT` (`https://<account-id>.r2.cloudflarestorage.com`), `S3_BUCKET`,
   `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` and `IMAGE_BASE_URL` (the public bucket URL).

### 3. E-mail: Resend

Create an account at [resend.com](https://resend.com), verify your domain (`cssundays.dk`) and
create an API key (`RESEND_API_KEY`). Set `EMAIL_FROM`, e.g. `CSSundays <noreply@cssundays.dk>`.

### 4. API: Render

1. In the Render dashboard choose **New → Blueprint** and select this repository. `render.yaml`
   creates a free web service from `server/` that runs migrations on every deploy.
2. Fill in the environment variables it asks for (database, R2, Resend, and
   `APP_ORIGINS=https://cssundays.dk,https://www.cssundays.dk`). Set `PUBLIC_API_URL` to the
   service URL (e.g. `https://cssundays-api.onrender.com`) or a custom domain like
   `https://api.cssundays.dk`.
3. Free services sleep after ~15 minutes without traffic and take a while to wake up. To keep it
   awake, create a free job at [cron-job.org](https://cron-job.org) that requests
   `https://<your-api>/health` every 10 minutes. `/health` doesn't touch the database, so Neon can
   still scale to zero. One always-on service fits in Render's free monthly hours.

### 5. Frontend: Cloudflare Pages

Create a Pages project connected to this repository:

- Root directory: `web`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_API_URL` (the API URL from step 4) and optionally `VITE_TWITCH_CHANNEL`.

`web/public/_redirects` makes client-side routes work. Add `cssundays.dk` under **Custom domains**.

### 6. First admin

Sign up on the site, then make yourself admin from your machine:

```bash
cd server
DATABASE_URL="<neon direct url>" npx prisma db execute --stdin <<< "update users set role = 'ADMIN' where playertag_key = 'anton';"
```

Admins can hand out the organizer/admin roles at `/admin/players` afterwards.

### 7. Automatic match servers: DatHost (optional, paid)

Without this, staff paste a server address into each match by hand. With it, the API creates a
new CS2 server on [DatHost](https://dathost.net) as soon as a match's veto is done, starts the
match on it, shows the live score, records the winner and advances the bracket – and deletes the
server again when the match is over (or restarted, or settled by staff). DatHost bills while a
server runs, so test with a small amount of credit first.

1. Set `DATHOST_EMAIL` and `DATHOST_PASSWORD` (the API uses your account login) and optionally
   `DATHOST_LOCATION` (e.g. `copenhagen`, see DatHost's
   [location ids](https://dathost.readme.io/reference/server-locations-mapping)).
2. In production, set `DATHOST_WEBHOOK_URL` to the webhook's fixed URL, e.g.
   `https://api.cssundays.dk/webhooks/dathost`, and `DATHOST_WEBHOOK_SECRET` (Render generates
   one). In development webhooks are ignored – no tunnel needed – and the API polls DatHost for
   results every 15 seconds instead.
3. Players must link their Steam account before they can register for a tournament; the server
   only lets in rostered players by Steam id.
4. At `/admin/maps`, each map has a **server map** (e.g. `de_dust2`): the name the game server
   loads. Left empty, `de_<slug>` is used.
5. Check the setup at `/admin/match-test` → **DatHost test-server**: it creates a server, starts a
   match on the chosen map for the listed Steam ids and shows its address and live score. Stopping
   it deletes the server.

Servers are named `cssundays-match-<id>` in production and `cssundays-development-match-<id>`
locally, so both can share one DatHost account. On every start the API deletes servers with its own
prefix that no running match uses (e.g. after a crash, or a forgotten test server), and catches up on
results it missed while it was asleep. Don't give your own DatHost servers names with these prefixes.

If a server can't start, or DatHost cancels the match, the match page tells the players and staff
get a **Start server igen** button; reporting the winner by hand always works.
