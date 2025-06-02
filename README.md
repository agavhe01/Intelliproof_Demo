![](https://github.com/xyflow/web/blob/main/assets/codesandbox-header-ts.png?raw=true)

# React Flow starter (Vite + TS)

We've put together this template to serve as a starting point for folks
interested in React Flow. You can use this both as a base for your own React
Flow applications, or for small experiments or bug reports.

**TypeScript not your thing?** We also have a vanilla JavaScript starter template,
just for you!

## Getting up and running

You can get this template without forking/cloning the repo using `degit`:

```bash
npx degit xyflow/vite-react-flow-template your-app-name
```

The template contains mostly the minimum dependencies to get up and running, but
also includes eslint and some additional rules to help you write React code that
is less likely to run into issues:

```bash
npm install # or `pnpm install` or `yarn install`
```

Vite is a great development server and build tool that we recommend our users to
use. You can start a development server with:

```bash
npm run dev
```

While the development server is running, changes you make to the code will be
automatically reflected in the browser!

## Things to try:

- Create a new custom node inside `src/nodes/` (don't forget to export it from `src/nodes/index.ts`).
- Change how things look by [overriding some of the built-in classes](https://reactflow.dev/learn/customization/theming#overriding-built-in-classes).
- Add a layouting library to [position your nodes automatically](https://reactflow.dev/learn/layouting/layouting)

## Resources

Links:

- [React Flow - Docs](https://reactflow.dev)
- [React Flow - Discord](https://discord.com/invite/Bqt6xrs)

Learn:

- [React Flow – Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [React Flow – Layouting](https://reactflow.dev/learn/layouting/layouting)




SQL

-- 1) Enable UUID generation
create extension if not exists "pgcrypto";

-- 2) Define account‐tier enum
create type public.account_type_enum as enum ('free', 'basic', 'pro');

-- 3) Create profiles with email as PK and optional country
create table public.profiles (
  email        text                   primary key,
  user_id      uuid       not null    references auth.users(id) on delete cascade,
  account_type account_type_enum      not null default 'free',
  country      varchar(50),                   -- nullable by default
  created_at   timestamp with time zone not null default now()
);

-- 4) Create graphs, now referencing profiles(email)
create table public.graphs (
  id           uuid       primary key default gen_random_uuid(),
  owner_email  text       not null      references public.profiles(email) on delete cascade,
  graph_data   jsonb      not null,
  created_at   timestamp with time zone not null default now()
);

-- Optional: speed up searches inside JSONB
create index if not exists idx_graphs_data on public.graphs using gin (graph_data);

-- 5) Trigger function: on new Auth user, insert into profiles(email, user_id)
create or replace function public.sync_auth_user_to_profiles()
returns trigger language plpgsql as $$
begin
  insert into public.profiles(email, user_id)
    values (new.email, new.id)
    on conflict (email) do nothing;
  return new;
end;
$$;

-- 6) Attach trigger to auth.users
create trigger trg_sync_auth_user
  after insert on auth.users
  for each row
  execute procedure public.sync_auth_user_to_profiles();
