-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (1-1 với auth.users)
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  addiction_type text not null default 'general',
  start_date   date not null default current_date,
  current_streak int not null default 0,
  best_streak    int not null default 0,
  created_at   timestamptz default now()
);

-- Craving logs
create table public.craving_logs (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  trigger   text not null,
  intensity int not null check (intensity between 1 and 10),
  note      text,
  outcome   text not null check (outcome in ('overcame','relapse','in_progress')) default 'in_progress',
  created_at timestamptz default now()
);

-- Chat messages
create table public.chat_messages (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  role      text not null check (role in ('user','assistant')),
  content   text not null,
  created_at timestamptz default now()
);

-- Daily notes
create table public.daily_notes (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  content   text not null,
  created_at timestamptz default now()
);

-- RLS: users chỉ thấy data của chính mình
alter table public.profiles     enable row level security;
alter table public.craving_logs enable row level security;
alter table public.chat_messages enable row level security;
alter table public.daily_notes  enable row level security;

create policy "own profile"     on public.profiles     for all using (auth.uid() = id);
create policy "own craving_logs" on public.craving_logs for all using (auth.uid() = user_id);
create policy "own chat"        on public.chat_messages for all using (auth.uid() = user_id);
create policy "own notes"       on public.daily_notes  for all using (auth.uid() = user_id);

-- Auto-create profile sau khi đăng ký
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
