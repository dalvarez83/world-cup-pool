-- WC 2026 Seed Data — all 104 matches
-- Schedule verified against the official FIFA draw and Wikipedia group/fixture pages (May 2026).
-- All timestamps are UTC.
--
-- Groups: A-L, 4 teams each, 6 matches per group (72 total group stage)
-- Knockout: R32 (73-88), R16 (89-96), QF (97-100), SF (101-102), 3rd (103), Final (104)

-- ═══════════════════════════════════════════════════════════════
-- GROUP STAGE (matches 1-72)
-- ═══════════════════════════════════════════════════════════════

-- ── Group A: Mexico, South Africa, South Korea, Czech Republic ──────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(1,'group','A',1,'Mexico','South Africa','2026-06-11 19:00:00+00'),
(2,'group','A',2,'South Korea','Czech Republic','2026-06-12 02:00:00+00'),
(3,'group','A',3,'Czech Republic','South Africa','2026-06-18 16:00:00+00'),
(4,'group','A',4,'Mexico','South Korea','2026-06-19 01:00:00+00'),
(5,'group','A',5,'Czech Republic','Mexico','2026-06-25 01:00:00+00'),
(6,'group','A',6,'South Africa','South Korea','2026-06-25 01:00:00+00');

-- ── Group B: Canada, Bosnia and Herzegovina, Qatar, Switzerland ──────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(7,'group','B',1,'Canada','Bosnia and Herzegovina','2026-06-12 19:00:00+00'),
(8,'group','B',2,'Qatar','Switzerland','2026-06-13 19:00:00+00'),
(9,'group','B',3,'Switzerland','Bosnia and Herzegovina','2026-06-18 19:00:00+00'),
(10,'group','B',4,'Canada','Qatar','2026-06-18 22:00:00+00'),
(11,'group','B',5,'Switzerland','Canada','2026-06-24 19:00:00+00'),
(12,'group','B',6,'Bosnia and Herzegovina','Qatar','2026-06-24 19:00:00+00');

-- ── Group C: Brazil, Morocco, Haiti, Scotland ────────────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(13,'group','C',1,'Brazil','Morocco','2026-06-13 22:00:00+00'),
(14,'group','C',2,'Haiti','Scotland','2026-06-14 01:00:00+00'),
(15,'group','C',3,'Scotland','Morocco','2026-06-19 22:00:00+00'),
(16,'group','C',4,'Brazil','Haiti','2026-06-20 00:30:00+00'),
(17,'group','C',5,'Scotland','Brazil','2026-06-24 22:00:00+00'),
(18,'group','C',6,'Morocco','Haiti','2026-06-24 22:00:00+00');

-- ── Group D: United States, Paraguay, Australia, Turkey ──────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(19,'group','D',1,'United States','Paraguay','2026-06-13 01:00:00+00'),
(20,'group','D',2,'Australia','Turkey','2026-06-14 04:00:00+00'),
(21,'group','D',3,'United States','Australia','2026-06-19 19:00:00+00'),
(22,'group','D',4,'Turkey','Paraguay','2026-06-20 03:00:00+00'),
(23,'group','D',5,'Turkey','United States','2026-06-26 02:00:00+00'),
(24,'group','D',6,'Paraguay','Australia','2026-06-26 02:00:00+00');

-- ── Group E: Germany, Curaçao, Ivory Coast, Ecuador ─────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(25,'group','E',1,'Germany','Curaçao','2026-06-14 17:00:00+00'),
(26,'group','E',2,'Ivory Coast','Ecuador','2026-06-14 23:00:00+00'),
(27,'group','E',3,'Germany','Ivory Coast','2026-06-20 20:00:00+00'),
(28,'group','E',4,'Ecuador','Curaçao','2026-06-20 23:00:00+00'),
(29,'group','E',5,'Curaçao','Ivory Coast','2026-06-25 20:00:00+00'),
(30,'group','E',6,'Ecuador','Germany','2026-06-25 20:00:00+00');

-- ── Group F: Netherlands, Japan, Sweden, Tunisia ─────────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(31,'group','F',1,'Netherlands','Japan','2026-06-14 19:00:00+00'),
(32,'group','F',2,'Sweden','Tunisia','2026-06-15 02:00:00+00'),
(33,'group','F',3,'Netherlands','Sweden','2026-06-20 16:00:00+00'),
(34,'group','F',4,'Tunisia','Japan','2026-06-21 04:00:00+00'),
(35,'group','F',5,'Japan','Sweden','2026-06-25 22:00:00+00'),
(36,'group','F',6,'Tunisia','Netherlands','2026-06-25 22:00:00+00');

