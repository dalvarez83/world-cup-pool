-- Run this once in the Supabase SQL editor.
-- Fixes the GRANT that was referencing the wrong (3-arg) function signature.
-- The function has 5 parameters (last 2 default to NULL), so the grant must
-- reference all 5 types.

grant execute on function public.save_match_result(integer, integer, integer, integer, integer) to authenticated;

-- Recalculate stored points for every prediction on every completed match.
-- This is a safety net in case any save_match_result call was skipped or failed.
-- The leaderboard now computes scores on the fly, but keeping points accurate
-- ensures any future query against the column is correct.
do $$
declare
  r record;
  v_mult numeric;
  v_udog numeric;
begin
  for r in
    select id, stage, home_score, away_score, home_prob, away_prob
    from public.matches
    where is_completed = true
      and home_score is not null
      and away_score is not null
  loop
    v_mult := case r.stage
      when 'group'       then 1
      when 'r32'         then 1.5
      when 'r16'         then 2
      when 'qf'          then 3
      when 'sf'          then 4
      when 'third_place' then 2
      when 'final'       then 5
      else 1
    end;

    v_udog := 1;
    if r.home_prob is not null and r.away_prob is not null then
      if r.home_score > r.away_score and r.home_prob < r.away_prob then v_udog := 2;
      elsif r.away_score > r.home_score and r.away_prob < r.home_prob then v_udog := 2;
      end if;
    end if;

    update public.predictions
    set points = case
      when home_score = r.home_score and away_score = r.away_score
        then 3 * v_mult * v_udog
      when (home_score > away_score) = (r.home_score > r.away_score)
       and (home_score < away_score) = (r.home_score < r.away_score)
       and (home_score = away_score) = (r.home_score = r.away_score)
        then 1 * v_mult * v_udog
      else 0
    end,
    updated_at = now()
    where match_id = r.id;
  end loop;
end $$;
