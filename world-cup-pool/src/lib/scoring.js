export const STAGE_MULTIPLIERS = {
  group: 1,
  r32: 1.5,
  r16: 2,
  qf: 3,
  sf: 4,
  third_place: 2,
  final: 5,
}

export function getOutcome(home, away) {
  if (home > away) return 'home'
  if (away > home) return 'away'
  return 'draw'
}

// 2× when the winning team had the lower pre-match win probability
export function getUnderdogMultiplier(match) {
  if (match.home_prob == null || match.away_prob == null) return 1
  const winner = getOutcome(match.home_score, match.away_score)
  if (winner === 'home' && match.home_prob < match.away_prob) return 2
  if (winner === 'away' && match.away_prob < match.home_prob) return 2
  return 1
}

export function calculatePoints(prediction, match) {
  if (!match.is_completed || match.home_score === null || match.away_score === null) return 0
  const multiplier = STAGE_MULTIPLIERS[match.stage] ?? 1
  const underdogMult = getUnderdogMultiplier(match)
  if (prediction.home_score === match.home_score && prediction.away_score === match.away_score) {
    return 3 * multiplier * underdogMult
  }
  if (getOutcome(prediction.home_score, prediction.away_score) === getOutcome(match.home_score, match.away_score)) {
    return 1 * multiplier * underdogMult
  }
  return 0
}

export function formatPoints(pts) {
  return pts % 1 === 0 ? String(pts) : pts.toFixed(1)
}
