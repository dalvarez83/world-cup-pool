# World Cup 2026 Pool

A prediction pool web app for FIFA World Cup 2026 (June 11 – July 19, 2026). Up to ~30 friends each predict match scores, earn points based on accuracy, and compete on a live leaderboard.

Built with React + Vite, Supabase (Postgres + Auth + RLS), and deployed on Vercel.

---

## Directory Structure

```
world-cup-pool/
├── src/
│   ├── components/
│   │   ├── MatchCard.jsx       # Per-match prediction UI with live odds bar
│   │   └── Navbar.jsx          # Top nav with auth state
│   ├── contexts/
│   │   └── AuthContext.jsx     # Supabase session provider
│   ├── data/
│   │   └── tournament.js       # Group assignments, stage names, bracket constants
│   ├── lib/
│   │   ├── bracket.js          # Auto-advance logic (group winners, T3, knockouts)
│   │   ├── odds.js             # The Odds API client with 5-min cache
│   │   ├── scoring.js          # Client-side points calculation (mirrors DB RPC)
│   │   └── supabase.js         # Supabase client singleton
│   ├── pages/
│   │   ├── Admin.jsx           # Result entry + bracket management (admin only)
│   │   ├── Auth.jsx            # Magic link sign-in page
│   │   ├── Home.jsx            # Match list with prediction inputs
│   │   └── Leaderboard.jsx     # Live standings table
│   ├── App.jsx                 # Router + auth guard
│   ├── index.css               # Tailwind base + custom utility classes
│   └── main.jsx                # React entry point
├── supabase/
│   ├── schema.sql              # Full DB schema — run once to set up a new project
│   └── seed.sql                # All 104 matches with verified FIFA schedule
├── index.html
├── vercel.json                 # SPA rewrite rule for React Router
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Tailwind CSS 3 |
| Build tool | Vite 5 |
| Backend / DB | Supabase (PostgreSQL, Auth, Row Level Security) |
| Live odds | [The Odds API](https://the-odds-api.com) (`soccer_fifa_world_cup`) |
| Hosting | Vercel |

---

## Deployment

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run `supabase/schema.sql` in full. This creates all tables, RLS policies, indexes, and the `save_match_result` RPC.
3. Run `supabase/seed.sql` to load all 104 matches with the verified FIFA schedule.
4. To become admin: find your user UUID in **Authentication → Users**, then run:
   ```sql
   update public.profiles set is_admin = true where id = '<your-uuid>';
   ```

### 2. Environment Variables

Create `.env` in the project root (never commit this file):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_ODDS_API_KEY=<your-the-odds-api-key>   # optional — odds bar hides if absent
```

Get `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from **Project Settings → API** in Supabase.

### 3. Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### 4. Vercel Deployment

**Option A — Vercel dashboard (no CLI needed)**

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add the three environment variables above under **Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Vite and runs `npm run build` with output from `dist/`.

**Option B — Vercel CLI**

```bash
npm i -g vercel
vercel               # first-time link + deploy preview
vercel --prod        # promote to production
```

The `vercel.json` at the root configures a catch-all SPA rewrite so React Router handles all client-side routes.

### 5. Re-seeding (if needed)

If you need to reset match data (e.g., correct a schedule error) and no predictions exist yet:

```sql
truncate public.predictions restart identity cascade;
truncate public.matches restart identity cascade;
```

Then re-run `supabase/seed.sql`.

---

## Authentication

Authentication uses Supabase magic links — no passwords. Users enter their email on the sign-in page and receive a one-time login link. No admin invite is required; anyone with the app URL can self-register.

A profile row is auto-created on first sign-in (via a Postgres trigger), using the email prefix as the default display name. Users can update their display name from the profile page.

---

## Scoring Logic

Points are calculated both server-side (in the `save_match_result` Postgres RPC, which is the canonical source of truth) and client-side (`src/lib/scoring.js`, which mirrors the same formula for display purposes).

### Base Points Per Match

| Result | Points |
|---|---|
| Exact score (e.g. predicted 2–1, ended 2–1) | 3 |
| Correct outcome (win/draw) but wrong score | 1 |
| Wrong outcome | 0 |

### Stage Multipliers

Base points are multiplied by the match stage:

| Stage | Multiplier |
|---|---|
| Group stage | ×1 |
| Round of 32 | ×1.5 |
| Round of 16 | ×2 |
| Quarter-finals | ×3 |
| Semi-finals | ×4 |
| Third-place play-off | ×2 |
| Final | ×5 |

### Underdog Bonus

If the **lower-probability team wins** and you predicted it, your points for that match are doubled (×2) on top of the stage multiplier.

```
final points = base × stage_multiplier × underdog_multiplier
```

The underdog is determined by pre-match win probabilities sourced from The Odds API (averaged across bookmakers and normalised to remove the overround). Probabilities are stored on the match row (`home_prob`, `away_prob`) when a result is entered via the admin panel. Draws never trigger the bonus.

**Examples:**

| Scenario | Base | Stage | Underdog | Total |
|---|---|---|---|---|
| Exact score, group match, favourite wins | 3 | ×1 | ×1 | 3 pts |
| Correct outcome, R16, favourite wins | 1 | ×2 | ×1 | 2 pts |
| Exact score, QF, underdog wins | 3 | ×3 | ×2 | 18 pts |
| Correct outcome, Final, underdog wins | 1 | ×5 | ×2 | 10 pts |

---

## Bracket Auto-Advance

The admin panel automatically propagates team names through the bracket when results are entered — no manual bracket editing needed.

- **Group stage:** When the last match in a group is saved, `computeGroupStandings` ranks teams by points → goal difference → goals scored. The winner (`W-X`) and runner-up (`R-X`) are written into the matching R32 slots.
- **Best third-place teams:** When all 12 groups are complete, the top 8 third-place finishers (ranked the same way) are assigned to the 8 `T3-1..T3-8` slots in the R32.
- **Knockout rounds:** When any knockout result is saved, the winner advances to the `source_home_match_id` / `source_away_match_id` target match. For the third-place play-off, the losers of both semi-finals are used instead.

---

## Admin Panel

Navigate to `/admin` while logged in as an admin user. The panel shows:

- A progress bar (results entered / total matches)
- Group stage tab with per-group match list
- Knockout tab organised by round
- Click **Enter** / **Edit** on any match to open the result modal

When opening a match for result entry, the app fetches live odds from The Odds API and displays the underdog (if any) with a banner showing the 2× bonus. If live odds are unavailable, stored probabilities from the match row are used as a fallback.

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `VITE_ODDS_API_KEY` | No | The Odds API key — odds bar hidden if absent |
