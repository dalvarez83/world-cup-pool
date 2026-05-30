// NOTE: Group compositions are based on the Dec 2024 FIFA draw.
// Verify all team assignments and match dates against the official FIFA schedule
// before the tournament starts (June 11, 2026).

export const GROUPS = {
  A: ['USA', 'Uruguay', 'Germany', 'Morocco'],
  B: ['Mexico', 'Ecuador', 'Croatia', 'Algeria'],
  C: ['Canada', 'Argentina', 'Belgium', 'Japan'],
  D: ['Brazil', 'Serbia', 'South Korea', 'Egypt'],
  E: ['Colombia', 'Spain', 'Senegal', 'Venezuela'],
  F: ['Chile', 'France', 'Iran', 'Ivory Coast'],
  G: ['Netherlands', 'England', 'South Africa', 'Australia'],
  H: ['Portugal', 'Austria', 'Honduras', 'Tunisia'],
  I: ['Italy', 'Denmark', 'Panama', 'Nigeria'],
  J: ['Scotland', 'Romania', 'Jamaica', 'Jordan'],
  K: ['Turkey', 'Poland', 'Saudi Arabia', 'DR Congo'],
  L: ['Iraq', 'Indonesia', 'New Zealand', 'Slovenia'],
}

export const STAGE_NAMES = {
  group: 'Group Stage',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarterfinals',
  sf: 'Semifinals',
  third_place: 'Third Place',
  final: 'Final',
}

export const KNOCKOUT_STAGES = ['r32', 'r16', 'qf', 'sf', 'third_place', 'final']

export const GROUP_LETTERS = Object.keys(GROUPS)

export const TOURNAMENT_START = new Date('2026-06-11T00:00:00Z')
export const TOURNAMENT_END = new Date('2026-07-19T00:00:00Z')
