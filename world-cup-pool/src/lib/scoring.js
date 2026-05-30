const MULTIPLIERS = {
  group: 1,
  r32:   1.5,
  r16:   2,
  qf:    3,
  sf:    4,
  '3rd': 5,
  final: 5,
}

export function calculatePoints(predHome, predAway, actHome, actAway, stage) {
  const mult = MULTIPLIERS[stage] ?? 1
  if (predHome === actHome && predAway === actAway) {
    return Math.round(3 * mult)
  }
  const predOutcome = Math.sign(predHome - predAway)
  const actOutcome  = Math.sign(actHome  - actAway)
  if (predOutcome === actOutcome) {
    return Math.round(1 * mult)
  }
  return 0
}

export const STAGE_LABELS = {
  group: 'Group Stage',
  r32:   'Round of 32',
  r16:   'Round of 16',
  qf:    'Quarter-final',
  sf:    'Semi-final',
  '3rd': '3rd Place',
  final: 'Final',
}

export const STAGE_ORDER = ['group', 'r32', 'r16', 'qf', 'sf', '3rd', 'final']

export function pointsDescription(stage) {
  const mult = MULTIPLIERS[stage] ?? 1
  return `${Math.round(3 * mult)} pts exact · ${Math.round(1 * mult)} pt outcome`
}
