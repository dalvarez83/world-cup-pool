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

export function calculatePoints(prediction, match) {
  if (!match.is_completed || match.home_score === null || match.away_score === null) return 0
  const multiplier = STAGE_MULTIPLIERS[match.stage] ?? 1
  if (prediction.home_score === match.home_score && prediction.away_score === match.away_score) {
    return 3 * multiplier
  }
  if (getOutcome(prediction.home_score, prediction.away_score) === getOutcome(match.home_score, match.away_score)) {
    return 1 * multiplier
  }
  return 0
}

export function formatPoints(pts) {
  return pts % 1 === 0 ? String(pts) : pts.toFixed(1)
}
