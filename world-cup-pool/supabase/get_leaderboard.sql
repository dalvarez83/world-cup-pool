-- Creates (or replaces) the get_leaderboard() RPC.
-- Run once in the Supabase SQL editor.
-- Computes scores entirely in the database — no row-limit or client-side
-- calculation issues.

create or replace function public.get_leaderboard()
returns table (
  user_id      uuid,
  display_name text,
  total_pts    numeric,
  correct_picks integer,
  total_picks   integer
)
language sql security definer
as $$
  select
    p.id as user_id,
    p.display_name,
    coalesce(sum(
      case
        when not m.is_completed
          or m.home_score is null
          or m.away_score is null then 0
        when pr.home_score = m.home_score
         and pr.away_score = m.away_score then
          3
          * case m.stage
              when 'group'       then 1
              when 'r32'         then 1.5
              when 'r16'         then 2
              when 'qf'          then 3
              when 'sf'          then 4
              when 'third_place' then 2
              when 'final'       then 5
              else 1 end
          * case
              when m.home_prob is not null and m.away_prob is not null
               and ((m.home_score > m.away_score and m.home_prob < m.away_prob)
                 or (m.away_score > m.home_score and m.away_prob < m.home_prob))
              then 2 else 1 end
        when (pr.home_score > pr.away_score) = (m.home_score > m.away_score)
         and (pr.home_score < pr.away_score) = (m.home_score < m.away_score)
         and (pr.home_score = pr.away_score) = (m.home_score = m.away_score) then
          1
          * case m.stage
              when 'group'       then 1
              when 'r32'         then 1.5
              when 'r16'         then 2
              when 'qf'          then 3
              when 'sf'          then 4
              when 'third_place' then 2
              when 'final'       then 5
              else 1 end
          * case
              when m.home_prob is not null and m.away_prob is not null
               and ((m.home_score > m.away_score and m.home_prob < m.away_prob)
                 or (m.away_score > m.home_score and m.away_prob < m.home_prob))
              then 2 else 1 end
        else 0
      end
    ), 0)::numeric as total_pts,
    count(case
      when m.is_completed
       and m.home_score is not null
       and m.away_score is not null
       and (
         (pr.home_score = m.home_score and pr.away_score = m.away_score)
         or (
           (pr.home_score > pr.away_score) = (m.home_score > m.away_score)
           and (pr.home_score < pr.away_score) = (m.home_score < m.away_score)
           and (pr.home_score = pr.away_score) = (m.home_score = m.away_score)
         )
       ) then 1
    end)::integer as correct_picks,
    count(pr.id)::integer as total_picks
  from profiles p
  left join predictions pr on p.id = pr.user_id
  left join matches m      on pr.match_id = m.id
  group by p.id, p.display_name
  order by total_pts desc, p.display_name;
$$;

grant execute on function public.get_leaderboard() to authenticated;
