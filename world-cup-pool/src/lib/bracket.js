import { supabase } from './supabase'

export function computeGroupStandings(matches) {
  const teams = {}

  matches.forEach(m => {
    if (!teams[m.home_team]) teams[m.home_team] = { team: m.home_team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }
    if (!teams[m.away_team]) teams[m.away_team] = { team: m.away_team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }

    if (!m.is_completed || m.home_score === null || m.away_score === null) return

    const h = teams[m.home_team]
    const a = teams[m.away_team]

    h.played++; a.played++
    h.gf += m.home_score; h.ga += m.away_score
    a.gf += m.away_score; a.ga += m.home_score
    h.gd = h.gf - h.ga; a.gd = a.gf - a.ga

    if (m.home_score > m.away_score) { h.won++; h.points += 3; a.lost++ }
    else if (m.away_score > m.home_score) { a.won++; a.points += 3; h.lost++ }
    else { h.drawn++; a.drawn++; h.points++; a.points++ }
  })

  return Object.values(teams).sort((a, b) =>
    b.points - a.points || b.gd - a.gd || b.gf - a.gf
  )
}

// Called after a group finishes. Updates R32 team names based on group standings.
export async function advanceGroupWinners(groupLetter, standings) {
  if (standings.length < 2) return []

  const winner = standings[0].team
  const runnerUp = standings[1].team
  const placeholders = [
    { ph: `W-${groupLetter}`, team: winner },
    { ph: `R-${groupLetter}`, team: runnerUp },
  ]

  const results = []
  for (const { ph, team } of placeholders) {
    const { data: matches } = await supabase
      .from('matches')
      .select('id, home_team_placeholder, away_team_placeholder')
      .or(`home_team_placeholder.eq.${ph},away_team_placeholder.eq.${ph}`)

    for (const m of matches ?? []) {
      const update = {}
      if (m.home_team_placeholder === ph) update.home_team = team
      if (m.away_team_placeholder === ph) update.away_team = team

      await supabase.from('matches').update(update).eq('id', m.id)
      results.push({ matchId: m.id, ...update })
    }
  }
  return results
}

// Called after a knockout match finishes. Advances the winner (and loser for 3rd place) to the next match.
export async function advanceKnockoutWinner(completedMatch) {
  const { home_team, away_team, home_score, away_score, id, stage } = completedMatch
  const winner = home_score > away_score ? home_team : away_team
  const loser = home_score > away_score ? away_team : home_team

  const { data: nextMatches } = await supabase
    .from('matches')
    .select('id, source_home_match_id, source_away_match_id, source_home_is_loser, source_away_is_loser')
    .or(`source_home_match_id.eq.${id},source_away_match_id.eq.${id}`)

  const results = []
  for (const nm of nextMatches ?? []) {
    const update = {}
    if (nm.source_home_match_id === id) {
      update.home_team = nm.source_home_is_loser ? loser : winner
    }
    if (nm.source_away_match_id === id) {
      update.away_team = nm.source_away_is_loser ? loser : winner
    }
    await supabase.from('matches').update(update).eq('id', nm.id)
    results.push({ matchId: nm.id, ...update })
  }
  return results
}

// Compute best 8 third-place teams from all 12 groups and fill T3-1..T3-8 slots.
export async function advanceThirdPlaceTeams(allGroupMatches) {
  const groupLetters = 'ABCDEFGHIJKL'.split('')
  const thirdPlaceTeams = []

  for (const letter of groupLetters) {
    const gMatches = allGroupMatches.filter(m => m.group_letter === letter)
    const standings = computeGroupStandings(gMatches)
    if (standings.length >= 3 && standings[2].played === 3) {
      thirdPlaceTeams.push({ ...standings[2], group: letter })
    }
  }

  if (thirdPlaceTeams.length < 8) return []

  const best8 = thirdPlaceTeams
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    .slice(0, 8)

  const results = []
  for (let i = 0; i < 8; i++) {
    const ph = `T3-${i + 1}`
    const team = best8[i].team

    const { data: matches } = await supabase
      .from('matches')
      .select('id, home_team_placeholder, away_team_placeholder')
      .or(`home_team_placeholder.eq.${ph},away_team_placeholder.eq.${ph}`)

    for (const m of matches ?? []) {
      const update = {}
      if (m.home_team_placeholder === ph) update.home_team = team
      if (m.away_team_placeholder === ph) update.away_team = team
      await supabase.from('matches').update(update).eq('id', m.id)
      results.push({ matchId: m.id, team, slot: ph, ...update })
    }
  }
  return results
}
