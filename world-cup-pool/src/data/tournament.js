// Static reference data for display (groups, flags, team names).
// Actual match schedule and results live in the Supabase `matches` table.

export const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L']

export const TEAMS = {
  // Group A
  CAN: { name: 'Canada',        flag: '🇨🇦', group: 'A' },
  MAR: { name: 'Morocco',       flag: '🇲🇦', group: 'A' },
  CRO: { name: 'Croatia',       flag: '🇭🇷', group: 'A' },
  BEL: { name: 'Belgium',       flag: '🇧🇪', group: 'A' },
  // Group B
  MEX: { name: 'Mexico',        flag: '🇲🇽', group: 'B' },
  SVK: { name: 'Slovakia',      flag: '🇸🇰', group: 'B' },
  ECU: { name: 'Ecuador',       flag: '🇪🇨', group: 'B' },
  SEN: { name: 'Senegal',       flag: '🇸🇳', group: 'B' },
  // Group C
  USA: { name: 'United States', flag: '🇺🇸', group: 'C' },
  SRB: { name: 'Serbia',        flag: '🇷🇸', group: 'C' },
  JAM: { name: 'Jamaica',       flag: '🇯🇲', group: 'C' },
  TUN: { name: 'Tunisia',       flag: '🇹🇳', group: 'C' },
  // Group D
  FRA: { name: 'France',        flag: '🇫🇷', group: 'D' },
  COL: { name: 'Colombia',      flag: '🇨🇴', group: 'D' },
  JPN: { name: 'Japan',         flag: '🇯🇵', group: 'D' },
  COD: { name: 'DR Congo',      flag: '🇨🇩', group: 'D' },
  // Group E
  GER: { name: 'Germany',       flag: '🇩🇪', group: 'E' },
  BRA: { name: 'Brazil',        flag: '🇧🇷', group: 'E' },
  AUS: { name: 'Australia',     flag: '🇦🇺', group: 'E' },
  MLI: { name: 'Mali',          flag: '🇲🇱', group: 'E' },
  // Group F
  ESP: { name: 'Spain',         flag: '🇪🇸', group: 'F' },
  ARG: { name: 'Argentina',     flag: '🇦🇷', group: 'F' },
  IRN: { name: 'Iran',          flag: '🇮🇷', group: 'F' },
  NGA: { name: 'Nigeria',       flag: '🇳🇬', group: 'F' },
  // Group G
  ENG: { name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'G' },
  URU: { name: 'Uruguay',       flag: '🇺🇾', group: 'G' },
  KOR: { name: 'South Korea',   flag: '🇰🇷', group: 'G' },
  EGY: { name: 'Egypt',         flag: '🇪🇬', group: 'G' },
  // Group H
  POR: { name: 'Portugal',      flag: '🇵🇹', group: 'H' },
  NED: { name: 'Netherlands',   flag: '🇳🇱', group: 'H' },
  KSA: { name: 'Saudi Arabia',  flag: '🇸🇦', group: 'H' },
  VEN: { name: 'Venezuela',     flag: '🇻🇪', group: 'H' },
  // Group I
  ITA: { name: 'Italy',         flag: '🇮🇹', group: 'I' },
  CHI: { name: 'Chile',         flag: '🇨🇱', group: 'I' },
  JOR: { name: 'Jordan',        flag: '🇯🇴', group: 'I' },
  CMR: { name: 'Cameroon',      flag: '🇨🇲', group: 'I' },
  // Group J
  SUI: { name: 'Switzerland',   flag: '🇨🇭', group: 'J' },
  HON: { name: 'Honduras',      flag: '🇭🇳', group: 'J' },
  RSA: { name: 'South Africa',  flag: '🇿🇦', group: 'J' },
  IRQ: { name: 'Iraq',          flag: '🇮🇶', group: 'J' },
  // Group K
  AUT: { name: 'Austria',       flag: '🇦🇹', group: 'K' },
  DEN: { name: 'Denmark',       flag: '🇩🇰', group: 'K' },
  CRC: { name: 'Costa Rica',    flag: '🇨🇷', group: 'K' },
  IDN: { name: 'Indonesia',     flag: '🇮🇩', group: 'K' },
  // Group L
  SCO: { name: 'Scotland',      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'L' },
  NZL: { name: 'New Zealand',   flag: '🇳🇿', group: 'L' },
  UZB: { name: 'Uzbekistan',    flag: '🇺🇿', group: 'L' },
  HUN: { name: 'Hungary',       flag: '🇭🇺', group: 'L' },
}

export function teamName(code) {
  return TEAMS[code]?.name ?? code ?? 'TBD'
}

export function teamFlag(code) {
  return TEAMS[code]?.flag ?? '🏳'
}
