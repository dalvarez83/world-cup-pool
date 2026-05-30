-- ============================================================
-- WC 2026 Pool – Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  code        TEXT PRIMARY KEY,      -- 'BRA', 'FRA', etc.
  name        TEXT NOT NULL,
  flag        TEXT NOT NULL,         -- flag emoji
  group_name  CHAR(1) NOT NULL       -- 'A' through 'L'
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
  id                SERIAL PRIMARY KEY,
  match_number      INTEGER UNIQUE NOT NULL,
  stage             TEXT NOT NULL,   -- 'group' | 'r32' | 'r16' | 'qf' | 'sf' | '3rd' | 'final'
  group_name        CHAR(1),         -- group stage only
  home_team         TEXT REFERENCES teams(code),
  away_team         TEXT REFERENCES teams(code),
  home_placeholder  TEXT,            -- e.g. "Winner Group A" for knockout
  away_placeholder  TEXT,
  kickoff_time      TIMESTAMPTZ NOT NULL,
  venue             TEXT NOT NULL DEFAULT '',
  city              TEXT NOT NULL DEFAULT '',
  home_score        INTEGER,
  away_score        INTEGER,
  status            TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming' | 'live' | 'finished'
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id          SERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_id    INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  home_score  INTEGER NOT NULL,
  away_score  INTEGER NOT NULL,
  points      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, match_id)
);

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams       ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- profiles: anyone can read; users update their own row
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- teams: public read-only
CREATE POLICY "teams_select" ON teams FOR SELECT USING (TRUE);

-- matches: public read; admins insert/update
CREATE POLICY "matches_select" ON matches FOR SELECT USING (TRUE);
CREATE POLICY "matches_insert_admin" ON matches FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin));
CREATE POLICY "matches_update_admin" ON matches FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin));

-- predictions: everyone reads (for leaderboard); users write their own
CREATE POLICY "predictions_select" ON predictions FOR SELECT USING (TRUE);
CREATE POLICY "predictions_insert_own" ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "predictions_update_own" ON predictions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Grant your admin account after first sign-in:
--   UPDATE profiles SET is_admin = TRUE WHERE email = 'your@email.com';
-- ============================================================