-- ── Group G: Belgium, Egypt, Iran, New Zealand ───────────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(37,'group','G',1,'Belgium','Egypt','2026-06-15 19:00:00+00'),
(38,'group','G',2,'Iran','New Zealand','2026-06-16 01:00:00+00'),
(39,'group','G',3,'Belgium','Iran','2026-06-21 19:00:00+00'),
(40,'group','G',4,'New Zealand','Egypt','2026-06-22 01:00:00+00'),
(41,'group','G',5,'Egypt','Iran','2026-06-27 03:00:00+00'),
(42,'group','G',6,'New Zealand','Belgium','2026-06-27 03:00:00+00');

-- ── Group H: Spain, Cape Verde, Saudi Arabia, Uruguay ────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(43,'group','H',1,'Spain','Cape Verde','2026-06-15 16:00:00+00'),
(44,'group','H',2,'Saudi Arabia','Uruguay','2026-06-15 22:00:00+00'),
(45,'group','H',3,'Spain','Saudi Arabia','2026-06-21 16:00:00+00'),
(46,'group','H',4,'Uruguay','Cape Verde','2026-06-21 22:00:00+00'),
(47,'group','H',5,'Cape Verde','Saudi Arabia','2026-06-27 00:00:00+00'),
(48,'group','H',6,'Uruguay','Spain','2026-06-27 00:00:00+00');

-- ── Group I: France, Senegal, Iraq, Norway ───────────────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(49,'group','I',1,'France','Senegal','2026-06-16 19:00:00+00'),
(50,'group','I',2,'Iraq','Norway','2026-06-16 22:00:00+00'),
(51,'group','I',3,'France','Iraq','2026-06-22 21:00:00+00'),
(52,'group','I',4,'Norway','Senegal','2026-06-23 00:00:00+00'),
(53,'group','I',5,'Norway','France','2026-06-26 19:00:00+00'),
(54,'group','I',6,'Senegal','Iraq','2026-06-26 19:00:00+00');

-- ── Group J: Argentina, Algeria, Austria, Jordan ─────────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(55,'group','J',1,'Argentina','Algeria','2026-06-17 01:00:00+00'),
(56,'group','J',2,'Austria','Jordan','2026-06-17 04:00:00+00'),
(57,'group','J',3,'Argentina','Austria','2026-06-22 17:00:00+00'),
(58,'group','J',4,'Jordan','Algeria','2026-06-23 03:00:00+00'),
(59,'group','J',5,'Algeria','Austria','2026-06-28 02:00:00+00'),
(60,'group','J',6,'Jordan','Argentina','2026-06-28 02:00:00+00');

-- ── Group K: Portugal, DR Congo, Uzbekistan, Colombia ────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(61,'group','K',1,'Portugal','DR Congo','2026-06-17 17:00:00+00'),
(62,'group','K',2,'Uzbekistan','Colombia','2026-06-18 02:00:00+00'),
(63,'group','K',3,'Portugal','Uzbekistan','2026-06-23 17:00:00+00'),
(64,'group','K',4,'Colombia','DR Congo','2026-06-24 02:00:00+00'),
(65,'group','K',5,'Colombia','Portugal','2026-06-27 23:30:00+00'),
(66,'group','K',6,'DR Congo','Uzbekistan','2026-06-27 23:30:00+00');

-- ── Group L: England, Croatia, Ghana, Panama ─────────────────────────────────

insert into matches (id,stage,group_letter,match_number,home_team,away_team,match_date) values
(67,'group','L',1,'England','Croatia','2026-06-17 20:00:00+00'),
(68,'group','L',2,'Ghana','Panama','2026-06-17 23:00:00+00'),
(69,'group','L',3,'England','Ghana','2026-06-23 20:00:00+00'),
(70,'group','L',4,'Panama','Croatia','2026-06-23 23:00:00+00'),
(71,'group','L',5,'Panama','England','2026-06-27 21:00:00+00'),
(72,'group','L',6,'Croatia','Ghana','2026-06-27 21:00:00+00');

