# Admin site (Next.js)

Admin dashboard for managing the bike share program (Next.js App Router, TypeScript).

## Run

```bash
cd admin
npm install
npm run dev        # http://localhost:3000
```

## Sign in

The site reads and writes the shared Supabase project, using the keys in `.env.local`. Sign in with the test admin account (see "Test admin" in the root README). Accounts without the admin role are turned away, and the database rejects their writes.

## Other commands

```bash
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npm run check:supabase  # confirm .env.local can reach Supabase
```
