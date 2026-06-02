-- WC 2026 Pool Schema
-- Safe to re-run on an existing database — all statements are idempotent.

create extension if not exists "uuid-ossp";

-- ─── Profiles ───────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id           uuid references auth.users on delete cascade primary key,
  display_name text not null,
  is_admin     boolean default false,
  created_at   timestamptz default now()
);

alter table public.profiles enable row level security;

do $$ begin
  create policy "Profiles readable by authenticated users" on public.profiles
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own profile" on public.profiles
    for insert with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Matches ────────────────────────────────────────────────────────────────

create table if not exists public.matches (
  id                     integer primary key,
  stage                  text not null check (stage in ('group','r32','r16','qf','sf','third_place','final')),
  group_letter           text,
  match_number           integer not null,
  home_team              text not null,
  away_team              text not null,
  home_team_placeholder  text,
  away_team_placeholder  text,
  match_date             timestamptz,
  home_score             integer,
  away_score             integer,
  is_completed           boolean default false,
  source_home_match_id   integer references public.matches(id),
  source_away_match_id   integer references public.matches(id),
  source_home_is_loser   boolean default false,
  source_away_is_loser   boolean default false,
  home_prob              integer,
  away_prob              integer
);

-- Add columns if upgrading from an older schema version
alter table public.matches add column if not exists home_prob integer;
alter table public.matches add column if not exists away_prob integer;

alter table public.matches enable row level security;

do $$ begin
  create policy "Matches publicly readable" on public.matches
    for select using (true);
exception when duplicate_object then null; end $$;

create index if not exists matches_stage_idx on public.matches(stage);
create index if not exists matches_group_idx on public.matches(group_letter);

-- ─── Predictions ────────────────────────────────────────────────────────────

create table if not exists public.predictions (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  match_id   integer references public.matches(id) on delete cascade not null,
  home_score integer not null check (home_score >= 0),
  away_score integer not null check (away_score >= 0),
  points     numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, match_id)
);

alter table public.predictions enable row level security;

do $$ begin
  create policy "Predictions readable by authenticated users" on public.predictions
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own predictions" on public.predictions
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own predictions" on public.predictions
    for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

create index if not exists predictions_user_id_idx on public.predictions(user_id);
create index if not exists predictions_match_id_idx on public.predictions(match_id);

-- ─── Admin RPC: save result + recalculate points ─────────────────────────────

create or replace function public.save_match_result(
  p_match_id   integer,
  p_home_score integer,
  p_away_score integer,
  p_home_prob  integer default null,
  p_away_prob  integer default null
)
returns void language plpgsql security definer as $$
declare
  v_is_admin      boolean;
  v_stage         text;
  v_mult          numeric;
  v_underdog_mult numeric := 1;
begin
  select is_admin into v_is_admin from public.profiles where id = auth.uid();
  if not coalesce(v_is_admin, false) then
    raise exception 'Not authorized';
  end if;

  select stage into v_stage from public.matches where id = p_match_id;

  v_mult := case v_stage
    when 'group'       then 1
    when 'r32'         then 1.5
    when 'r16'         then 2
    when 'qf'          then 3
    when 'sf'          then 4
    when 'third_place' then 2
    when 'final'       then 5
    else 1
  end;

  -- 2× bonus when the winning team had the lower pre-match win probability (upset)
  if p_home_prob is not null and p_away_prob is not null then
    if p_home_score > p_away_score and p_home_prob < p_away_prob then
      v_underdog_mult := 2;
    elsif p_away_score > p_home_score and p_away_prob < p_home_prob then
      v_underdog_mult := 2;
    end if;
  end if;

  -- Persist result and probabilities (keep existing probs if none supplied)
  update public.matches
  set home_score   = p_home_score,
      away_score   = p_away_score,
      is_completed = true,
      home_prob    = coalesce(p_home_prob, home_prob),
      away_prob    = coalesce(p_away_prob, away_prob)
  where id = p_match_id;

  -- Recalculate points for every prediction on this match
  update public.predictions
  set points = case
    when home_score = p_home_score and away_score = p_away_score
      then 3 * v_mult * v_underdog_mult
    when (home_score > away_score) = (p_home_score > p_away_score)
     and (home_score < away_score) = (p_home_score < p_away_score)
     and (home_score = away_score) = (p_home_score = p_away_score)
      then 1 * v_mult * v_underdog_mult
    else 0
  end,
  updated_at = now()
  where match_id = p_match_id;
end;
$$;

-- Grant execute to authenticated users (is_admin check is inside the function)
grant execute on function public.save_match_result(integer, integer, integer) to authenticated;