-- ═══════════════════════════════════════════════════════════════
-- ROUND OF 32 (matches 73-88)
-- Placeholders: W-X = Winner Group X, R-X = Runner-up Group X
--               T3-N = Nth 3rd-place slot (group pool in home_team description)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date) values
(73,'r32', 1,'Runner-up Group A',    'Runner-up Group B',     'R-A',  'R-B',  '2026-06-28 19:00:00+00'),
(74,'r32', 2,'Winner Group E',       'Best 3rd A/B/C/D/F',   'W-E',  'T3-1', '2026-06-29 20:30:00+00'),
(75,'r32', 3,'Winner Group F',       'Runner-up Group C',     'W-F',  'R-C',  '2026-06-30 01:00:00+00'),
(76,'r32', 4,'Winner Group C',       'Runner-up Group F',     'W-C',  'R-F',  '2026-06-29 17:00:00+00'),
(77,'r32', 5,'Winner Group I',       'Best 3rd C/D/F/G/H',   'W-I',  'T3-2', '2026-06-30 21:00:00+00'),
(78,'r32', 6,'Runner-up Group E',    'Runner-up Group I',     'R-E',  'R-I',  '2026-06-30 17:00:00+00'),
(79,'r32', 7,'Winner Group A',       'Best 3rd C/E/F/H/I',   'W-A',  'T3-3', '2026-07-01 01:00:00+00'),
(80,'r32', 8,'Winner Group L',       'Best 3rd E/H/I/J/K',   'W-L',  'T3-4', '2026-07-01 16:00:00+00'),
(81,'r32', 9,'Winner Group D',       'Best 3rd B/E/F/I/J',   'W-D',  'T3-5', '2026-07-02 00:00:00+00'),
(82,'r32',10,'Winner Group G',       'Best 3rd A/E/H/I/J',   'W-G',  'T3-6', '2026-07-01 20:00:00+00'),
(83,'r32',11,'Runner-up Group K',    'Runner-up Group L',     'R-K',  'R-L',  '2026-07-02 23:00:00+00'),
(84,'r32',12,'Winner Group H',       'Runner-up Group J',     'W-H',  'R-J',  '2026-07-02 19:00:00+00'),
(85,'r32',13,'Winner Group B',       'Best 3rd E/F/G/I/J',   'W-B',  'T3-7', '2026-07-03 03:00:00+00'),
(86,'r32',14,'Winner Group J',       'Runner-up Group H',     'W-J',  'R-H',  '2026-07-03 22:00:00+00'),
(87,'r32',15,'Winner Group K',       'Best 3rd D/E/I/J/L',   'W-K',  'T3-8', '2026-07-04 01:30:00+00'),
(88,'r32',16,'Runner-up Group D',    'Runner-up Group G',     'R-D',  'R-G',  '2026-07-03 18:00:00+00');

-- ═══════════════════════════════════════════════════════════════
-- ROUND OF 16 (matches 89-96)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(89,'r16',1,'Winner R32-M74','Winner R32-M77','W-74','W-77','2026-07-04 21:00:00+00',74,77),
(90,'r16',2,'Winner R32-M73','Winner R32-M75','W-73','W-75','2026-07-04 17:00:00+00',73,75),
(91,'r16',3,'Winner R32-M76','Winner R32-M78','W-76','W-78','2026-07-05 20:00:00+00',76,78),
(92,'r16',4,'Winner R32-M79','Winner R32-M80','W-79','W-80','2026-07-06 00:00:00+00',79,80),
(93,'r16',5,'Winner R32-M83','Winner R32-M84','W-83','W-84','2026-07-06 19:00:00+00',83,84),
(94,'r16',6,'Winner R32-M81','Winner R32-M82','W-81','W-82','2026-07-07 00:00:00+00',81,82),
(95,'r16',7,'Winner R32-M86','Winner R32-M88','W-86','W-88','2026-07-07 16:00:00+00',86,88),
(96,'r16',8,'Winner R32-M85','Winner R32-M87','W-85','W-87','2026-07-07 20:00:00+00',85,87);

-- ═══════════════════════════════════════════════════════════════
-- QUARTERFINALS (matches 97-100)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(97,'qf',1,'Winner R16-M89','Winner R16-M90','W-89','W-90','2026-07-09 20:00:00+00',89,90),
(98,'qf',2,'Winner R16-M93','Winner R16-M94','W-93','W-94','2026-07-10 19:00:00+00',93,94),
(99,'qf',3,'Winner R16-M91','Winner R16-M92','W-91','W-92','2026-07-11 21:00:00+00',91,92),
(100,'qf',4,'Winner R16-M95','Winner R16-M96','W-95','W-96','2026-07-12 01:00:00+00',95,96);

-- ═══════════════════════════════════════════════════════════════
-- SEMIFINALS (matches 101-102)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(101,'sf',1,'Winner QF-M97','Winner QF-M98','W-97','W-98','2026-07-14 19:00:00+00',97,98),
(102,'sf',2,'Winner QF-M99','Winner QF-M100','W-99','W-100','2026-07-15 19:00:00+00',99,100);

-- ═══════════════════════════════════════════════════════════════
-- THIRD PLACE MATCH (103)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id,source_home_is_loser,source_away_is_loser) values
(103,'third_place',1,'SF-1 Loser','SF-2 Loser','L-101','L-102','2026-07-18 21:00:00+00',101,102,true,true);

-- ═══════════════════════════════════════════════════════════════
-- FINAL (104)
-- ═══════════════════════════════════════════════════════════════

insert into matches (id,stage,match_number,home_team,away_team,home_team_placeholder,away_team_placeholder,match_date,source_home_match_id,source_away_match_id) values
(104,'final',1,'SF-1 Winner','SF-2 Winner','W-101','W-102','2026-07-19 19:00:00+00',101,102);
