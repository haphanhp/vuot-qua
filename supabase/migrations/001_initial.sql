-- ============================================
-- Vượt Qua — Database Schema
-- Run: npx supabase db reset
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. USER PROFILES
-- ============================================
create table public.users_profile (
  id uuid references auth.users on delete cascade primary key,
  addiction_type text check (addiction_type in (
    'alcohol', 'nicotine', 'gambling', 'social_media',
    'substance', 'food', 'other'
  )),
  start_date timestamptz not null default now(),
  best_streak integer default 0 not null,
  display_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.users_profile enable row level security;

create policy "Users can view own profile"
  on public.users_profile for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users_profile for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users_profile for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users_profile (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 2. CRAVING LOGS
-- Log mọi cơn thèm — trung tính, không label thất bại
-- ============================================
create table public.craving_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  trigger_type text check (trigger_type in (
    'stress', 'boredom', 'loneliness', 'fatigue',
    'conflict', 'environment', 'after_meal',
    'social_pressure', 'other'
  )),
  intensity integer check (intensity between 1 and 10),
  note text,
  action_taken text check (action_taken in (
    'urge_surf', 'replacement_behavior', 'chat_coach',
    'called_someone', 'exercised', 'relapsed', 'other'
  )),
  outcome text check (outcome in ('overcame', 'relapsed')),
  duration_minutes integer,   -- bao nhiêu phút để xử lý
  logged_at timestamptz default now() not null
);

alter table public.craving_logs enable row level security;

create policy "Users can manage own craving logs"
  on public.craving_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index craving_logs_user_id_idx on public.craving_logs (user_id);
create index craving_logs_logged_at_idx on public.craving_logs (logged_at desc);

-- ============================================
-- 3. DAILY NOTES
-- ============================================
create table public.daily_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  mood integer check (mood between 1 and 5),
  logged_at timestamptz default now() not null
);

alter table public.daily_notes enable row level security;

create policy "Users can manage own notes"
  on public.daily_notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index daily_notes_user_logged_at_idx on public.daily_notes (user_id, logged_at desc);

-- ============================================
-- 4. CHAT HISTORY
-- Lưu để maintain context qua sessions
-- ============================================
create table public.chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  session_id uuid not null default gen_random_uuid(),
  created_at timestamptz default now() not null
);

alter table public.chat_history enable row level security;

create policy "Users can manage own chat history"
  on public.chat_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index chat_history_user_session_idx on public.chat_history (user_id, session_id, created_at);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Tính streak hiện tại
create or replace function public.get_current_streak(p_user_id uuid)
returns integer as $$
declare
  v_start_date timestamptz;
  v_last_relapse timestamptz;
begin
  select start_date into v_start_date
  from public.users_profile
  where id = p_user_id;

  select logged_at into v_last_relapse
  from public.craving_logs
  where user_id = p_user_id
    and outcome = 'relapsed'
  order by logged_at desc
  limit 1;

  if v_last_relapse is null then
    return extract(day from now() - v_start_date)::integer;
  else
    return extract(day from now() - v_last_relapse)::integer;
  end if;
end;
$$ language plpgsql security definer;

-- Update best_streak tự động
create or replace function public.update_best_streak()
returns trigger as $$
declare
  v_current integer;
begin
  v_current := public.get_current_streak(new.user_id);

  update public.users_profile
  set best_streak = greatest(best_streak, v_current),
      updated_at = now()
  where id = new.user_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_craving_logged
  after insert on public.craving_logs
  for each row execute procedure public.update_best_streak();
