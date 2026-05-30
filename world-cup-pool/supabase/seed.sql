-- ============================================================
-- WC 2026 Pool – Seed Data
-- Teams & Group Stage Matches
--
-- NOTE: Groups and schedule are based on the December 2024 draw.
-- Verify exact kickoff times against the official FIFA schedule
-- at fifa.com before going live.
-- ============================================================

-- Teams
INSERT INTO teams (code, name, flag, group_name) VALUES
-- Group A
('CAN', 'Canada',        '🇨🇦', 'A'),
('MAR', 'Morocco',       '🇲🇦', 'A'),
('CRO', 'Croatia',       '🇭🇷', 'A'),
('BEL', 'Belgium',       '🇧🇪', 'A'),
-- Group B
('MEX', 'Mexico',        '🇲🇽', 'B'),
('SVK', 'Slovakia',      '🇸🇰', 'B'),
('ECU', 'Ecuador',       '🇪🇨', 'B'),
('SEN', 'Senegal',       '🇸🇳', 'B'),
-- Group C
('USA', 'United States', '🇺🇸', 'C'),
('SRB', 'Serbia',        '🇷🇸', 'C'),
('JAM', 'Jamaica',       '🇯🇲', 'C'),
('TUN', 'Tunisia',       '🇹🇳', 'C'),
-- Group D
('FRA', 'France',        '🇫🇷', 'D'),
('COL', 'Colombia',      '🇨🇴', 'D'),
('JPN', 'Japan',         '🇯🇵', 'D'),
('COD', 'DR Congo',      '🇨🇩', 'D'),
-- Group E
('GER', 'Germany',       '🇩🇪', 'E'),
('BRA', 'Brazil',        '🇧🇷', 'E'),
('AUS', 'Australia',     '🇦🇺', 'E'),
('MLI', 'Mali',          '🇲🇱', 'E'),
-- Group F
('ESP', 'Spain',         '🇪🇸', 'F'),
('ARG', 'Argentina',     '🇦🇷', 'F'),
('IRN', 'Iran',          '🇮🇷', 'F'),
('NGA', 'Nigeria',       '🇳🇬', 'F'),
-- Group G
('ENG', 'England',       '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'G'),
('URU', 'Uruguay',       '🇺🇾', 'G'),
('KOR', 'South Korea',   '🇰🇷', 'G'),
('EGY', 'Egypt',         '🇪🇬', 'G'),
-- Group H
('POR', 'Portugal',      '🇵🇹', 'H'),
('NED', 'Netherlands',   '🇳🇱', 'H'),
('KSA', 'Saudi Arabia',  '🇸🇦', 'H'),
('VEN', 'Venezuela',     '🇻🇪', 'H'),
-- Group I
('ITA', 'Italy',         '🇮🇹', 'I'),
('CHI', 'Chile',         '🇨🇱', 'I'),
('JOR', 'Jordan',        '🇯🇴', 'I'),
('CMR', 'Cameroon',      '🇨🇲', 'I'),
-- Group J
('SUI', 'Switzerland',   '🇨🇭', 'J'),
('HON', 'Honduras',      '🇭🇳', 'J'),
('RSA', 'South Africa',  '🇿🇦', 'J'),
('IRQ', 'Iraq',          '🇮🇶', 'J'),
-- Group K
('AUT', 'Austria',       '🇦🇹', 'K'),
('DEN', 'Denmark',       '🇩🇰', 'K'),
('CRC', 'Costa Rica',    '🇨🇷', 'K'),
('IDN', 'Indonesia',     '🇮🇩', 'K'),
-- Group L
('SCO', 'Scotland',      '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'L'),
('NZL', 'New Zealand',   '🇳🇿', 'L'),
('UZB', 'Uzbekistan',    '🇺🇿', 'L'),
('HUN', 'Hungary',       '🇭🇺', 'L')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- Group Stage Matches (72 total)
-- Format per group [T1,T2,T3,T4]:
--   Round 1: T1 vs T2, T3 vs T4
--   Round 2: T1 vs T3, T2 vs T4
--   Round 3: T1 vs T4, T2 vs T3  (simultaneous pairs)
-- ============================================================

INSERT INTO matches
  (match_number, stage, group_name, home_team, away_team, kickoff_time, venue, city)
VALUES
-- ── Group A ─────────────────────────────────────────────────
(1,  'group','A','CAN','BEL', '2026-06-11 21:00:00+00', 'BC Place',                'Vancouver'),
(2,  'group','A','MAR','CRO', '2026-06-12 00:00:00+00', 'BMO Field',               'Toronto'),
(3,  'group','A','CAN','MAR', '2026-06-17 21:00:00+00', 'BC Place',                'Vancouver'),
(4,  'group','A','BEL','CRO', '2026-06-18 00:00:00+00', 'BMO Field',               'Toronto'),
(5,  'group','A','CAN','CRO', '2026-06-23 21:00:00+00', 'BC Place',                'Vancouver'),
(6,  'group','A','MAR','BEL', '2026-06-23 21:00:00+00', 'Estadio Akron',           'Guadalajara'),

-- ── Group B ─────────────────────────────────────────────────
(7,  'group','B','MEX','SVK', '2026-06-12 21:00:00+00', 'Estadio Azteca',          'Mexico City'),
(8,  'group','B','ECU','SEN', '2026-06-13 00:00:00+00', 'Estadio BBVA',            'Monterrey'),
(9,  'group','B','MEX','ECU', '2026-06-18 21:00:00+00', 'Estadio Azteca',          'Mexico City'),
(10, 'group','B','SVK','SEN', '2026-06-19 00:00:00+00', 'Estadio BBVA',            'Monterrey'),
(11, 'group','B','MEX','SEN', '2026-06-24 21:00:00+00', 'Estadio Azteca',          'Mexico City'),
(12, 'group','B','SVK','ECU', '2026-06-24 21:00:00+00', 'Estadio Akron',           'Guadalajara'),

-- ── Group C ─────────────────────────────────────────────────
(13, 'group','C','USA','TUN', '2026-06-13 21:00:00+00', 'SoFi Stadium',            'Los Angeles'),
(14, 'group','C','SRB','JAM', '2026-06-14 00:00:00+00', 'Hard Rock Stadium',       'Miami'),
(15, 'group','C','USA','SRB', '2026-06-19 21:00:00+00', 'MetLife Stadium',         'New York'),
(16, 'group','C','TUN','JAM', '2026-06-20 00:00:00+00', 'Hard Rock Stadium',       'Miami'),
(17, 'group','C','USA','JAM', '2026-06-25 21:00:00+00', 'SoFi Stadium',            'Los Angeles'),
(18, 'group','C','SRB','TUN', '2026-06-25 21:00:00+00', 'MetLife Stadium',         'New York'),

-- ── Group D ─────────────────────────────────────────────────
(19, 'group','D','FRA','COD', '2026-06-14 21:00:00+00', 'AT&T Stadium',            'Dallas'),
(20, 'group','D','COL','JPN', '2026-06-15 00:00:00+00', 'NRG Stadium',             'Houston'),
(21, 'group','D','FRA','COL', '2026-06-20 21:00:00+00', 'AT&T Stadium',            'Dallas'),
(22, 'group','D','COD','JPN', '2026-06-21 00:00:00+00', 'NRG Stadium',             'Houston'),
(23, 'group','D','FRA','JPN', '2026-06-26 21:00:00+00', 'AT&T Stadium',            'Dallas'),
(24, 'group','D','COL','COD', '2026-06-26 21:00:00+00', 'NRG Stadium',             'Houston'),

-- ── Group E ─────────────────────────────────────────────────
(25, 'group','E','GER','MLI', '2026-06-15 21:00:00+00', 'Levi''s Stadium',         'San Francisco'),
(26, 'group','E','BRA','AUS', '2026-06-16 00:00:00+00', 'Rose Bowl',               'Los Angeles'),
(27, 'group','E','GER','BRA', '2026-06-21 21:00:00+00', 'MetLife Stadium',         'New York'),
(28, 'group','E','MLI','AUS', '2026-06-22 00:00:00+00', 'Levi''s Stadium',         'San Francisco'),
(29, 'group','E','GER','AUS', '2026-06-27 21:00:00+00', 'MetLife Stadium',         'New York'),
(30, 'group','E','BRA','MLI', '2026-06-27 21:00:00+00', 'Rose Bowl',               'Los Angeles'),

-- ── Group F ─────────────────────────────────────────────────
(31, 'group','F','ESP','IRN', '2026-06-16 21:00:00+00', 'Arrowhead Stadium',       'Kansas City'),
(32, 'group','F','ARG','NGA', '2026-06-17 00:00:00+00', 'State Farm Stadium',      'Phoenix'),
(33, 'group','F','ESP','ARG', '2026-06-22 21:00:00+00', 'MetLife Stadium',         'New York'),
(34, 'group','F','IRN','NGA', '2026-06-23 00:00:00+00', 'Arrowhead Stadium',       'Kansas City'),
(35, 'group','F','ESP','NGA', '2026-06-28 21:00:00+00', 'AT&T Stadium',            'Dallas'),
(36, 'group','F','ARG','IRN', '2026-06-28 21:00:00+00', 'State Farm Stadium',      'Phoenix'),

-- ── Group G ─────────────────────────────────────────────────
(37, 'group','G','ENG','EGY', '2026-06-17 21:00:00+00', 'Gillette Stadium',        'Boston'),
(38, 'group','G','URU','KOR', '2026-06-18 00:00:00+00', 'Lincoln Financial Field', 'Philadelphia'),
(39, 'group','G','ENG','URU', '2026-06-23 21:00:00+00', 'Gillette Stadium',        'Boston'),
(40, 'group','G','EGY','KOR', '2026-06-24 00:00:00+00', 'Lincoln Financial Field', 'Philadelphia'),
(41, 'group','G','ENG','KOR', '2026-06-29 21:00:00+00', 'Gillette Stadium',        'Boston'),
(42, 'group','G','URU','EGY', '2026-06-29 21:00:00+00', 'Lincoln Financial Field', 'Philadelphia'),

-- ── Group H ─────────────────────────────────────────────────
(43, 'group','H','POR','VEN', '2026-06-18 21:00:00+00', 'Camping World Stadium',   'Orlando'),
(44, 'group','H','NED','KSA', '2026-06-19 00:00:00+00', 'Lumen Field',             'Seattle'),
(45, 'group','H','POR','NED', '2026-06-24 21:00:00+00', 'Camping World Stadium',   'Orlando'),
(46, 'group','H','VEN','KSA', '2026-06-25 00:00:00+00', 'Lumen Field',             'Seattle'),
(47, 'group','H','POR','KSA', '2026-06-30 21:00:00+00', 'Camping World Stadium',   'Orlando'),
(48, 'group','H','NED','VEN', '2026-06-30 21:00:00+00', 'Lumen Field',             'Seattle'),

-- ── Group I ─────────────────────────────────────────────────
(49, 'group','I','ITA','CMR', '2026-06-19 21:00:00+00', 'Rose Bowl',               'Los Angeles'),
(50, 'group','I','CHI','JOR', '2026-06-20 00:00:00+00', 'SoFi Stadium',            'Los Angeles'),
(51, 'group','I','ITA','CHI', '2026-06-25 21:00:00+00', 'Rose Bowl',               'Los Angeles'),
(52, 'group','I','CMR','JOR', '2026-06-26 00:00:00+00', 'SoFi Stadium',            'Los Angeles'),
(53, 'group','I','ITA','JOR', '2026-07-01 21:00:00+00', 'Rose Bowl',               'Los Angeles'),
(54, 'group','I','CHI','CMR', '2026-07-01 21:00:00+00', 'SoFi Stadium',            'Los Angeles'),

-- ── Group J ─────────────────────────────────────────────────
(55, 'group','J','SUI','IRQ', '2026-06-20 21:00:00+00', 'Levi''s Stadium',         'San Francisco'),
(56, 'group','J','HON','RSA', '2026-06-21 00:00:00+00', 'NRG Stadium',             'Houston'),
(57, 'group','J','SUI','HON', '2026-06-26 21:00:00+00', 'Levi''s Stadium',         'San Francisco'),
(58, 'group','J','IRQ','RSA', '2026-06-27 00:00:00+00', 'NRG Stadium',             'Houston'),
(59, 'group','J','SUI','RSA', '2026-07-02 21:00:00+00', 'Levi''s Stadium',         'San Francisco'),
(60, 'group','J','HON','IRQ', '2026-07-02 21:00:00+00', 'NRG Stadium',             'Houston'),

-- ── Group K ─────────────────────────────────────────────────
(61, 'group','K','AUT','IDN', '2026-06-21 21:00:00+00', 'Arrowhead Stadium',       'Kansas City'),
(62, 'group','K','DEN','CRC', '2026-06-22 00:00:00+00', 'State Farm Stadium',      'Phoenix'),
(63, 'group','K','AUT','DEN', '2026-06-27 21:00:00+00', 'Arrowhead Stadium',       'Kansas City'),
(64, 'group','K','IDN','CRC', '2026-06-28 00:00:00+00', 'State Farm Stadium',      'Phoenix'),
(65, 'group','K','AUT','CRC', '2026-07-03 21:00:00+00', 'Arrowhead Stadium',       'Kansas City'),
(66, 'group','K','DEN','IDN', '2026-07-03 21:00:00+00', 'State Farm Stadium',      'Phoenix'),

-- ── Group L ─────────────────────────────────────────────────
(67, 'group','L','SCO','UZB', '2026-06-22 21:00:00+00', 'BMO Field',               'Toronto'),
(68, 'group','L','NZL','HUN', '2026-06-23 00:00:00+00', 'BC Place',                'Vancouver'),
(69, 'group','L','SCO','NZL', '2026-06-28 21:00:00+00', 'BMO Field',               'Toronto'),
(70, 'group','L','UZB','HUN', '2026-06-29 00:00:00+00', 'BC Place',                'Vancouver'),
(71, 'group','L','SCO','HUN', '2026-07-04 21:00:00+00', 'BMO Field',               'Toronto'),
(72, 'group','L','NZL','UZB', '2026-07-04 21:00:00+00', 'BC Place',                'Vancouver')

ON CONFLICT (match_number) DO NOTHING;

-- ============================================================
-- Knockout Placeholder Matches (R32 through Final)
-- Teams are NULL until the admin assigns them after group stage.
-- home_placeholder / away_placeholder show who qualifies.
-- ============================================================

INSERT INTO matches
  (match_number, stage, home_placeholder, away_placeholder, kickoff_time, venue, city)
VALUES
-- Round of 32 (matches 73-88)
(73,  'r32', '1A', '3D/E/F', '2026-07-06 21:00:00+00', 'MetLife Stadium',         'New York'),
(74,  'r32', '1B', '3G/H/I', '2026-07-07 00:00:00+00', 'AT&T Stadium',            'Dallas'),
(75,  'r32', '1C', '3J/K/L', '2026-07-07 21:00:00+00', 'SoFi Stadium',            'Los Angeles'),
(76,  'r32', '1D', '2B',     '2026-07-08 00:00:00+00', 'NRG Stadium',             'Houston'),
(77,  'r32', '1E', '2A',     '2026-07-08 21:00:00+00', 'Rose Bowl',               'Los Angeles'),
(78,  'r32', '1F', '2C',     '2026-07-09 00:00:00+00', 'Levi''s Stadium',         'San Francisco'),
(79,  'r32', '1G', '2D',     '2026-07-09 21:00:00+00', 'Gillette Stadium',        'Boston'),
(80,  'r32', '1H', '2E',     '2026-07-10 00:00:00+00', 'Lincoln Financial Field', 'Philadelphia'),
(81,  'r32', '1I', '2F',     '2026-07-10 21:00:00+00', 'Camping World Stadium',   'Orlando'),
(82,  'r32', '1J', '2G',     '2026-07-11 00:00:00+00', 'Arrowhead Stadium',       'Kansas City'),
(83,  'r32', '1K', '2H',     '2026-07-11 21:00:00+00', 'BMO Field',               'Toronto'),
(84,  'r32', '1L', '2I',     '2026-07-12 00:00:00+00', 'BC Place',                'Vancouver'),
(85,  'r32', '2J', '2K',     '2026-07-12 21:00:00+00', 'State Farm Stadium',      'Phoenix'),
(86,  'r32', '2L', '3A/B/C', '2026-07-13 00:00:00+00', 'Estadio Azteca',          'Mexico City'),
(87,  'r32', 'W73','W74',    '2026-07-13 21:00:00+00', 'MetLife Stadium',         'New York'),
(88,  'r32', 'W75','W76',    '2026-07-14 00:00:00+00', 'AT&T Stadium',            'Dallas'),

-- Round of 16 (matches 89-96)
(89,  'r16', 'W77','W78',    '2026-07-18 21:00:00+00', 'MetLife Stadium',         'New York'),
(90,  'r16', 'W79','W80',    '2026-07-19 00:00:00+00', 'AT&T Stadium',            'Dallas'),
(91,  'r16', 'W81','W82',    '2026-07-19 21:00:00+00', 'Rose Bowl',               'Los Angeles'),
(92,  'r16', 'W83','W84',    '2026-07-20 00:00:00+00', 'NRG Stadium',             'Houston'),
(93,  'r16', 'W85','W86',    '2026-07-20 21:00:00+00', 'Levi''s Stadium',         'San Francisco'),
(94,  'r16', 'W87','W88',    '2026-07-21 00:00:00+00', 'SoFi Stadium',            'Los Angeles'),
(95,  'r16', 'W89','W90',    '2026-07-21 21:00:00+00', 'Gillette Stadium',        'Boston'),
(96,  'r16', 'W91','W92',    '2026-07-22 00:00:00+00', 'Lincoln Financial Field', 'Philadelphia'),

-- Quarter-finals (matches 97-100)
(97,  'qf',  'W93','W94',    '2026-07-25 21:00:00+00', 'MetLife Stadium',         'New York'),
(98,  'qf',  'W95','W96',    '2026-07-26 00:00:00+00', 'AT&T Stadium',            'Dallas'),
(99,  'qf',  'W89 winner','W90 winner', '2026-07-26 21:00:00+00', 'Rose Bowl',    'Los Angeles'),
(100, 'qf',  'W91 winner','W92 winner', '2026-07-27 00:00:00+00', 'NRG Stadium',  'Houston'),

-- Semi-finals (matches 101-102)
(101, 'sf',  'W97','W98',    '2026-07-30 21:00:00+00', 'MetLife Stadium',         'New York'),
(102, 'sf',  'W99','W100',   '2026-07-31 21:00:00+00', 'AT&T Stadium',            'Dallas'),

-- Third place play-off (match 103)
(103, '3rd', 'L101','L102',  '2026-08-04 21:00:00+00', 'AT&T Stadium',            'Dallas'),

-- Final (match 104)
(104, 'final','W101','W102', '2026-08-05 21:00:00+00', 'MetLife Stadium',         'New York')

ON CONFLICT (match_number) DO NOTHING;
