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
