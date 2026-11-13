# Bike-Share-Program-App
Building a bike share program app prototype for Whitman College.

## Layout

| Folder | What it is | How to run |
| --- | --- | --- |
| [`mobile/`](mobile/README.md) | Rider-facing Expo (React Native) app | [mobile/README.md](mobile/README.md) |
| [`admin/`](admin/README.md) | Admin website (Next.js) | [admin/README.md](admin/README.md) |
| [`docs/`](docs/README.md) | Project documentation | n/a |

Each app is an independent npm project: run `npm install` inside the folder you are working in.
Requires Node.js 20+.

## Backend

We chose [Supabase](https://supabase.com) as the shared backend and database (Sprint 1 decision, Nov 2026). Both apps talk to the same Supabase project.

Why Supabase over Firebase:
- Our data has relationships (stations have bikes, bikes have rentals, rentals have reports), which fits Supabase's Postgres tables.
- Row-level security lets us say "anyone can read stations, only admins can change them" right in the database.
- It has a free tier and works with both Expo and Next.js through the same `@supabase/supabase-js` client.

Keys go in environment files (`.env`), never in the repo. See [`.env.example`](.env.example) for the variable names.

### Set up your environment

1. Open the Supabase dashboard → Project Settings → API. Copy the project URL and the publishable key. Never use the secret key in either app.
2. Create `mobile/.env` and `admin/.env.local` with the variables from [`.env.example`](.env.example). Git ignores both files.
3. Run `npm run check:supabase` in each app folder. It reports a missing variable or a failed connection.
4. Restart the dev server after you change an env file.
5. Start each app with the steps in [mobile/README.md](mobile/README.md) and [admin/README.md](admin/README.md).

Vercel builds the admin site, so the two `NEXT_PUBLIC_SUPABASE_*` variables must also be set in the Vercel project's Environment Variables. The build fails without them.

The Sprint 2 end-to-end check (admin website to phone) is recorded in [issue #9](https://github.com/DiaHere/Bike-Share-Program-App/issues/9).

### Database schema

Table changes live in [`supabase/migrations/`](supabase/migrations) and run in filename order. Test data lives in [`supabase/seed.sql`](supabase/seed.sql) and is safe to rerun.

| Table | Sprint | Who can read | Who can add or update |
| --- | --- | --- | --- |
| `stations` | 2 | Everyone | Admins only |
| `bikes` | 3 | Everyone | Admins only |
| `station_availability` (view) | 2 | Everyone | Read-only |

`station_availability` is every station plus `available_bikes`, a live count of that station's bikes with status `available`. The count is computed on each read and never stored, so it can be 0 while `capacity` (the rack size) stays fixed.

Nobody can delete rows from either table. Deactivate a station with `is_active`, and retire a bike by changing its status.

To apply the schema to the shared project, use the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started):

```bash
supabase login
supabase link --project-ref <project-ref>   # from the project's dashboard URL
supabase db push                             # runs any migrations not yet applied
```

Without the CLI, paste each migration file, then `seed.sql`, into the dashboard's SQL Editor, in order.

### Test admin

Until login arrives in Sprint 4, an admin is any Supabase Auth user whose `app_metadata` has `"role": "admin"`. Users can't change their own `app_metadata`, so this can't be faked from an app. To create the test admin:

1. Dashboard → Authentication → Users → Add user, with an email and password.
2. In the SQL Editor, run:
   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
   where email = '<test admin email>';
   ```
3. Sign in again so the new role is in the user's token.
