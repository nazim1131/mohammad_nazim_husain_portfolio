# Supabase Setup (Portfolio)

1. Create a Supabase project → copy Project URL and anon key.
2. In the repo, edit `.env.local` (or Vite env) with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
3. Run these SQL statements in Supabase SQL Editor:
```sql
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text check (status in ('draft','published')) default 'draft',
  order_index int default 0,
  tags text[] default '{}',
  image_url text,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  level int check (level between 0 and 100) default 50,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table projects enable row level security;
alter table skills enable row level security;
create policy "Public read published projects" on projects for select using (status='published');
create policy "Public read skills" on skills for select using (true);
create policy "Owner can manage projects" on projects for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Owner can manage skills" on skills for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
```
4. Auth → enable Email/Password, create your admin user. Login at `/admin`.
